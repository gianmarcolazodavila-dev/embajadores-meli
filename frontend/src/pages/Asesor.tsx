import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Mercado = 'wilson' | 'polvos_azules' | 'polvos_rosados'
type EstadoReferral = 'pendiente' | 'validado' | 'rechazado' | 'activo'

interface AmbassadorRow {
  id: number
  email: string
  nombre: string
  mercado: Mercado
  coins_balance: number
  coupon_code: string | null
  estado: string
  referidos_activos?: number
}

interface Milestone {
  tipo: string
  coins: number
}

interface MGMReferral {
  id: number
  ambassador_id: number
  ambassador_nombre: string
  nombre_negocio: string
  ruc: string
  referred_email: string | null
  estado: EstadoReferral
  motivo_rechazo: string | null
  expires_at: string | null
  created_at: string
  milestones: Milestone[]
}

interface AmbForm {
  email: string
  nombre: string
  mercado: Mercado
  median_asp: string
}

interface RefForm {
  ambassador_id: string
  nombre_negocio: string
  ruc: string
  referred_email: string
}

// ─── Datos estáticos ──────────────────────────────────────────────────────────

const MERCADO_STYLES: Record<Mercado, string> = {
  wilson:         'bg-blue-100 text-blue-800',
  polvos_azules:  'bg-sky-100 text-sky-700',
  polvos_rosados: 'bg-pink-100 text-pink-800',
}

const MERCADO_LABELS: Record<Mercado, string> = {
  wilson:         'Wilson',
  polvos_azules:  'Polvos Azules',
  polvos_rosados: 'Polvos Rosados',
}

const ESTADO_STYLES: Record<EstadoReferral, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  validado:  'bg-blue-100 text-blue-800',
  activo:    'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-700',
}

const MGM_MILESTONES = [
  { tipo: 'catalogo_10',       label: 'Catálogo 10',        coins: 130 },
  { tipo: 'catalogo_30',       label: 'Catálogo 30',        coins: 260 },
  { tipo: 'catalogo_100',      label: 'Catálogo 100',       coins: 390 },
  { tipo: 'primera_venta',     label: 'Primera venta',      coins: 195 },
  { tipo: 'seller_desarrollo', label: 'Seller desarrollo',  coins: 390 },
  { tipo: 'seller_activado',   label: 'Seller activado',    coins: 585 },
]

const INIT_AMB: AmbForm = { email: '', nombre: '', mercado: 'wilson', median_asp: '' }
const INIT_REF: RefForm = { ambassador_id: '', nombre_negocio: '', ruc: '', referred_email: '' }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function decodeJwt(token: string): { email: string } {
  return JSON.parse(atob(token.split('.')[1])) as { email: string }
}

function daysLeft(expiresAt: string | null): string {
  if (!expiresAt) return '—'
  const diff = new Date(expiresAt).getTime() - Date.now()
  return `${Math.max(0, Math.ceil(diff / 86_400_000))}d`
}

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${localStorage.getItem('auth_token') ?? ''}` }
}

// ─── Sub-componente: panel lateral de referido ────────────────────────────────

function ReferralPanel({
  referral,
  onClose,
  onUpdated,
}: {
  referral: MGMReferral
  onClose: () => void
  onUpdated: (updated: MGMReferral) => void
}) {
  const [showReject, setShowReject] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [saving, setSaving] = useState(false)

  const achieved = new Set(referral.milestones.map((m) => m.tipo))
  const totalCoins = referral.milestones.reduce((s, m) => s + m.coins, 0)

  const updateEstado = async (estado: string, motivoRechazo?: string) => {
    setSaving(true)
    try {
      await axios.patch(
        `${API_URL}/referrals/mgm/${referral.id}/estado`,
        { estado, ...(motivoRechazo ? { motivo_rechazo: motivoRechazo } : {}) },
        { headers: authHeaders() }
      )
      const { data } = await axios.get<MGMReferral[]>(`${API_URL}/referrals/mgm`, {
        headers: authHeaders(),
      })
      const updated = data.find((r) => r.id === referral.id)
      if (updated) onUpdated(updated)
      setShowReject(false)
      setMotivo('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-72 flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-6">
        {/* Cabecera */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-bold text-gray-900 leading-tight pr-2">
            {referral.nombre_negocio}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
          >
            ×
          </button>
        </div>

        {/* Info */}
        <div className="text-sm space-y-1 mb-4">
          <p className="text-gray-500">
            <span className="font-medium text-gray-700">RUC:</span>{' '}
            <span className="font-mono">{referral.ruc}</span>
          </p>
          {referral.referred_email && (
            <p className="text-gray-500">
              <span className="font-medium text-gray-700">Email:</span>{' '}
              {referral.referred_email}
            </p>
          )}
          <p className="text-gray-500">
            <span className="font-medium text-gray-700">Embajador:</span>{' '}
            {referral.ambassador_nombre}
          </p>
          <p className="flex items-center gap-2 text-gray-500">
            <span className="font-medium text-gray-700">Estado:</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${ESTADO_STYLES[referral.estado]}`}>
              {referral.estado}
            </span>
          </p>
        </div>

        {/* Motivo de rechazo */}
        {referral.estado === 'rechazado' && referral.motivo_rechazo && (
          <div className="bg-red-50 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs font-medium text-red-600">Motivo de rechazo</p>
            <p className="text-xs text-red-500 mt-0.5">{referral.motivo_rechazo}</p>
          </div>
        )}

        {/* Hitos */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Hitos
          </p>
          <div className="space-y-1.5">
            {MGM_MILESTONES.map((ms) => (
              <div key={ms.tipo} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    achieved.has(ms.tipo)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-300'
                  }`}>
                    {achieved.has(ms.tipo) ? '✓' : '○'}
                  </span>
                  <span className={achieved.has(ms.tipo) ? 'text-gray-700' : 'text-gray-400'}>
                    {ms.label}
                  </span>
                </div>
                <span className={`text-xs ${achieved.has(ms.tipo) ? 'text-green-600 font-semibold' : 'text-gray-300'}`}>
                  {ms.coins}c
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-2 mt-3 flex justify-between text-sm font-semibold">
            <span className="text-gray-500">Coins acumulados</span>
            <span className="text-[#3483FA]">{totalCoins}</span>
          </div>
        </div>

        {/* Acciones — solo si está pendiente */}
        {referral.estado === 'pendiente' && (
          <>
            {!showReject ? (
              <div className="flex gap-2">
                <button
                  disabled={saving}
                  onClick={() => updateEstado('validado')}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Validar
                </button>
                <button
                  disabled={saving}
                  onClick={() => setShowReject(true)}
                  className="flex-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Rechazar
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Motivo del rechazo…"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    disabled={!motivo.trim() || saving}
                    onClick={() => updateEstado('rechazado', motivo)}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => { setShowReject(false); setMotivo('') }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Asesor() {
  const navigate = useNavigate()

  const [userEmail, setUserEmail]       = useState('')
  const [ambassadors, setAmbassadors]   = useState<AmbassadorRow[]>([])
  const [referrals, setReferrals]       = useState<MGMReferral[]>([])
  const [activeTab, setActiveTab]       = useState<'embajadores' | 'referidos'>('embajadores')
  const [selectedRef, setSelectedRef]   = useState<MGMReferral | null>(null)
  const [showAmbModal, setShowAmbModal] = useState(false)
  const [showRefModal, setShowRefModal] = useState(false)
  const [ambForm, setAmbForm]           = useState<AmbForm>(INIT_AMB)
  const [refForm, setRefForm]           = useState<RefForm>(INIT_REF)
  const [ambSaving, setAmbSaving]       = useState(false)
  const [refSaving, setRefSaving]       = useState(false)
  const [refError, setRefError]         = useState('')
  const [loading, setLoading]           = useState(true)
  const [toast, setToast]               = useState('')

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_role')
    navigate('/login')
  }, [navigate])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) { navigate('/login'); return }

    try {
      setUserEmail(decodeJwt(token).email)
    } catch {
      navigate('/login')
      return
    }

    Promise.all([
      axios.get<AmbassadorRow[]>(`${API_URL}/ambassadors`, { headers: authHeaders() }),
      axios.get<MGMReferral[]>(`${API_URL}/referrals/mgm`, { headers: authHeaders() }),
    ])
      .then(([a, r]) => { setAmbassadors(a.data); setReferrals(r.data) })
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [navigate, logout])

  const handleAddAmbassador = async (e: React.FormEvent) => {
    e.preventDefault()
    setAmbSaving(true)
    try {
      await axios.post(
        `${API_URL}/ambassadors`,
        { email: ambForm.email, nombre: ambForm.nombre, mercado: ambForm.mercado,
          median_asp: ambForm.median_asp ? Number(ambForm.median_asp) : null },
        { headers: authHeaders() }
      )
      const { data } = await axios.get<AmbassadorRow[]>(`${API_URL}/ambassadors`, { headers: authHeaders() })
      setAmbassadors(data)
      setShowAmbModal(false)
      setAmbForm(INIT_AMB)
      showToast('Embajador registrado correctamente')
    } finally {
      setAmbSaving(false)
    }
  }

  const handleAddReferral = async (e: React.FormEvent) => {
    e.preventDefault()
    setRefError('')
    if (!/^\d{11}$/.test(refForm.ruc)) {
      setRefError('El RUC debe tener exactamente 11 dígitos')
      return
    }
    setRefSaving(true)
    try {
      await axios.post(
        `${API_URL}/referrals/mgm`,
        { ambassador_id: Number(refForm.ambassador_id), nombre_negocio: refForm.nombre_negocio,
          ruc: refForm.ruc, referred_email: refForm.referred_email || null },
        { headers: authHeaders() }
      )
      const { data } = await axios.get<MGMReferral[]>(`${API_URL}/referrals/mgm`, { headers: authHeaders() })
      setReferrals(data)
      setShowRefModal(false)
      setRefForm(INIT_REF)
      showToast('Referido creado correctamente')
    } catch {
      setRefError('Error al crear el referido. Verificá los datos.')
    } finally {
      setRefSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-[#3483FA] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-400">Cargando…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <header className="bg-[#FFE600] px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Panel Asesor</h1>
            <span className="text-sm text-gray-600">{userEmail}</span>
          </div>
          <button
            onClick={logout}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Toast */}
        {toast && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
            {toast}
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit">
          {(['embajadores', 'referidos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedRef(null) }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-[#3483FA] text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'embajadores' ? 'Embajadores' : 'Referidos MGM'}
            </button>
          ))}
        </div>

        {/* ── Tab 1: Embajadores ── */}
        {activeTab === 'embajadores' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Embajadores ({ambassadors.length})
              </h2>
              <button
                onClick={() => setShowAmbModal(true)}
                className="bg-[#3483FA] hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                + Agregar embajador
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="py-3 pl-6 font-medium">Nombre</th>
                      <th className="py-3 font-medium">Mercado</th>
                      <th className="py-3 font-medium">Coins</th>
                      <th className="py-3 font-medium">Cupón</th>
                      <th className="py-3 pr-6 font-medium text-center">Ref. activos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambassadors.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-gray-400">
                          No hay embajadores registrados aún.
                        </td>
                      </tr>
                    ) : ambassadors.map((amb) => (
                      <tr key={amb.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pl-6">
                          <p className="font-semibold text-gray-900">{amb.nombre}</p>
                          <p className="text-xs text-gray-400">{amb.email}</p>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${MERCADO_STYLES[amb.mercado]}`}>
                            {MERCADO_LABELS[amb.mercado]}
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-[#3483FA]">
                          {amb.coins_balance.toLocaleString('es-PE')}
                        </td>
                        <td className="py-3 font-mono text-gray-700">
                          {amb.coupon_code ?? '—'}
                        </td>
                        <td className="py-3 pr-6 text-center text-gray-500">
                          {amb.referidos_activos ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Tab 2: Referidos MGM ── */}
        {activeTab === 'referidos' && (
          <div className="flex gap-4 items-start">

            {/* Tabla */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Referidos MGM ({referrals.length})
                </h2>
                <button
                  onClick={() => setShowRefModal(true)}
                  className="bg-[#3483FA] hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  + Nuevo referido
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-100">
                        <th className="py-3 pl-6 font-medium">Negocio</th>
                        <th className="py-3 font-medium">RUC</th>
                        <th className="py-3 font-medium">Embajador</th>
                        <th className="py-3 font-medium">Estado</th>
                        <th className="py-3 pr-6 font-medium text-center">Días rest.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-gray-400">
                            No hay referidos registrados aún.
                          </td>
                        </tr>
                      ) : referrals.map((r) => (
                        <tr
                          key={r.id}
                          onClick={() => setSelectedRef(selectedRef?.id === r.id ? null : r)}
                          className={`border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedRef?.id === r.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <td className="py-3 pl-6 font-medium text-gray-900">{r.nombre_negocio}</td>
                          <td className="py-3 font-mono text-gray-500">{r.ruc}</td>
                          <td className="py-3 text-gray-600">{r.ambassador_nombre}</td>
                          <td className="py-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ESTADO_STYLES[r.estado]}`}>
                              {r.estado}
                            </span>
                          </td>
                          <td className="py-3 pr-6 text-center text-gray-500">
                            {daysLeft(r.expires_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Panel lateral */}
            {selectedRef && (
              <ReferralPanel
                referral={selectedRef}
                onClose={() => setSelectedRef(null)}
                onUpdated={(updated) => {
                  setReferrals((prev) => prev.map((r) => r.id === updated.id ? updated : r))
                  setSelectedRef(updated)
                  showToast(`Referido ${updated.estado} correctamente`)
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Modal: Agregar embajador ── */}
      {showAmbModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Agregar embajador</h3>
              <button
                onClick={() => { setShowAmbModal(false); setAmbForm(INIT_AMB) }}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >×</button>
            </div>
            <form onSubmit={handleAddAmbassador} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" required value={ambForm.email}
                  onChange={(e) => setAmbForm({ ...ambForm, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3483FA]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo</label>
                <input type="text" required value={ambForm.nombre}
                  onChange={(e) => setAmbForm({ ...ambForm, nombre: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3483FA]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mercado</label>
                <select value={ambForm.mercado}
                  onChange={(e) => setAmbForm({ ...ambForm, mercado: e.target.value as Mercado })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3483FA] bg-white">
                  <option value="wilson">Wilson</option>
                  <option value="polvos_azules">Polvos Azules</option>
                  <option value="polvos_rosados">Polvos Rosados</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  ASP mediana (S/) <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input type="number" min="0" step="0.01" value={ambForm.median_asp}
                  onChange={(e) => setAmbForm({ ...ambForm, median_asp: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3483FA]" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button"
                  onClick={() => { setShowAmbModal(false); setAmbForm(INIT_AMB) }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={ambSaving}
                  className="flex-1 bg-[#3483FA] hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  {ambSaving ? 'Guardando…' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Nuevo referido ── */}
      {showRefModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Nuevo referido MGM</h3>
              <button
                onClick={() => { setShowRefModal(false); setRefForm(INIT_REF); setRefError('') }}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >×</button>
            </div>
            <form onSubmit={handleAddReferral} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Embajador</label>
                <select required value={refForm.ambassador_id}
                  onChange={(e) => setRefForm({ ...refForm, ambassador_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3483FA] bg-white">
                  <option value="">Seleccioná un embajador</option>
                  {ambassadors.filter((a) => a.estado === 'activo').map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del negocio</label>
                <input type="text" required value={refForm.nombre_negocio}
                  onChange={(e) => setRefForm({ ...refForm, nombre_negocio: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3483FA]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">RUC (11 dígitos)</label>
                <input type="text" required maxLength={11} value={refForm.ruc}
                  onChange={(e) => setRefForm({ ...refForm, ruc: e.target.value.replace(/\D/g, '') })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#3483FA]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email del referido <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input type="email" value={refForm.referred_email}
                  onChange={(e) => setRefForm({ ...refForm, referred_email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3483FA]" />
              </div>
              {refError && <p className="text-sm text-red-500">{refError}</p>}
              <div className="flex gap-3 pt-1">
                <button type="button"
                  onClick={() => { setShowRefModal(false); setRefForm(INIT_REF); setRefError('') }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={refSaving}
                  className="flex-1 bg-[#3483FA] hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  {refSaving ? 'Creando…' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
