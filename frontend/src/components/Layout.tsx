import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MobileContext } from '../contexts/MobileContext'

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
  const [mobilePreview, setMobilePreview] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const isMobile = mobilePreview || windowWidth < 768

  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <MobileContext.Provider value={isMobile}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column' }}>

        {/* ── Mobile top header ── */}
        {isMobile && (
          <header style={{
            background: '#1D1D1B', padding: '10px 16px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>⭐</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>Embajadores</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {coins !== undefined && (
                <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 10px', color: '#FFE600', fontWeight: 700, fontSize: '13px' }}>
                  🪙 {coins.toLocaleString('es-PE')}
                </span>
              )}
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#FFE600', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#1D1D1B' }}>
                {initials}
              </div>
            </div>
          </header>
        )}

        {/* ── Main body ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* ── Desktop Sidebar ── */}
          {!isMobile && (
            <aside style={{
              width: '240px', flexShrink: 0, background: '#1D1D1B',
              display: 'flex', flexDirection: 'column', overflowY: 'auto',
            }}>
              <div style={{ padding: '20px 24px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>⭐</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px' }}>Embajadores</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '2px' }}>Mercado Libre · Perú</p>
              </div>

              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FFE600', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#1D1D1B', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', margin: 0 }}>{userSub}</p>
                  </div>
                </div>
                {coins !== undefined && (
                  <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.07)', borderRadius: '8px', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '15px' }}>🪙</span>
                    <span style={{ color: '#FFE600', fontWeight: 700, fontSize: '14px' }}>{coins.toLocaleString('es-PE')}</span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>coins</span>
                  </div>
                )}
              </div>

              <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
                    >
                      <span style={{ fontSize: '16px', lineHeight: 1 }}>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>

              <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', textAlign: 'left', background: 'transparent', color: 'rgba(255,255,255,0.40)', transition: 'all 0.15s' }}
                >
                  <span>↩</span><span>Cambiar vista</span>
                </button>
              </div>
            </aside>
          )}

          {/* ── Content area ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
            <header style={{ background: '#fff', borderBottom: '1px solid #E8E8E8', padding: isMobile ? '10px 16px' : '14px 32px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                {!isMobile && <p style={{ fontSize: '11px', color: '#999', margin: '0 0 3px' }}>Embajadores ML › {pageTitle}</p>}
                <h1 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 700, color: '#333', margin: 0 }}>{pageTitle}</h1>
              </div>
              <button
                onClick={() => setMobilePreview(!mobilePreview)}
                style={{ padding: '7px 14px', borderRadius: '6px', border: '1.5px solid #E0E0E0', background: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#555', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {isMobile ? '🖥 Vista PC' : '📱 Vista móvil'}
              </button>
            </header>

            <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '28px 32px', paddingBottom: isMobile ? '76px' : '28px' }}>
              {children}
            </main>
          </div>
        </div>

        {/* ── Mobile bottom nav ── */}
        {isMobile && (
          <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px',
            background: '#1D1D1B', display: 'flex', alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 200,
          }}>
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: '2px', height: '100%',
                    background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 2px',
                  }}
                >
                  <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.emoji}</span>
                  {isActive && (
                    <span style={{ fontSize: '9px', color: '#FFE600', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '52px', textAlign: 'center' }}>
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <div style={{ position: 'absolute', bottom: 0, width: '28px', height: '2px', background: '#FFE600', borderRadius: '1px' }} />
                  )}
                </button>
              )
            })}
          </nav>
        )}

      </div>
    </MobileContext.Provider>
  )
}
