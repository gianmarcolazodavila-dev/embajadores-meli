import { useState } from 'react'
import Layout, { type NavItem } from '../components/Layout'

// ─── Tipos ───────────────────────────────────────────────────────────────────

type EmbSection = 'resumen' | 'agrega' | 'mgm' | 'mgb' | 'premios'

// ─── Datos hardcodeados ───────────────────────────────────────────────────────

const USUARIO = { nombre: 'Jose Garcia', mercado: 'Wilson', coins: 520 }

const WALLET_MGM = [
  { descripcion: '📦 30 productos publicados · Tienda Tech Lima', coins: 260, fecha: '2026-08-12' },
  { descripcion: '🎉 Primera venta realizada · Tienda Tech Lima', coins: 195, fecha: '2026-08-11' },
  { descripcion: '📦 10 productos publicados · Tienda Tech Lima', coins: 130, fecha: '2026-08-10' },
]

const REFERIDOS_MGM = [
  { id: 'REF001', negocio: 'Tienda Tech Lima', estado: 'activo',   coins: 585, hitos: ['catalogo_10','catalogo_30','primera_venta','seller_desarrollo'] },
  { id: 'REF002', negocio: 'Moda y Mas',       estado: 'validado', coins: 130, hitos: ['catalogo_10'] },
]

const BUYERS_MGB = [
  { nombre: 'Ana Torres',   compras: 3, nmv: 450, coins: 195, estado: 'Recurrente', estadoColor: '#00A650' },
  { nombre: 'Luis Mendoza', compras: 1, nmv: 89,  coins: 65,  estado: 'Nuevo',      estadoColor: '#3483FA' },
]

const HITOS_DEF = [
  { id: 'catalogo_10',       label: '10 productos', coins: 130 },
  { id: 'catalogo_30',       label: '30 productos', coins: 260 },
  { id: 'catalogo_100',      label: '100 productos', coins: 390 },
  { id: 'primera_venta',     label: 'Primera venta', coins: 195 },
  { id: 'seller_desarrollo', label: 'En desarrollo', coins: 390 },
  { id: 'seller_activado',   label: 'Activado', coins: 585 },
]

const PREMIOS = [
  { id: 'polo',    emoji: '🎽', nombre: 'Polo Mercado Libre',    coins: 200, popular: false },
  { id: 'gorra',   emoji: '🧢', nombre: 'Gorra MELI',           coins: 150, popular: false },
  { id: 'mochila', emoji: '🎒', nombre: 'Mochila Oficial',       coins: 400, popular: false },
  { id: 'credito', emoji: '📱', nombre: 'Crédito S/50 en MELI', coins: 300, popular: true },
  { id: 'bolsas',  emoji: '🛍️', nombre: 'Bolsas de tela (x5)',  coins: 100, popular: false },
  { id: 'kit',     emoji: '🏆', nombre: 'Kit Embajador Premium', coins: 600, popular: false },
]

const ESTADO_PILL: Record<string, { bg: string; color: string }> = {
  activo:   { bg: '#E8F8EF', color: '#00A650' },
  validado: { bg: '#EBF1FF', color: '#3483FA' },
  pendiente:{ bg: '#FFF8E7', color: '#FF7733' },
  rechazado:{ bg: '#FFECEC', color: '#E01D1D' },
}

const NAV_ITEMS: NavItem[] = [
  { id: 'resumen', emoji: '🏠', label: 'Resumen' },
  { id: 'agrega',  emoji: '➕', label: 'Agrega un Negocio' },
  { id: 'mgm',     emoji: '📦', label: 'Mis Puntos MGM' },
  { id: 'mgb',     emoji: '🛒', label: 'Mis Puntos MGB' },
  { id: 'premios', emoji: '🎁', label: 'Canjear Premios' },
]

const SECTION_TITLES: Record<EmbSection, string> = {
  resumen: 'Resumen',
  agrega:  'Agrega un Negocio',
  mgm:     'Mis Puntos MGM',
  mgb:     'Mis Puntos MGB',
  premios: 'Canjear Premios',
}

// ─── Helpers de estilo ────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: '#fff', borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '20px',
}

function StatePill({ estado }: { estado: string }) {
  const s = ESTADO_PILL[estado] ?? { bg: '#F0F0F0', color: '#666' }
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: '11px', fontWeight: 600,
      padding: '3px 10px', borderRadius: '20px', textTransform: 'capitalize',
    }}>
      {estado}
    </span>
  )
}

// ─── Sección: Resumen ─────────────────────────────────────────────────────────

function SeccionResumen({ onNavigate }: { onNavigate: (s: EmbSection) => void }) {
  const mgbCoins = BUYERS_MGB.reduce((s, b) => s + b.coins, 0)
  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Mis Coins', value: USUARIO.coins.toLocaleString('es-PE'), icon: '🪙' },
          { label: 'Referidos MGM activos', value: REFERIDOS_MGM.filter(r => r.estado === 'activo').length, icon: '📦' },
          { label: 'New Buyers MGB', value: BUYERS_MGB.length, icon: '🛒' },
          { label: 'Próximo corte', value: '15 ago', icon: '📅' },
        ].map((kpi, i) => (
          <div key={i} style={card}>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px' }}>{kpi.label}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#333' }}>{kpi.value}</span>
              <span style={{ fontSize: '18px' }}>{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two cards side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Últimos movimientos */}
        <div style={card}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#333', margin: '0 0 14px' }}>
            Últimos movimientos
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {WALLET_MGM.map((tx, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < WALLET_MGM.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#333', margin: '0 0 2px' }}>{tx.descripcion}</p>
                  <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{tx.fecha}</p>
                </div>
                <span style={{ fontWeight: 700, color: '#00A650', fontSize: '13px', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                  +{tx.coins} 🪙
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate('mgm')} style={{ marginTop: '14px', fontSize: '12px', color: '#3483FA', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Ver todos →
          </button>
        </div>

        {/* Mis referidos activos */}
        <div style={card}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#333', margin: '0 0 14px' }}>
            Mis referidos activos
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {REFERIDOS_MGM.map((r) => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#333', margin: '0 0 3px' }}>{r.negocio}</p>
                  <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{r.hitos.length}/{HITOS_DEF.length} hitos</p>
                </div>
                <StatePill estado={r.estado} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: '14px', background: '#F9F9F9', borderRadius: '6px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>Total coins MGM + MGB</span>
            <span style={{ fontWeight: 700, color: '#333' }}>
              {(USUARIO.coins + mgbCoins).toLocaleString('es-PE')} 🪙
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sección: Agrega un Negocio ───────────────────────────────────────────────

type AgregaForm = { negocio: string; ruc: string; mercado: string; telefono: string; contacto: string; notas: string }
const FORM_INIT: AgregaForm = { negocio: '', ruc: '', mercado: '', telefono: '', contacto: '', notas: '' }

function SeccionAgrega({ onNavigate }: { onNavigate: (s: EmbSection) => void }) {
  const [form, setForm] = useState<AgregaForm>(FORM_INIT)
  const [errors, setErrors] = useState<Partial<AgregaForm>>({})
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const F = (k: keyof AgregaForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const validate = () => {
    const e: Partial<AgregaForm> = {}
    if (!form.negocio.trim()) e.negocio = 'Requerido'
    if (!/^\d{8}$|^\d{11}$/.test(form.ruc.trim())) e.ruc = 'Debe ser 8 u 11 dígitos'
    if (!form.mercado) e.mercado = 'Requerido'
    if (!form.telefono.trim()) e.telefono = 'Requerido'
    if (!form.contacto.trim()) e.contacto = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (validate()) setShowModal(true) }
  const handleConfirm = () => { setShowModal(false); setShowSuccess(true) }

  const inputStyle = (hasErr: boolean): React.CSSProperties => ({
    width: '100%', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', color: '#333',
    border: `1.5px solid ${hasErr ? '#E01D1D' : '#DDD'}`, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', background: '#fff',
  })

  if (showSuccess) return (
    <div style={{ ...card, maxWidth: '480px', margin: '40px auto', textAlign: 'center', padding: '48px 32px' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E8F8EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 20px' }}>✅</div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#333', margin: '0 0 10px' }}>¡Referido enviado!</h2>
      <p style={{ fontSize: '14px', color: '#666', margin: '0 0 6px' }}>
        Tu asesor recibirá la info y se contactará con <strong>{form.negocio}</strong>.
      </p>
      <p style={{ fontSize: '13px', color: '#999', margin: '0 0 28px' }}>
        Ganarás tus primeros coins cuando <strong>{form.negocio}</strong> publique 10 productos.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button onClick={() => { setForm(FORM_INIT); setShowSuccess(false) }} style={{ padding: '10px 20px', borderRadius: '6px', border: '1.5px solid #DDD', background: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#333' }}>
          Agregar otro
        </button>
        <button onClick={() => onNavigate('mgm')} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#FFE600', fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: '#1D1D1B' }}>
          Ver mis referidos
        </button>
      </div>
    </div>
  )

  const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' }
  const errorStyle: React.CSSProperties = { fontSize: '11px', color: '#E01D1D', marginTop: '3px' }

  return (
    <div style={{ maxWidth: '720px' }}>
      <p style={{ fontSize: '14px', color: '#666', margin: '0 0 24px' }}>
        Completá los datos del negocio que querés incorporar a MercadoLibre.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ ...card }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            <div>
              <label style={labelStyle}>Nombre del negocio *</label>
              <input style={inputStyle(!!errors.negocio)} value={form.negocio} onChange={F('negocio')} placeholder="Ej: Tienda Tech Lima" />
              {errors.negocio && <p style={errorStyle}>{errors.negocio}</p>}
            </div>

            <div>
              <label style={labelStyle}>RUC / DNI *</label>
              <input style={inputStyle(!!errors.ruc)} value={form.ruc} onChange={F('ruc')} placeholder="8 u 11 dígitos" maxLength={11} />
              {errors.ruc && <p style={errorStyle}>{errors.ruc}</p>}
            </div>

            <div>
              <label style={labelStyle}>Mercado donde vende *</label>
              <select style={inputStyle(!!errors.mercado)} value={form.mercado} onChange={F('mercado')}>
                <option value="">Seleccioná...</option>
                {['Wilson','Polvos Azules','Gamarra','Otro'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.mercado && <p style={errorStyle}>{errors.mercado}</p>}
            </div>

            <div>
              <label style={labelStyle}>Teléfono de contacto *</label>
              <input style={inputStyle(!!errors.telefono)} value={form.telefono} onChange={F('telefono')} placeholder="Ej: 999 888 777" />
              {errors.telefono && <p style={errorStyle}>{errors.telefono}</p>}
            </div>

            <div>
              <label style={labelStyle}>Nombre del contacto *</label>
              <input style={inputStyle(!!errors.contacto)} value={form.contacto} onChange={F('contacto')} placeholder="Ej: Carlos López" />
              {errors.contacto && <p style={errorStyle}>{errors.contacto}</p>}
            </div>

            <div>
              <label style={labelStyle}>Notas adicionales <span style={{ fontWeight: 400, color: '#999' }}>(opcional)</span></label>
              <textarea style={{ ...inputStyle(false), resize: 'vertical', minHeight: '38px', fontFamily: 'inherit' }}
                value={form.notas} onChange={F('notas')} placeholder="Información relevante..." />
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ padding: '11px 28px', background: '#FFE600', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', color: '#1D1D1B' }}>
              Enviar referido →
            </button>
          </div>
        </div>
      </form>

      {/* Modal de confirmación */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px 32px', width: '380px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px' }}>¿Confirmar referido?</h3>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 22px' }}>
              Vas a referir a <strong>{form.negocio}</strong> al programa de embajadores.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '9px 18px', borderRadius: '6px', border: '1.5px solid #DDD', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                Cancelar
              </button>
              <button onClick={handleConfirm} style={{ padding: '9px 18px', borderRadius: '6px', border: 'none', background: '#FFE600', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#1D1D1B' }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sección: Mis Puntos MGM ──────────────────────────────────────────────────

function ProgressTracker({ hitos }: { hitos: string[] }) {
  const achieved = new Set(hitos)
  const nextIdx = HITOS_DEF.findIndex(h => !achieved.has(h.id))
  return (
    <div style={{ position: 'relative', padding: '8px 0 4px' }}>
      <div style={{ position: 'absolute', top: '22px', left: '20px', right: '20px', height: '2px', background: '#E8E8E8', zIndex: 0 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        {HITOS_DEF.map((h, idx) => {
          const done = achieved.has(h.id)
          const isNext = idx === nextIdx
          return (
            <div key={h.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '60px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700,
                background: done ? '#FFE600' : '#fff',
                border: done ? '2px solid #FFE600' : isNext ? '2px dashed #FFE600' : '2px solid #E0E0E0',
                color: done ? '#1D1D1B' : isNext ? '#FFE600' : '#CCC',
                animation: isNext ? 'pulse 2s infinite' : 'none',
              }}>
                {done ? '✓' : idx + 1}
              </div>
              <p style={{ fontSize: '10px', color: done ? '#333' : '#AAA', textAlign: 'center', margin: 0, lineHeight: 1.3 }}>{h.label}</p>
              <p style={{ fontSize: '10px', fontWeight: 600, color: done ? '#00A650' : '#CCC', margin: 0 }}>+{h.coins}c</p>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}

function SeccionMGM() {
  const [expanded, setExpanded] = useState<string | null>('REF001')
  const total = REFERIDOS_MGM.reduce((s, r) => s + r.coins, 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          Total ganado por MGM: <strong style={{ color: '#333' }}>{total.toLocaleString('es-PE')} coins 🪙</strong>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {REFERIDOS_MGM.map((r) => (
          <div key={r.id} style={card}>
            <div
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  🏪
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: '#333', margin: '0 0 3px', fontSize: '14px' }}>{r.negocio}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StatePill estado={r.estado} />
                    <span style={{ fontSize: '11px', color: '#999' }}>{r.hitos.length}/{HITOS_DEF.length} hitos completados</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontWeight: 700, color: '#333', fontSize: '16px' }}>{r.coins} 🪙</span>
                <span style={{ fontSize: '18px', color: '#999', transition: 'transform 0.2s', display: 'inline-block', transform: expanded === r.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
              </div>
            </div>

            {expanded === r.id && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F0F0F0' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#999', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Progreso de hitos
                </p>
                <ProgressTracker hitos={r.hitos} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Sección: Mis Puntos MGB ──────────────────────────────────────────────────

function SeccionMGB() {
  const [copied, setCopied] = useState(false)
  const totalCoins = BUYERS_MGB.reduce((s, b) => s + b.coins, 0)

  const copy = () => {
    navigator.clipboard.writeText(`https://www.mercadolibre.com.pe/?ref=${USUARIO.mercado === 'Wilson' ? 'EMBA-JG01' : 'EMBA-XX00'}`)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => {})
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      {/* Cupón card */}
      <div style={{ ...card, marginBottom: '20px', background: 'linear-gradient(135deg, #1D1D1B 0%, #333 100%)', color: '#fff' }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
          Tu cupón exclusivo
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <span style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '4px', fontFamily: 'monospace', color: '#FFE600' }}>
            EMBA-JG01
          </span>
          <button onClick={copy} style={{
            padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            background: copied ? '#00A650' : '#FFE600', color: copied ? '#fff' : '#1D1D1B',
            fontWeight: 700, fontSize: '12px', transition: 'all 0.2s',
          }}>
            {copied ? '✓ Copiado' : '📋 Copiar link'}
          </button>
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.60)', margin: 0 }}>
          Compartí este código con compradores. Cuando lo usen en su primera compra en MercadoLibre, ambos ganan.
        </p>
      </div>

      {/* Tabla compradores */}
      <div style={card}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#333', margin: '0 0 16px' }}>
          Actividad de compradores
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
              {['Comprador','Compras realizadas','NMV generado','Coins ganados','Estado'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0 0 10px', fontSize: '11px', fontWeight: 600, color: '#999', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BUYERS_MGB.map((b, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F9F9F9' }}>
                <td style={{ padding: '12px 0', fontWeight: 500 }}>{b.nombre}</td>
                <td style={{ padding: '12px 12px 12px 0', color: '#555' }}>{b.compras} compras</td>
                <td style={{ padding: '12px 12px 12px 0', color: '#555' }}>S/ {b.nmv.toLocaleString('es-PE')}</td>
                <td style={{ padding: '12px 12px 12px 0', fontWeight: 700, color: '#00A650' }}>+{b.coins} 🪙</td>
                <td style={{ padding: '12px 0' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: b.estadoColor }}>
                    {b.estado === 'Recurrente' ? '🟢' : '🔵'} {b.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '16px', background: '#F9F9F9', borderRadius: '6px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Total ganado por MGB</span>
          <span style={{ fontWeight: 800, color: '#333', fontSize: '16px' }}>{totalCoins} coins 🪙</span>
        </div>
      </div>
    </div>
  )
}

// ─── Sección: Canjear Premios ─────────────────────────────────────────────────

type Premio = typeof PREMIOS[0]

function SeccionPremios() {
  const [selectedPrize, setSelectedPrize] = useState<Premio | null>(null)
  const [prizeStep, setPrizeStep] = useState<0|1|2|3>(0)
  const [address, setAddress] = useState('Mercado Wilson, Puesto 520')

  const closeModal = () => { setSelectedPrize(null); setPrizeStep(0) }
  const openModal = (p: Premio) => { setSelectedPrize(p); setPrizeStep(1) }

  return (
    <div style={{ maxWidth: '760px' }}>
      {/* Banner */}
      <div style={{ background: '#FFF8E7', border: '1px solid #FFE600', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '18px' }}>⚠️</span>
        <p style={{ fontSize: '13px', color: '#333', margin: 0 }}>
          <strong>Próximo corte: 15 de agosto</strong> — el premio se entrega la primera semana de septiembre.
        </p>
      </div>

      {/* Premio grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {PREMIOS.map((p) => {
          const canRedeem = USUARIO.coins >= p.coins
          return (
            <div key={p.id} style={{ ...card, position: 'relative', border: p.popular ? '2px solid #FFE600' : '1px solid transparent' }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#FFE600', borderRadius: '20px', padding: '2px 10px', fontSize: '10px', fontWeight: 700, color: '#1D1D1B', whiteSpace: 'nowrap' }}>
                  ⭐ Más popular
                </div>
              )}
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{p.emoji}</div>
              <p style={{ fontWeight: 600, color: '#333', fontSize: '14px', margin: '0 0 4px' }}>{p.nombre}</p>
              <p style={{ fontSize: '13px', color: '#999', margin: '0 0 14px' }}>{p.coins.toLocaleString('es-PE')} coins</p>
              <button
                disabled={!canRedeem}
                onClick={() => canRedeem && openModal(p)}
                style={{
                  width: '100%', padding: '9px 0', borderRadius: '6px', border: 'none',
                  fontWeight: 700, fontSize: '12px', cursor: canRedeem ? 'pointer' : 'not-allowed',
                  background: canRedeem ? '#FFE600' : '#F0F0F0', color: canRedeem ? '#1D1D1B' : '#AAA',
                  transition: 'all 0.15s',
                }}
              >
                {canRedeem ? 'Canjear →' : `Te faltan ${(p.coins - USUARIO.coins).toLocaleString('es-PE')} coins`}
              </button>
            </div>
          )
        })}
      </div>

      {/* Modal 2 pasos */}
      {selectedPrize && prizeStep > 0 && prizeStep < 3 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px 32px', width: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', color: '#999' }}>PASO {prizeStep} DE 2</span>
              <div style={{ flex: 1, height: '3px', background: '#F0F0F0', borderRadius: '2px' }}>
                <div style={{ width: prizeStep === 1 ? '50%' : '100%', height: '100%', background: '#FFE600', borderRadius: '2px', transition: 'width 0.3s' }} />
              </div>
            </div>

            {prizeStep === 1 && (
              <>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '14px 0 8px' }}>Confirmar selección</h3>
                <div style={{ background: '#F9F9F9', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '14px' }}>{selectedPrize.emoji} {selectedPrize.nombre}</p>
                  <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>Costo: {selectedPrize.coins} coins → te quedarán <strong>{USUARIO.coins - selectedPrize.coins}</strong> coins</p>
                </div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>
                  ¿Tu dirección de entrega es correcta?
                </label>
                <input
                  value={address} onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1.5px solid #DDD', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: '20px' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button onClick={closeModal} style={{ padding: '9px 18px', borderRadius: '6px', border: '1.5px solid #DDD', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Cancelar</button>
                  <button onClick={() => setPrizeStep(2)} style={{ padding: '9px 18px', borderRadius: '6px', border: 'none', background: '#FFE600', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#1D1D1B' }}>Continuar →</button>
                </div>
              </>
            )}

            {prizeStep === 2 && (
              <>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '14px 0 8px' }}>Confirmación final</h3>
                <div style={{ background: '#F9F9F9', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 600 }}>{selectedPrize.emoji} {selectedPrize.nombre}</p>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#666' }}>📍 {address}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>📅 Entrega estimada: 1-7 de septiembre de 2026</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setPrizeStep(1)} style={{ padding: '9px 18px', borderRadius: '6px', border: '1.5px solid #DDD', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>← Atrás</button>
                  <button onClick={() => setPrizeStep(3)} style={{ padding: '9px 18px', borderRadius: '6px', border: 'none', background: '#00A650', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#fff' }}>Confirmar canje</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Success */}
      {prizeStep === 3 && selectedPrize && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '36px 32px', width: '380px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#E8F8EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 16px' }}>✅</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 10px' }}>¡Canje registrado!</h3>
            <p style={{ fontSize: '13px', color: '#666', margin: '0 0 24px' }}>
              Recibirás tu <strong>{selectedPrize.nombre}</strong> la primera semana de septiembre.
            </p>
            <button onClick={closeModal} style={{ padding: '10px 24px', background: '#FFE600', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', color: '#1D1D1B' }}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Embajador() {
  const [activeSection, setActiveSection] = useState<EmbSection>('resumen')

  const navigate = (s: EmbSection) => setActiveSection(s)

  return (
    <Layout
      role="embajador"
      navItems={NAV_ITEMS}
      activeSection={activeSection}
      onNavigate={(id) => setActiveSection(id as EmbSection)}
      userName={USUARIO.nombre}
      userSub={USUARIO.mercado}
      pageTitle={SECTION_TITLES[activeSection]}
      coins={USUARIO.coins}
    >
      {activeSection === 'resumen' && <SeccionResumen onNavigate={navigate} />}
      {activeSection === 'agrega'  && <SeccionAgrega onNavigate={navigate} />}
      {activeSection === 'mgm'     && <SeccionMGM />}
      {activeSection === 'mgb'     && <SeccionMGB />}
      {activeSection === 'premios' && <SeccionPremios />}
    </Layout>
  )
}
