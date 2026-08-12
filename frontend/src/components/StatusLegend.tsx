import { useState } from 'react'

type LegendType = 'embajador' | 'mgm'

interface StatusLegendProps {
  type: LegendType
}

const LEGENDS: Record<LegendType, { icon: string; estado: string; desc: string }[]> = {
  embajador: [
    { icon: '🟢', estado: 'Activo',   desc: 'Tiene al menos 1 referido con actividad reciente' },
    { icon: '🔵', estado: 'Nuevo',    desc: 'Se unió hace menos de 30 días, sin referidos aún' },
    { icon: '⚫', estado: 'Inactivo', desc: 'Sin movimientos hace más de 30 días' },
  ],
  mgm: [
    { icon: '🟢', estado: 'Activo',   desc: 'Publicando y/o vendiendo en MercadoLibre' },
    { icon: '🔵', estado: 'Validado', desc: 'Onboarding completo, pendiente de primera publicación' },
    { icon: '🟡', estado: 'Pendiente', desc: 'Aún no completó el registro en MELI' },
  ],
}

export default function StatusLegend({ type }: StatusLegendProps) {
  const [show, setShow] = useState(false)
  const items = LEGENDS[type]

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <button
        onClick={() => setShow(!show)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px',
          fontSize: '13px', color: '#BBBBBB', lineHeight: 1,
          display: 'inline-flex', alignItems: 'center',
        }}
        title="Ver leyenda de estados"
      >
        ⓘ
      </button>

      {show && (
        <div
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          style={{
            position: 'absolute', left: '20px', top: '-8px', zIndex: 300,
            background: '#fff', border: '1px solid #E8E8E8',
            borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
            padding: '12px 14px', width: '270px', pointerEvents: 'auto',
          }}
        >
          <p style={{
            fontSize: '11px', fontWeight: 600, color: '#999',
            textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px',
          }}>
            Leyenda de estados
          </p>
          {items.map((item, i) => (
            <div key={item.estado} style={{ display: 'flex', gap: '8px', marginBottom: i < items.length - 1 ? '8px' : 0 }}>
              <span style={{ fontSize: '14px', flexShrink: 0, lineHeight: 1.5 }}>{item.icon}</span>
              <p style={{ margin: 0, fontSize: '12px', color: '#555', lineHeight: 1.5 }}>
                <strong style={{ color: '#333' }}>{item.estado}</strong>
                {' — '}{item.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </span>
  )
}
