import { BigQuery } from '@google-cloud/bigquery'
import { ResultSetHeader } from 'mysql2'
import cron from 'node-cron'
import pool from '../../db/connection'

const bq = new BigQuery()

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface MGMReferral {
  id: number
  ambassador_id: number
  nombre_negocio: string
  referred_email: string
  created_at: Date
}

interface MGBReferral {
  id: number
  ambassador_id: number
  buyer_email: string | null
  buyer_dni: string | null
  created_at: Date
}

interface SellerMetrics {
  active_listings: number
  total_txs: number
  total_nmv: number
}

interface BuyerMetrics {
  total_orders: number
  total_gmv: number
  orders_en_60_dias: number
}

// ─── Definición de hitos ─────────────────────────────────────────────────────

const MGM_MILESTONES: Array<{
  tipo: string
  coins: number
  check: (m: SellerMetrics) => boolean
}> = [
  { tipo: 'catalogo_10',      coins: 130, check: (m) => m.active_listings >= 10 },
  { tipo: 'catalogo_30',      coins: 260, check: (m) => m.active_listings >= 30 },
  { tipo: 'catalogo_100',     coins: 390, check: (m) => m.active_listings >= 100 },
  { tipo: 'primera_venta',    coins: 195, check: (m) => m.total_txs >= 1 },
  { tipo: 'seller_desarrollo', coins: 390, check: (m) => m.total_txs >= 10 && m.total_nmv >= 1000 },
  { tipo: 'seller_activado',  coins: 585, check: (m) => m.total_txs >= 25 && m.total_nmv >= 3000 },
]

const MGB_MILESTONES: Array<{
  tipo: string
  coins: number
  check: (m: BuyerMetrics) => boolean
}> = [
  { tipo: 'primera_compra',      coins: 50,  check: (m) => m.total_orders >= 1 },
  { tipo: 'recurrencia',         coins: 75,  check: (m) => m.orders_en_60_dias >= 2 },
  { tipo: 'buyer_desarrollado',  coins: 100, check: (m) => m.total_gmv >= 300 },
]

// ─── BigQuery helpers ─────────────────────────────────────────────────────────

async function getSellerMetrics(
  sellerId: string,
  fechaRegistro: Date
): Promise<SellerMetrics> {
  // NOTE: sellerId aquí es el referred_email del referido. En producción debe
  // resolverse al CUS_CUST_ID_SEL numérico del seller en los sistemas MeLi.
  const [listingsRows] = await bq.query({
    query: `
      SELECT
        CUS_CUST_ID_SEL AS seller_id,
        COUNT(DISTINCT IF(ITE_ITEM_STATUS = 'active', ITE_ITEM_ID, NULL)) AS active_listings
      FROM \`meli-bi-data.WHOWNER.LK_ITE_ITEMS\`
      WHERE CUS_CUST_ID_SEL = @seller_id
        AND ITE_ITEM_DATE_CREATED_DTTM > @fecha_registro
      GROUP BY CUS_CUST_ID_SEL
    `,
    params: { seller_id: sellerId, fecha_registro: fechaRegistro.toISOString() },
  })

  const [txsRows] = await bq.query({
    query: `
      SELECT
        seller_id,
        CAST(SUM(TXS) AS INT64) AS total_txs,
        CAST(SUM(TGMV_FORECAST) AS INT64) AS total_nmv
      FROM \`dev-mlc-546.MASTER.MASTER_SITES\`
      WHERE seller_id = @seller_id
        AND T_DATE > @fecha_registro
      GROUP BY seller_id
    `,
    params: { seller_id: sellerId, fecha_registro: fechaRegistro.toISOString() },
  })

  const lr = (listingsRows as Record<string, unknown>[])[0]
  const tr = (txsRows as Record<string, unknown>[])[0]

  return {
    active_listings: Number(lr?.active_listings ?? 0),
    total_txs: Number(tr?.total_txs ?? 0),
    total_nmv: Number(tr?.total_nmv ?? 0),
  }
}

async function getBuyerMetrics(
  buyerId: string,
  fechaRegistro: Date
): Promise<BuyerMetrics | null> {
  // NOTE: buyerId aquí es el buyer_email o buyer_dni. En producción debe
  // resolverse al ORD_BUYER.id numérico del buyer en los sistemas MeLi.
  const [rows] = await bq.query({
    query: `
      SELECT
        ORD_BUYER.id AS buyer_id,
        COUNT(DISTINCT ORD_ORDER_ID) AS total_orders,
        SUM(IF(ORD_GMV_FLG = TRUE, ORD_TOTAL_AMOUNT, 0)) AS total_gmv,
        MIN(ORD_CLOSED_DT) AS primera_compra_dt,
        COUNTIF(ORD_CLOSED_DT <= DATE_ADD(
          MIN(ORD_CLOSED_DT) OVER (PARTITION BY ORD_BUYER.id),
          INTERVAL 60 DAY
        )) AS orders_en_60_dias
      FROM \`bi-meli.WHOWNER_TBL.BT_ORD_ORDERS\`
      WHERE ORD_BUYER.id = @buyer_id
        AND SIT_SITE_ID = 'MPE'
        AND ORD_FULFILLED_FLG = TRUE
        AND ORD_RESERVE_FLG = FALSE
        AND ORD_AUTO_OFFER_FLG = FALSE
        AND ORD_CLOSED_DT >= @fecha_registro_buyer
      GROUP BY ORD_BUYER.id
    `,
    params: { buyer_id: buyerId, fecha_registro_buyer: fechaRegistro.toISOString() },
  })

  const row = (rows as Record<string, unknown>[])[0]
  if (!row) return null

  return {
    total_orders: Number(row.total_orders ?? 0),
    total_gmv: Number(row.total_gmv ?? 0),
    orders_en_60_dias: Number(row.orders_en_60_dias ?? 0),
  }
}

// ─── MySQL helpers ────────────────────────────────────────────────────────────

async function creditMilestone(params: {
  table: 'milestones_mgm' | 'milestones_mgb'
  referralField: 'referral_id' | 'referral_mgb_id'
  referralId: number
  ambassadorId: number
  tipo: string
  coins: number
  descripcion: string
}): Promise<boolean> {
  const { table, referralField, referralId, ambassadorId, tipo, coins, descripcion } = params

  const [result] = await pool.execute(
    `INSERT IGNORE INTO ${table} (${referralField}, tipo, coins) VALUES (?, ?, ?)`,
    [referralId, tipo, coins]
  )

  if ((result as ResultSetHeader).affectedRows === 0) return false

  await pool.execute(
    'UPDATE ambassadors SET coins_balance = coins_balance + ? WHERE id = ?',
    [coins, ambassadorId]
  )

  await pool.execute(
    "INSERT INTO wallet_transactions (ambassador_id, coins, tipo, descripcion) VALUES (?, ?, 'credito', ?)",
    [ambassadorId, coins, descripcion]
  )

  return true
}

async function checkConsistencyBonus(ambassadorId: number): Promise<void> {
  const [countRows] = await pool.execute(
    `SELECT COUNT(DISTINCT m.referral_id) AS cnt
     FROM milestones_mgm m
     JOIN referrals_mgm r ON m.referral_id = r.id
     WHERE r.ambassador_id = ? AND m.tipo = 'seller_activado'`,
    [ambassadorId]
  )

  const count = Number((countRows as Record<string, unknown>[])[0]?.cnt ?? 0)
  if (count !== 3) return

  const [bonusRows] = await pool.execute(
    "SELECT id FROM wallet_transactions WHERE ambassador_id = ? AND descripcion LIKE 'Bonus consistencia%' LIMIT 1",
    [ambassadorId]
  )

  if ((bonusRows as unknown[]).length > 0) return

  await pool.execute(
    'UPDATE ambassadors SET coins_balance = coins_balance + 650 WHERE id = ?',
    [ambassadorId]
  )

  await pool.execute(
    "INSERT INTO wallet_transactions (ambassador_id, coins, tipo, descripcion) VALUES (?, 650, 'credito', 'Bonus consistencia: 3 sellers activados')",
    [ambassadorId]
  )
}

// ─── Funciones exportadas ─────────────────────────────────────────────────────

export async function validateMGM(): Promise<void> {
  const [referrals] = await pool.execute(
    `SELECT r.id, r.ambassador_id, r.nombre_negocio, r.referred_email, r.created_at
     FROM referrals_mgm r
     WHERE r.estado = 'activo' AND r.expires_at > NOW()`
  )

  const rows = referrals as MGMReferral[]
  let totalNew = 0
  let totalCoins = 0

  console.log(`[validateMGM] Iniciando — ${rows.length} referidos activos`)

  for (const referral of rows) {
    try {
      const metrics = await getSellerMetrics(referral.referred_email, referral.created_at)

      for (const milestone of MGM_MILESTONES) {
        if (!milestone.check(metrics)) continue

        const credited = await creditMilestone({
          table: 'milestones_mgm',
          referralField: 'referral_id',
          referralId: referral.id,
          ambassadorId: referral.ambassador_id,
          tipo: milestone.tipo,
          coins: milestone.coins,
          descripcion: `Hito ${milestone.tipo} - referido ${referral.nombre_negocio}`,
        })

        if (credited) {
          totalNew++
          totalCoins += milestone.coins
          if (milestone.tipo === 'seller_activado') {
            await checkConsistencyBonus(referral.ambassador_id)
          }
        }
      }
    } catch (err) {
      console.error(`[validateMGM] Error en referral ${referral.id}:`, err)
    }
  }

  console.log(
    `[validateMGM] Fin — ${rows.length} referidos procesados, ${totalNew} hitos nuevos, ${totalCoins} coins acreditados`
  )
}

export async function validateMGB(): Promise<void> {
  const [referrals] = await pool.execute(
    `SELECT r.id, r.ambassador_id, r.buyer_email, r.buyer_dni, r.created_at
     FROM referrals_mgb r
     WHERE r.coupon_redeemed = TRUE AND r.expires_at > NOW()`
  )

  const rows = referrals as MGBReferral[]
  let totalNew = 0
  let totalCoins = 0

  console.log(`[validateMGB] Iniciando — ${rows.length} referidos activos`)

  for (const referral of rows) {
    try {
      const buyerIdentifier = referral.buyer_email ?? referral.buyer_dni
      if (!buyerIdentifier) continue

      // Regla DNI único: el buyer_dni no puede estar ya acreditado para
      // este ambassador en otro referido
      if (referral.buyer_dni) {
        const [dniRows] = await pool.execute(
          `SELECT mb.id
           FROM milestones_mgb mb
           JOIN referrals_mgb rb ON mb.referral_mgb_id = rb.id
           WHERE rb.ambassador_id = ? AND rb.buyer_dni = ? AND rb.id != ?
           LIMIT 1`,
          [referral.ambassador_id, referral.buyer_dni, referral.id]
        )

        if ((dniRows as unknown[]).length > 0) {
          console.log(`[validateMGB] Referral ${referral.id} omitido — DNI ya acreditado para este ambassador`)
          continue
        }
      }

      const metrics = await getBuyerMetrics(buyerIdentifier, referral.created_at)
      if (!metrics) continue

      for (const milestone of MGB_MILESTONES) {
        if (!milestone.check(metrics)) continue

        const credited = await creditMilestone({
          table: 'milestones_mgb',
          referralField: 'referral_mgb_id',
          referralId: referral.id,
          ambassadorId: referral.ambassador_id,
          tipo: milestone.tipo,
          coins: milestone.coins,
          descripcion: `Hito ${milestone.tipo} - buyer ${buyerIdentifier}`,
        })

        if (credited) {
          totalNew++
          totalCoins += milestone.coins
        }
      }
    } catch (err) {
      console.error(`[validateMGB] Error en referral ${referral.id}:`, err)
    }
  }

  console.log(
    `[validateMGB] Fin — ${rows.length} referidos procesados, ${totalNew} hitos nuevos, ${totalCoins} coins acreditados`
  )
}

export async function runDailyValidation(): Promise<void> {
  console.log('[runDailyValidation] Iniciando validación diaria:', new Date().toISOString())
  await validateMGM()
  await validateMGB()
  console.log('[runDailyValidation] Validación diaria completa:', new Date().toISOString())
}

// 3:00 AM hora Lima (America/Lima = UTC-5)
cron.schedule(
  '0 3 * * *',
  () => {
    runDailyValidation().catch((err) => {
      console.error('[runDailyValidation] Error fatal:', err)
    })
  },
  { timezone: 'America/Lima' }
)
