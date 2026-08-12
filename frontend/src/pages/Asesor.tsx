import { useState } from 'react'
import Layout, { type NavItem } from '../components/Layout'
import StatusLegend from '../components/StatusLegend'

// ─── Tipos ───────────────────────────────────────────────────────────────────

type AsesorSection = 'resumen' | 'referidos-nuevos' | 'embajadores'

// ─── Datos hardcodeados ───────────────────────────────────────────────────────

const EMBAJADORES_DATA = [
  { id: 'EMB001', nombre: 'Jose Garcia',  iniciales: 'JG', mercado: 'Wilson',        coins: 520, referidosMGM: 2, buyersMGB: 2, estado: 'Activo' },
  { id: 'EMB002', nombre: 'Maria Quispe', iniciales: 'MQ', mercado: 'Polvos Azules', coins: 195, referidosMGM: 1, buyersMGB: 1, estado: 'Activo' },
]

const REFERIDOS_MGM_POR_EMB: Record<string, { negocio: string; estado: string; hitos: number; coins: number }[]> = {
  EMB001: [
    { negocio: 'Tienda Tech Lima', estado: 'activo',   hitos: 4, coins: 585 },
    { negocio: 'Moda y Mas',       estado: 'validado', hitos: 1, coins: 130 },
  ],
  EMB002: [
    { negocio: 'Electro Norte', estado: 'pendiente', hitos: 0, coins: 0 },
  ],
}

const MGB_STATS_POR_EMB: Record<string, { compradores: number; nmv: number; compras: number; coins: number; barData: number[] }> = {
  EMB001: { compradores: 2, nmv: 539, compras: 4, coins: 260, barData: [1, 1, 2, 0] },
  EMB002: { compradores: 1, nmv: 210, compras: 2, coins: 130, barData: [0, 1, 1, 0] },
}

const REFERIDOS_NUEVOS_INIT = [
  { id: 'NR001', negocio: 'Electro Norte', ruc: '20456789123', mercado: 'Polvos Azules', embajador: 'Maria Quispe', fecha: '10 ago 2026' },
]

const ACTIVIDAD_RECIENTE = [
  { evento: 'Hito completado · seller_desarrollo',    embajador: 'Jose Garcia',  ts: 'Hace 2h',  icon: '📈' },
  { evento: 'Referido creado · Electro Norte',        embajador: 'Maria Quispe', ts: 'Hace 5h',  icon: '➕' },
  { evento: 'Coins emitidos · +260 coins',            embajador: 'Jose Garcia',  ts: 'Hace 1d',  icon: '🪙' },
  { evento: 'Hito completado · primera_venta',        embajador: 'Jose Garcia',  ts: 'Hace 2d',  icon: '🎉' },
  { evento: 'Referido creado · Moda y Mas',           embajador: 'Jose Garcia',  ts: 'Hace 3d',  icon: '➕' },
]

const ESTADO_PILL_STYLE: Record<string, { bg: string; color: string }> = {
  activo:   { bg: '#E8F8EF', color: '#00A650' },
  validado: { bg: '#EBF1FF', color: '#3483FA' },
  pendiente:{ bg: '#FFF8E7', color: '#FF7733' },
}

const NAV_ITEMS: NavItem[] = [
  { id: 'resumen',          emoji: '🏠', label: 'Resumen' },
  { id: 'referidos-nuevos', emoji: '🔔', label: 'Referidos Nuevos' },
  { id: 'embajadores',      emoji: '👥', label: 'Mis Embajadores' },
]

const SECTION_TITLES: Record<AsesorSection, string> = {
  'resumen':          'Resumen',
  'referidos-nuevos': 'Referidos Nuevos',
  'embajadores':      'Mis Embajadores',
}

// ─── Estilos base ─────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: '#fff', borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '20px',
}

function Pill({ estado }: { estado: string }) {
  const s = ESTADO_PILL_STYLE[estado] ?? { bg: '#F0F0F0', color: '#666' }
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>
      {estado}
    </span>
  )
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────

function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  const weeks = ['S1', 'S2', 'S3', 'S4']
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '56px', paddingBottom: '18px', position: 'relative' }}>
      {data.map((val, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
          <div style={{ width: '100%', background: val > 0 ? '#FFE600' : '#F0F0F0', borderRadius: '3px 3px 0 0', height: `${val > 0 ? Math.max((val / max) * 38, 6) : 4}px`, transition: 'height 0.3s' }} />
          <span style={{ fontSize: '10px', color: '#AAA', marginTop: '4px', position: 'absolute', bottom: 0 }}>{weeks[i]}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Sección: Resumen ─────────────────────────────────────────────────────────

function SeccionResumen() {
  const totalCoins = EMBAJADORES_DATA.reduce((s, e) => s + e.coins, 0)
  const topEmb = [...EMBAJADORES_DATA].sort((a, b) => b.coins - a.coins)

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Embajadores activos',          value: EMBAJADORES_DATA.length, icon: '👥' },
          { label: 'Referidos sin trabajar',        value: REFERIDOS_NUEVOS_INIT.length, icon: '🔔' },
          { label: 'Total coins emitidos',          value: `${totalCoins.toLocaleString('es-PE')} 🪙`, icon: '' },
          { label: 'Referidos activos',             value: 3, icon: '📦' },
        ].map((kpi, i) => (
          <div key={i} style={card}>
            <p style={{ fontSize: '11px', color: '#999', margin: '0 0 8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{kpi.label}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#333' }}>{kpi.value}</span>
              {kpi.icon && <span style={{ fontSize: '16px' }}>{kpi.icon}</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
        {/* Actividad reciente */}
        <div style={card}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#333', margin: '0 0 14px' }}>Actividad reciente</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {ACTIVIDAD_RECIENTE.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < ACTIVIDAD_RECIENTE.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: '#333', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.evento}</p>
                  <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{a.embajador}</p>
                </div>
                <span style={{ fontSize: '11px', color: '#CCC', flexShrink: 0 }}>{a.ts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Embajadores */}
        <div style={card}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#333', margin: '0 0 14px' }}>Top Embajadores</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topEmb.map((emb, i) => (
              <div key={emb.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#F9F9F9', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', color: i === 0 ? '#FFE600' : '#CCC', fontWeight: 700 }}>#{i + 1}</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FFE600', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#1D1D1B', flexShrink: 0 }}>
                  {emb.iniciales}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emb.nombre}</p>
                  <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{emb.referidosMGM} referidos</p>
                </div>
                <span style={{ fontWeight: 700, color: '#333', fontSize: '13px', whiteSpace: 'nowrap' }}>{emb.coins} 🪙</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sección: Referidos Nuevos ────────────────────────────────────────────────

function SeccionReferidosNuevos() {
  const [referidos, setReferidos] = useState(REFERIDOS_NUEVOS_INIT)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)

  const handleConfirm = () => {
    if (!pendingId) return
    setRemoving(pendingId)
    setTimeout(() => {
      setReferidos(prev => prev.filter(r => r.id !== pendingId))
      setRemoving(null)
      setPendingId(null)
    }, 350)
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <p style={{ fontSize: '14px', color: '#666', margin: '0 0 24px' }}>
        Estos negocios fueron enviados por tus embajadores y aún no han sido trabajados.
      </p>

      {referidos.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: '56px 32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#333', margin: '0 0 8px' }}>¡Todo al día!</h3>
          <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>No hay referidos pendientes de contacto.</p>
        </div>
      ) : (
        <div style={card}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
                {['Negocio','RUC','Mercado','Embajador','Fecha recibido','Acción'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0 12px 12px 0', fontSize: '11px', fontWeight: 600, color: '#999', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referidos.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #F9F9F9', opacity: removing === r.id ? 0 : 1, transition: 'opacity 0.3s' }}>
                  <td style={{ padding: '14px 12px 14px 0', fontWeight: 600 }}>{r.negocio}</td>
                  <td style={{ padding: '14px 12px 14px 0', fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{r.ruc}</td>
                  <td style={{ padding: '14px 12px 14px 0', color: '#555' }}>{r.mercado}</td>
                  <td style={{ padding: '14px 12px 14px 0', color: '#555' }}>{r.embajador}</td>
                  <td style={{ padding: '14px 12px 14px 0', color: '#999' }}>{r.fecha}</td>
                  <td style={{ padding: '14px 0' }}>
                    <button
                      onClick={() => setPendingId(r.id)}
                      style={{ padding: '7px 14px', borderRadius: '6px', border: '1.5px solid #3483FA', background: '#fff', color: '#3483FA', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Marcar contactado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pendingId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px 32px', width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px' }}>¿Confirmar contacto?</h3>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 22px' }}>
              Se marcará <strong>{referidos.find(r => r.id === pendingId)?.negocio}</strong> como contactado y saldrá de la lista.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setPendingId(null)} style={{ padding: '9px 18px', borderRadius: '6px', border: '1.5px solid #DDD', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Cancelar</button>
              <button onClick={handleConfirm} style={{ padding: '9px 18px', borderRadius: '6px', border: 'none', background: '#00A650', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#fff' }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sección: Mis Embajadores ─────────────────────────────────────────────────

function SeccionEmbajadores() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [detailTab, setDetailTab] = useState<'mgm' | 'mgb'>('mgm')

  const toggleExpand = (id: string) => {
    if (expandedId === id) { setExpandedId(null) }
    else { setExpandedId(id); setDetailTab('mgm') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px' }}>
      {EMBAJADORES_DATA.map((emb) => {
        const isExpanded = expandedId === emb.id
        const mgmData = REFERIDOS_MGM_POR_EMB[emb.id] ?? []
        const mgbData = MGB_STATS_POR_EMB[emb.id]

        return (
          <div key={emb.id}>
            {/* Card embajador */}
            <div style={{ ...card, cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFE600', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px', color: '#1D1D1B', flexShrink: 0 }}>
                  {emb.iniciales}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <p style={{ fontWeight: 700, fontSize: '15px', color: '#333', margin: 0 }}>{emb.nombre}</p>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#00A650', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>🟢 {emb.estado} <StatusLegend type="embajador" /></span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{emb.mercado}</p>
                </div>
                <div style={{ display: 'flex', gap: '24px', textAlign: 'center' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#999', margin: '0 0 2px' }}>MGM</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#333', margin: 0 }}>{emb.referidosMGM}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#999', margin: '0 0 2px' }}>Buyers MGB</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#333', margin: 0 }}>{emb.buyersMGB}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#999', margin: '0 0 2px' }}>Coins</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#333', margin: 0 }}>🪙 {emb.coins}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(emb.id)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1.5px solid #E0E0E0', background: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#3483FA', whiteSpace: 'nowrap' }}
                >
                  {isExpanded ? 'Cerrar ▲' : 'Ver detalle →'}
                </button>
              </div>

              {/* Detalle expandible */}
              {isExpanded && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F0F0F0' }}>
                  {/* Sub-tabs */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: '#F5F5F5', borderRadius: '8px', padding: '4px', width: 'fit-content' }}>
                    {(['mgm', 'mgb'] as const).map((tab) => (
                      <button key={tab} onClick={() => setDetailTab(tab)} style={{
                        padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                        fontSize: '12px', fontWeight: 600,
                        background: detailTab === tab ? '#fff' : 'transparent',
                        color: detailTab === tab ? '#333' : '#999',
                        boxShadow: detailTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                      }}>
                        {tab === 'mgm' ? 'Referidos MGM' : 'New Buyers MGB'}
                      </button>
                    ))}
                  </div>

                  {/* Tab MGM */}
                  {detailTab === 'mgm' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
                          {['Negocio','Estado','Hitos completados','Coins generados'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '0 0 10px', fontSize: '11px', fontWeight: 600, color: '#999' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                {h}{h === 'Estado' && <StatusLegend type="mgm" />}
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {mgmData.map((r, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #F9F9F9' }}>
                            <td style={{ padding: '10px 12px 10px 0', fontWeight: 500 }}>{r.negocio}</td>
                            <td style={{ padding: '10px 12px 10px 0' }}><Pill estado={r.estado} /></td>
                            <td style={{ padding: '10px 12px 10px 0', color: '#555' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{r.hitos}/6 hitos</span>
                                <div style={{ width: '60px', height: '4px', background: '#F0F0F0', borderRadius: '2px' }}>
                                  <div style={{ width: `${(r.hitos / 6) * 100}%`, height: '100%', background: '#FFE600', borderRadius: '2px' }} />
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '10px 0', fontWeight: 700, color: '#00A650' }}>{r.coins} 🪙</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Tab MGB */}
                  {detailTab === 'mgb' && mgbData && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                        {[
                          { label: 'Compradores activos', value: `${mgbData.compradores}` },
                          { label: 'NMV generado', value: `S/ ${mgbData.nmv.toLocaleString('es-PE')}` },
                          { label: 'Compras totales', value: `${mgbData.compras}` },
                          { label: 'Coins emitidos', value: `${mgbData.coins} 🪙` },
                        ].map((s, i) => (
                          <div key={i} style={{ background: '#F9F9F9', borderRadius: '8px', padding: '12px' }}>
                            <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px' }}>{s.label}</p>
                            <p style={{ fontSize: '16px', fontWeight: 700, color: '#333', margin: 0 }}>{s.value}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: '#F9F9F9', borderRadius: '8px', padding: '16px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#666', margin: '0 0 12px' }}>Compras por semana (últimas 4)</p>
                        <BarChart data={mgbData.barData} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Asesor() {
  const [activeSection, setActiveSection] = useState<AsesorSection>('resumen')

  return (
    <Layout
      role="asesor"
      navItems={NAV_ITEMS}
      activeSection={activeSection}
      onNavigate={(id) => setActiveSection(id as AsesorSection)}
      userName="Asesor Regional"
      userSub="Lima Centro"
      pageTitle={SECTION_TITLES[activeSection]}
    >
      {activeSection === 'resumen'          && <SeccionResumen />}
      {activeSection === 'referidos-nuevos' && <SeccionReferidosNuevos />}
      {activeSection === 'embajadores'      && <SeccionEmbajadores />}
    </Layout>
  )
}
