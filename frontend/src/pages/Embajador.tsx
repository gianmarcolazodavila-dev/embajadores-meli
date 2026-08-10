import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface JwtPayload {
  ambassadorId: number
  email: string
  role: string
}

interface Ambassador {
  id: number
  nombre: string
  mercado: 'wilson' | 'polvos_azules' | 'polvos_rosados'
  coins_balance: number
  coupon_code: string | null
}

interface Transaction {
  id: number
  coins: number
  tipo: 'credito' | 'debito'
  descripcion: string
  created_at: string
}

interface Milestone {
  tipo: string
}

interface MGMReferral {
  id: number
  nombre_negocio: string
  estado: 'pendiente' | 'validado' | 'rechazado' | 'activo'
  motivo_rechazo: string | null
  expires_at: string | null
  milestones: Milestone[]
}

interface MGBStats {
  count: number
  coins: number
}

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
  { tipo: 'catalogo_10',      label: '10 pub.' },
  { tipo: 'catalogo_30',      label: '30 pub.' },
  { tipo: 'catalogo_100',     label: '100 pub.' },
  { tipo: 'primera_venta',    label: '1ª venta' },
  { tipo: 'seller_desarrollo', label: 'Desarro.' },
  { tipo: 'seller_activado',  label: 'Activado' },
]

const PRIZES = [
  { name: 'Gift card S/30',   coins: 300 },
  { name: 'Gift card S/50',   coins: 500 },
  { name: 'Audífonos',        coins: 1500 },
  { name: 'Sesión de fotos',  coins: 1500 },
  { name: 'Smartwatch',       coins: 4000 },
  { name: 'Smartphone',       coins: 10000 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function decodeJwt(token: string): JwtPayload {
  const raw = token.split('.')[1]
  return JSON.parse(atob(raw)) as JwtPayload
}

function daysLeft(expiresAt: string | null): string {
  if (!expiresAt) return '—'
  const diff = new Date(expiresAt).getTime() - Date.now()
  const days = Math.max(0, Math.ceil(diff / 86_400_000))
  return `${days}d`
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Embajador() {
  const navigate = useNavigate()
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [referrals, setReferrals] = useState<MGMReferral[]>([])
  const [mgbStats, setMgbStats] = useState<MGBStats>({ count: 0, coins: 0 })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    navigate('/login')
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) { navigate('/login'); return }

    let payload: JwtPayload
    try {
      payload = decodeJwt(token)
    } catch {
      navigate('/login')
      return
    }

    const headers = { Authorization: `Bearer ${token}` }
    const { ambassadorId } = payload

    Promise.all([
      axios.get<Ambassador>(`${API_URL}/ambassadors/${ambassadorId}`, { headers }),
      axios.get<Transaction[]>(`${API_URL}/wallet/${ambassadorId}`, { headers }),
      axios.get<MGMReferral[]>(`${API_URL}/referrals/mgm?ambassador_id=${ambassadorId}`, { headers }),
      axios.get<MGBStats>(`${API_URL}/referrals/mgb?ambassador_id=${ambassadorId}`, { headers }),
    ])
      .then(([ambRes, walletRes, mgmRes, mgbRes]) => {
        setAmbassador(ambRes.data)
        setTransactions(walletRes.data.slice(0, 10))
        setReferrals(mgmRes.data)
        setMgbStats(mgbRes.data)
      })
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [navigate, logout])

  const copyLink = () => {
    if (!ambassador?.coupon_code) return
    navigator.clipboard
      .writeText(`${API_URL}/registro?ref=${ambassador.coupon_code}`)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  // ── Loading ──

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-400 text-lg animate-pulse">Cargando…</span>
      </div>
    )
  }

  if (!ambassador) return null

  const balance = ambassador.coins_balance

  // ── Render ──

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Header ── */}
      <header className="bg-[#FFE600] px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              Hola, {ambassador.nombre}
            </h1>
            <span className="bg-gray-900 text-[#FFE600] text-xs font-semibold px-3 py-1 rounded-full">
              {MERCADO_LABELS[ambassador.mercado]}
            </span>
          </div>
          <button
            onClick={logout}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* ── Sección 1: Wallet ── */}
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
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-2 pl-2 font-medium w-32">Fecha</th>
                    <th className="pb-2 font-medium">Descripción</th>
                    <th className="pb-2 pr-2 font-medium text-right w-24">Coins</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-50 last:border-0">
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

        {/* ── Sección 2: Cupón MGB ── */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Mi cupón MGB
          </h2>

          <div className="flex flex-wrap items-center gap-4 mb-5">
            <span className="text-4xl font-black tracking-widest text-gray-900 font-mono">
              {ambassador.coupon_code ?? '—'}
            </span>
            <button
              onClick={copyLink}
              disabled={!ambassador.coupon_code}
              className="bg-[#3483FA] hover:bg-blue-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
            >
              {copied ? '¡Copiado!' : 'Copiar link'}
            </button>
          </div>

          <div className="flex flex-wrap gap-8 text-sm text-gray-500">
            <div>
              <span className="text-3xl font-black text-gray-900">
                {mgbStats.count}
              </span>
              <span className="ml-1.5">buyers referidos</span>
            </div>
            <div>
              <span className="text-3xl font-black text-[#3483FA]">
                {mgbStats.coins.toLocaleString('es-PE')}
              </span>
              <span className="ml-1.5">coins ganados por MGB</span>
            </div>
          </div>
        </section>

        {/* ── Sección 3: Referidos MGM ── */}
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
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-2 pl-2 font-medium">Negocio</th>
                    <th className="pb-2 font-medium">Estado</th>
                    <th className="pb-2 font-medium w-28 text-center">Días rest.</th>
                    <th className="pb-2 pr-2 font-medium">Hitos</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => {
                    const achieved = new Set(r.milestones.map((m) => m.tipo))
                    return (
                      <tr key={r.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pl-2 pr-4">
                          <p className="font-semibold text-gray-900">{r.nombre_negocio}</p>
                          {r.estado === 'rechazado' && r.motivo_rechazo && (
                            <p className="text-xs text-red-500 mt-0.5">{r.motivo_rechazo}</p>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ESTADO_STYLES[r.estado] ?? ''}`}>
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

        {/* ── Sección 4: Catálogo de premios ── */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Catálogo de premios
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PRIZES.map((prize) => {
              const canRedeem = balance >= prize.coins
              const missing = prize.coins - balance
              return (
                <div
                  key={prize.name}
                  className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-200 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">
                      {prize.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {prize.coins.toLocaleString('es-PE')} coins
                    </p>
                  </div>
                  <button
                    disabled={!canRedeem}
                    onClick={() =>
                      alert('Contactá a tu asesor para gestionar el canje.')
                    }
                    className={`w-full text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                      canRedeem
                        ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canRedeem
                      ? 'Canjear'
                      : `Te faltan ${missing.toLocaleString('es-PE')} coins`}
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
