const BASE = '/api'

export interface Embajador {
  ambassador_id: string
  nombre: string
  mercado: string
  coins: number
  coupon_mgb: string
  status: string
}

export interface ReferidoMGM {
  referral_id: string
  business_name: string
  ambassador_id: string
  status: string
  created_at: string
}

export interface WalletTx {
  tx_id: string
  ambassador_id: string
  descripcion: string
  coins: number
  created_at: string
}

const COIN_LABELS: Record<string, string> = {
  catalogo_10:       '📦 10 productos publicados',
  catalogo_30:       '📦 30 productos publicados',
  catalogo_100:      '📦 100 productos publicados',
  primera_venta:     '🎉 Primera venta realizada',
  seller_desarrollo: '📈 Seller en desarrollo (10 ventas)',
  seller_activado:   '⭐ Seller activado (25 ventas)',
}

export function formatCoinLabel(descripcion: string): string {
  for (const [key, label] of Object.entries(COIN_LABELS)) {
    if (descripcion.includes(key)) {
      const match = descripcion.match(/- (.+)$/)
      const negocio = match ? ` · ${match[1]}` : ''
      return label + negocio
    }
  }
  return descripcion
}

async function apiFetch<T>(action: string, params: Record<string, string> = {}): Promise<T> {
  const qs = new URLSearchParams({ action, ...params }).toString()
  const res = await fetch(`${BASE}?${qs}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  getEmbajadores: () => apiFetch<Embajador[]>('getEmbajadores'),
  getEmbajador: (id: string) => apiFetch<Embajador>('getEmbajador', { id }),
  getReferidosMGM: (ambassador_id: string) =>
    apiFetch<ReferidoMGM[]>('getReferidosMGM', { ambassador_id }),
  getWallet: (ambassador_id: string) =>
    apiFetch<WalletTx[]>('getWallet', { ambassador_id }),
}
