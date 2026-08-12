import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh', background: '#1D1D1B',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px', background: '#FFE600', borderRadius: '16px',
            marginBottom: '20px', fontSize: '28px',
          }}>
            ⭐
          </div>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, margin: '0 0 6px' }}>
            Embajadores
          </h1>
          <p style={{ color: '#FFE600', fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>
            Mercado Libre · Perú
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: 0 }}>
            Selecciona tu vista para continuar
          </p>
        </div>

        {/* Role cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={() => navigate('/embajador')}
            style={{
              background: '#FFE600', borderRadius: '12px', padding: '24px 20px',
              textAlign: 'left', border: 'none', cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              boxShadow: '0 2px 12px rgba(255,230,0,0.25)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(255,230,0,0.35)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(255,230,0,0.25)' }}
          >
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>🛍️</div>
            <p style={{ fontWeight: 700, color: '#1D1D1B', fontSize: '14px', margin: '0 0 4px' }}>
              Vista Embajador
            </p>
            <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '11px', margin: 0 }}>
              Dashboard personal
            </p>
          </button>

          <button
            onClick={() => navigate('/asesor')}
            style={{
              background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px 20px',
              textAlign: 'left', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
              transition: 'transform 0.15s, background 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.13)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)' }}
          >
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>📊</div>
            <p style={{ fontWeight: 700, color: '#fff', fontSize: '14px', margin: '0 0 4px' }}>
              Vista Asesor
            </p>
            <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: '11px', margin: 0 }}>
              Panel de gestión
            </p>
          </button>
        </div>

      </div>
    </div>
  )
}
