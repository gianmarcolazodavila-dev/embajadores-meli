import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export interface NavItem {
  id: string
  emoji: string
  label: string
}

interface LayoutProps {
  role: 'embajador' | 'asesor'
  navItems: NavItem[]
  activeSection: string
  onNavigate: (id: string) => void
  userName: string
  userSub: string
  pageTitle: string
  coins?: number
  children: ReactNode
}

export default function Layout({
  navItems, activeSection, onNavigate,
  userName, userSub, pageTitle, coins, children,
}: LayoutProps) {
  const navigate = useNavigate()

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: '240px', flexShrink: 0, background: '#1D1D1B',
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}>

        {/* Logo */}
        <div style={{ padding: '20px 24px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>⭐</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px' }}>
              Embajadores
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '2px' }}>
            Mercado Libre · Perú
          </p>
        </div>

        {/* User */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#FFE600', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, fontSize: '13px',
              color: '#1D1D1B', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userName}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', margin: 0 }}>
                {userSub}
              </p>
            </div>
          </div>
          {coins !== undefined && (
            <div style={{
              marginTop: '10px', background: 'rgba(255,255,255,0.07)',
              borderRadius: '8px', padding: '7px 12px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{ fontSize: '15px' }}>🪙</span>
              <span style={{ color: '#FFE600', fontWeight: 700, fontSize: '14px' }}>
                {coins.toLocaleString('es-PE')}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>coins</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: isActive ? 600 : 400, textAlign: 'left',
                  background: isActive ? '#FFE600' : 'transparent',
                  color: isActive ? '#1D1D1B' : 'rgba(255,255,255,0.65)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <span style={{ fontSize: '16px', lineHeight: 1 }}>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 400, textAlign: 'left',
              background: 'transparent', color: 'rgba(255,255,255,0.40)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.40)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <span style={{ fontSize: '14px' }}>↩</span>
            <span>Cambiar vista</span>
          </button>
        </div>
      </aside>

      {/* ── Content area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Content header */}
        <header style={{
          background: '#fff', borderBottom: '1px solid #E8E8E8',
          padding: '14px 32px', flexShrink: 0,
        }}>
          <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px' }}>
            Embajadores ML › {pageTitle}
          </p>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#333', margin: 0 }}>
            {pageTitle}
          </h1>
        </header>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
