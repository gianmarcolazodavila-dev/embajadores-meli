import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  getEmbajador, getReferidosMGM, getWallet,
  type GASEmbajador, type GASReferralMGM, type GASTransaction,
} from '../lib/gas'

// ─── Datos estáticos ──────────────────────────────────────────────────────────

const MERCADO_LABELS: Record<string, string> = {
  wilson: 'Wilson',
  polvos_azules: 'Polvos Azules',
  polvos_rosados: 'Polvos Rosados',
}

const ESTADO_STYLES: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  validado:  'bg-blue-100 text-blue-800',
  activo:    'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-700',
}

const MGM_MILESTONE_TYPES = [
  { tipo: 'catalogo_10',       label: '10 pub.' },
  { tipo: 'catalogo_30',       label: '30 pub.' },
  { tipo: 'catalogo_100',      label: '100 pub.' },
  { tipo: 'primera_venta',     label: '1ª venta' },
  { tipo: 'seller_desarrollo', label: 'Desarro.' },
  { tipo: 'seller_activado',   label: 'Activado' },
]

const PRIZES = [
  { name: 'Gift card S/30',  coins: 300 },
  { name: 'Gift card S/50',  coins: 500 },
  { name: 'Audífonos',       coins: 1500 },
  { name: 'Sesión de fotos', coins: 1500 },
  { name: 'Smartwatch',      coins: 4000 },
  { name: 'Smartphone',      coins: 10000 },
]

function daysLeft(expiresAt: string | null | undefined): string {
  if (!expiresAt) return '—'
  const diff = new Date(expiresAt).getTime() - Date.now()
  return `${Math.max(0, Math.ceil(diff / 86_400_000))}d`
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Embajador() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') ?? ''

  const [embajador, setEmbajador]   = useState<GASEmbajador | null>(null)
  const [referrals, setReferrals]   = useState<GASReferralMGM[]>([])
  const [transactions, setTransactions] = useState<GASTransaction[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [copied, setCopied]         = useState(false)

  useEffect(() => {
    if (!id) { navigate('/login', { replace: true }); return }

    Promise.all([
      getEmbajador(id),
      getReferidosMGM(id),
      getWallet(id),
    ])
      .then(([emb, refs, txs]) => {
        setEmbajador(emb)
        setReferrals(refs)
        setTransactions(txs.slice(0, 20))
      })
      .catch(() => setError('No se pudieron cargar los datos. Intentá de nuevo.'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const copyLink = () => {
    if (!embajador?.coupon_code) return
    navigator.clipboard
      .writeText(`https://www.mercadolibre.com.pe/?ref=${embajador.coupon_code}`)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => {})
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-[#3483FA] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-400">Cargando tu dashboard…</p>
        </div>
      </div>
    )
  }

  if (error || !embajador) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-sm w-full">
          <p className="text-red-500 text-sm mb-4">{error || 'Embajador no encontrado.'}</p>
          <button onClick={() => navigate('/login')}
            className="text-sm text-[#3483FA] hover:underline">
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  const balance = embajador.coins_balance ?? 0

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Header ── */}
      <header className="bg-[#FFE600] px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              Hola, {embajador.nombre}
            </h1>
            {embajador.mercado && (
              <span className="bg-gray-900 text-[#FFE600] text-xs font-semibold px-3 py-1 rounded-full">
                {MERCADO_LABELS[embajador.mercado] ?? embajador.mercado}
              </span>
            )}
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* ── Wallet ── */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Mis Meli Coins
          </h2>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-6xl font-black text-[#3483FA] leading-none">
              {balance.toLocaleString('es-PE')}
            </span>
            <span className="text-xl text-gray-400 mb-1">coins</span>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            ≈ S/ {(balance / 10).toLocaleString('es-PE', { minimumFractionDigits: 2 })} de valor referencial
          </p>

          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Últimas transacciones
          </h3>
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-400">Sin transacciones aún.</p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[380px]">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-2 pl-2 font-medium w-32">Fecha</th>
                    <th className="pb-2 font-medium">Descripción</th>
                    <th className="pb-2 pr-2 font-medium text-right w-24">Coins</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={tx.id ?? i} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 pl-2 text-gray-400 whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleDateString('es-PE', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td className="py-2.5 text-gray-700 pr-4">{tx.descripcion}</td>
                      <td className={`py-2.5 pr-2 text-right font-semibold whitespace-nowrap ${
                        tx.tipo === 'credito' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {tx.tipo === 'credito' ? '+' : '−'}{tx.coins.toLocaleString('es-PE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── Cupón MGB ── */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Mi cupón MGB
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-4xl font-black tracking-widest text-gray-900 font-mono">
              {embajador.coupon_code ?? '—'}
            </span>
            {embajador.coupon_code && (
              <button
                onClick={copyLink}
                className="bg-[#3483FA] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
              >
                {copied ? '¡Copiado!' : 'Copiar link'}
              </button>
            )}
          </div>
        </section>

        {/* ── Referidos MGM ── */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Mis referidos MGM
          </h2>
          {referrals.length === 0 ? (
            <p className="text-sm text-gray-400">
              Aún no tenés referidos. Hablá con tu asesor para registrar tu primer negocio.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-2 pl-2 font-medium">Negocio</th>
                    <th className="pb-2 font-medium">Estado</th>
                    <th className="pb-2 font-medium text-center w-24">Días rest.</th>
                    <th className="pb-2 pr-2 font-medium">Hitos</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r, i) => {
                    const achieved = new Set(r.milestones.map((m) => m.tipo))
                    return (
                      <tr key={r.id ?? i} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pl-2 pr-4">
                          <p className="font-semibold text-gray-900">{r.nombre_negocio}</p>
                          {r.estado === 'rechazado' && r.motivo_rechazo && (
                            <p className="text-xs text-red-500 mt-0.5">{r.motivo_rechazo}</p>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ESTADO_STYLES[r.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                            {r.estado}
                          </span>
                        </td>
                        <td className="py-3 text-center text-gray-500">
                          {daysLeft(r.expires_at)}
                        </td>
                        <td className="py-3 pr-2">
                          <div className="flex gap-1">
                            {MGM_MILESTONE_TYPES.map((ms) => (
                              <div
                                key={ms.tipo}
                                title={ms.label}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  achieved.has(ms.tipo)
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-300'
                                }`}
                              >
                                {achieved.has(ms.tipo) ? '✓' : '○'}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── Catálogo de premios ── */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Catálogo de premios
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PRIZES.map((prize) => {
              const canRedeem = balance >= prize.coins
              const missing = prize.coins - balance
              return (
                <div key={prize.name}
                  className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-200 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{prize.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{prize.coins.toLocaleString('es-PE')} coins</p>
                  </div>
                  <button
                    disabled={!canRedeem}
                    onClick={() => alert('Contactá a tu asesor para gestionar el canje.')}
                    className={`w-full text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                      canRedeem
                        ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canRedeem ? 'Canjear' : `Te faltan ${missing.toLocaleString('es-PE')} coins`}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

      </main>
    </div>
  )
}
