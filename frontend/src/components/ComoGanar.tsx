import { useMobile } from '../contexts/MobileContext'

// ─── Datos del programa ───────────────────────────────────────────────────────

const MGM_HITOS = [
  { hito: 'Catálogo inicial',     condicion: '10 publicaciones activas',           coins: 100 },
  { hito: 'Catálogo desarrollado',condicion: '30 publicaciones activas',           coins: 200 },
  { hito: 'Catálogo avanzado',    condicion: '100 publicaciones activas',          coins: 300 },
  { hito: 'Primera venta',        condicion: 'Primera venta neta entregada',       coins: 150 },
  { hito: 'Seller en desarrollo', condicion: '10 ventas + S/ 1,000 NMV',          coins: 300 },
  { hito: 'Seller activado',      condicion: '25 ventas + S/ 3,000 NMV',          coins: 450 },
]

const MGB_HITOS = [
  { hito: 'Primera compra',        condicion: 'Compra entregada y válida',          coins: 50  },
  { hito: 'Recurrencia',           condicion: '2da compra dentro de 60 días',       coins: 75  },
  { hito: 'Buyer desarrollado',    condicion: 'S/ 300 GMV en 90 días',             coins: 100 },
  { hito: 'Vertical prioritaria',  condicion: 'Compra en categoría con campaña',   coins: 50  },
]

const MGM_PASOS = ['Enrolar', 'Referir', 'Validar', 'Activar', 'Acreditar']
const MGB_PASOS = ['Seleccionar', 'Compartir cupón', 'Comprar', 'Validar', 'Acreditar']

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function FlowPasos({ pasos, color }: { pasos: string[]; color: string }) {
  const isMobile = useMobile()
  return (
    <div style={{
      overflowX: 'auto', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
      marginBottom: '20px', paddingBottom: '4px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', minWidth: isMobile ? '420px' : 'auto' }}>
        {pasos.map((paso, i) => (
          <div key={paso} style={{ display: 'flex', alignItems: 'center', flex: i < pasos.length - 1 ? '1' : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', background: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '13px', color: '#1D1D1B', flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 500, color: '#555', whiteSpace: 'nowrap', textAlign: 'center' }}>
                {paso}
              </span>
            </div>
            {i < pasos.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: `${color}66`, margin: '0 4px', marginTop: '-16px' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function HitoTable({ hitos, maxCoins, maxLabel }: {
  hitos: { hito: string; condicion: string; coins: number }[]
  maxCoins: number
  maxLabel: string
}) {
  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'] }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '380px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            {['Hito', 'Condición', 'Coins'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '0 8px 10px 0', fontSize: '11px', fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hitos.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <td style={{ padding: '9px 8px 9px 0', fontWeight: 600, color: '#333', whiteSpace: 'nowrap' }}>{row.hito}</td>
              <td style={{ padding: '9px 8px 9px 0', color: '#666' }}>{row.condicion}</td>
              <td style={{ padding: '9px 0', fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>+{row.coins} 🪙</td>
            </tr>
          ))}
          <tr style={{ borderTop: '2px solid rgba(0,0,0,0.1)' }}>
            <td style={{ padding: '10px 8px 10px 0', fontWeight: 700, color: '#1D1D1B' }}>{maxLabel}</td>
            <td style={{ padding: '10px 8px 10px 0', color: '#666', fontSize: '12px' }}>Todos los hitos aplicables</td>
            <td style={{ padding: '10px 0', fontWeight: 800, fontSize: '15px', color: '#1D1D1B', whiteSpace: 'nowrap' }}>{maxCoins} 🪙</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface ComoGanarProps {
  onGoToPremios?: () => void
}

export default function ComoGanar({ onGoToPremios }: ComoGanarProps) {
  return (
    <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1D1D1B', margin: '0 0 6px' }}>
          Programa Embajadores Mercado Libre
        </h2>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          Acumulás Meli Coins por dos caminos distintos. Cada misión tiene sus propias reglas.
        </p>
      </div>

      {/* Bloque MGM */}
      <div style={{ background: '#FFFDE7', border: '1px solid #FFE600', borderRadius: '12px', padding: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#997A00', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 6px' }}>
          MISIÓN MGM
        </p>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1D1D1B', margin: '0 0 4px' }}>
          🤝 Refiere un Vendedor
        </h3>
        <p style={{ fontSize: '13px', color: '#666', margin: '0 0 20px' }}>
          Refiere un negocio real y ganas coins a medida que crece en MercadoLibre.
        </p>

        <FlowPasos pasos={MGM_PASOS} color="#FFE600" />
        <HitoTable hitos={MGM_HITOS} maxCoins={1500} maxLabel="Máximo por seller" />

        {/* Bonus card */}
        <div style={{ marginTop: '16px', background: '#FFE600', borderRadius: '8px', padding: '14px 16px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#1D1D1B', margin: 0 }}>
            ⭐ <strong>Bonus de consistencia: +500 Coins</strong> cuando 3 sellers referidos distintos alcanzan Seller Activado dentro de sus ventanas de 90 días.
          </p>
        </div>

        <p style={{ fontSize: '11px', color: '#888', margin: '12px 0 0' }}>
          ⏱ Ventana de 90 días desde que el referido es validado
        </p>
      </div>

      {/* Bloque MGB */}
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 6px' }}>
          MISIÓN MGB
        </p>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1D1D1B', margin: '0 0 4px' }}>
          🛍️ Refiere un Comprador
        </h3>
        <p style={{ fontSize: '13px', color: '#666', margin: '0 0 20px' }}>
          Comparte tu cupón y ganas coins cuando tus compradores realizan compras válidas.
        </p>

        <FlowPasos pasos={MGB_PASOS} color="#3483FA" />
        <HitoTable hitos={MGB_HITOS} maxCoins={275} maxLabel="Máximo por buyer" />

        <div style={{ marginTop: '14px', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px', padding: '12px 14px' }}>
          <p style={{ fontSize: '12px', color: '#92400E', margin: 0 }}>
            ⚠️ <strong>No se pagan</strong> registros, visitas ni carritos abandonados. Solo compras entregadas y no canceladas.
          </p>
        </div>

        <p style={{ fontSize: '11px', color: '#888', margin: '12px 0 0' }}>
          ⏱ Ventana de 90 días desde la primera compra del buyer
        </p>
      </div>

      {/* Bloque Canjes */}
      <div style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: '12px', padding: '20px 24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1D1D1B', margin: '0 0 12px' }}>
          🎁 ¿Cómo canjear?
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
          {[
            'Los cortes son el 15 de cada mes.',
            'El premio se entrega en la primera semana del mes siguiente.',
            '10 Meli Coins ≈ S/ 1 de valor percibido.',
          ].map((txt, i) => (
            <p key={i} style={{ fontSize: '13px', color: '#555', margin: 0 }}>· {txt}</p>
          ))}
        </div>
        {onGoToPremios && (
          <button
            onClick={onGoToPremios}
            style={{ padding: '9px 20px', background: '#FFE600', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', color: '#1D1D1B' }}
          >
            Ver catálogo de premios →
          </button>
        )}
      </div>

    </div>
  )
}
