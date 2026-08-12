import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO = {
  nombre: 'Jose Garcia',
  mercado: 'Wilson',
  coins: 520,
  coupon: 'EMBA-JG01',
  referidos: [
    { id: 'REF001', negocio: 'Tienda Tech Lima', estado: 'activo',   hitos: ['catalogo_10', 'primera_venta', 'catalogo_30'], dias: 90 },
    { id: 'REF002', negocio: 'Moda y Mas',       estado: 'validado', hitos: ['catalogo_10'],                                dias: 88 },
  ],
  wallet: [
    { descripcion: '📦 30 productos publicados · Tienda Tech Lima',  coins: 260, fecha: '2026-08-12' },
    { descripcion: '🎉 Primera venta realizada · Tienda Tech Lima',  coins: 195, fecha: '2026-08-11' },
    { descripcion: '📦 10 productos publicados · Tienda Tech Lima',  coins: 130, fecha: '2026-08-10' },
  ],
}

const DEMO_MGB = {
  coupon: 'EMBA-JG01',
  referidos: [
    { id: 'BUYER001', nombre: 'Ana Torres',    compras: 3, total_nmv: 450, ultima_compra: '2026-08-10', coins_generados: 195 },
    { id: 'BUYER002', nombre: 'Luis Mendoza',  compras: 1, total_nmv: 89,  ultima_compra: '2026-08-08', coins_generados: 65 },
  ],
  wallet_mgb: [
    { descripcion: '🛒 Primera compra realizada · Ana Torres',    coins: 65,  fecha: '2026-08-08' },
    { descripcion: '🔄 3 compras completadas · Ana Torres',       coins: 130, fecha: '2026-08-10' },
    { descripcion: '🛒 Primera compra realizada · Luis Mendoza',  coins: 65,  fecha: '2026-08-08' },
  ],
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const HITO_LABELS: Record<string, string> = {
  catalogo_10:       '10 pub.',
  catalogo_30:       '30 pub.',
  catalogo_100:      '100 pub.',
  primera_venta:     '1ª venta',
  seller_desarrollo: 'Desarro.',
  seller_activado:   'Activado',
}

const HITO_ORDER = ['catalogo_10', 'catalogo_30', 'catalogo_100', 'primera_venta', 'seller_desarrollo', 'seller_activado']

const ESTADO_STYLES: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  validado:  'bg-blue-100 text-blue-800',
  activo:    'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-700',
}

const PRIZES = [
  { name: 'Gift card S/30',  coins: 300 },
  { name: 'Gift card S/50',  coins: 500 },
  { name: 'Audífonos',       coins: 1500 },
  { name: 'Sesión de fotos', coins: 1500 },
  { name: 'Smartwatch',      coins: 4000 },
  { name: 'Smartphone',      coins: 10000 },
]

const GUIDE_MGM = [
  { hito: '10 productos en catálogo',                      coins: 130, icon: '📦' },
  { hito: '30 productos en catálogo',                      coins: 260, icon: '📦' },
  { hito: '100 productos en catálogo',                     coins: 390, icon: '📦' },
  { hito: 'Primera venta',                                 coins: 195, icon: '🎉' },
  { hito: 'Seller en desarrollo (10 ventas + S/.1,000 NMV)', coins: 390, icon: '📈' },
  { hito: 'Seller activado (25 ventas + S/.3,000 NMV)',    coins: 585, icon: '⭐' },
]

const GUIDE_MGB = [
  { hito: 'Primera compra del comprador',    coins: 65,  icon: '🛒' },
  { hito: '3 compras completadas',           coins: 130, icon: '🔄' },
  { hito: 'Comprador recurrente (5+ compras)', coins: 195, icon: '🏆' },
]

type Tab = 'mgm' | 'mgb' | 'guia'

const TAB_LABELS: Record<Tab, string> = {
  mgm:  'MGM (Vendedores)',
  mgb:  'MGB (Compradores)',
  guia: 'Cómo ganar coins',
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Embajador() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('mgm')
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard
      .writeText(`https://www.mercadolibre.com.pe/?ref=${DEMO_MGB.coupon}`)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => {})
  }

  const totalCoinsMGB = DEMO_MGB.referidos.reduce((s, r) => s + r.coins_generados, 0)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Header ── */}
      <header className="bg-[#FFE600] px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Hola, {DEMO.nombre}</h1>
            <span className="bg-gray-900 text-[#FFE600] text-xs font-semibold px-3 py-1 rounded-full">
              {DEMO.mercado}
            </span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* ── Wallet (siempre visible) ── */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Mis Meli Coins
          </h2>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-6xl font-black text-[#3483FA] leading-none">
              {DEMO.coins.toLocaleString('es-PE')}
            </span>
            <span className="text-xl text-gray-400 mb-1">coins</span>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            ≈ S/ {(DEMO.coins / 10).toLocaleString('es-PE', { minimumFractionDigits: 2 })} de valor referencial
          </p>

          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Últimas transacciones
          </h3>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[380px]">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-2 pl-2 font-medium w-28">Fecha</th>
                  <th className="pb-2 font-medium">Descripción</th>
                  <th className="pb-2 pr-2 font-medium text-right w-20">Coins</th>
                </tr>
              </thead>
              <tbody>
                {[...DEMO.wallet, ...DEMO_MGB.wallet_mgb]
                  .sort((a, b) => b.fecha.localeCompare(a.fecha))
                  .map((tx, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 pl-2 text-gray-400 whitespace-nowrap">{tx.fecha}</td>
                      <td className="py-2.5 text-gray-700 pr-4">{tx.descripcion}</td>
                      <td className="py-2.5 pr-2 text-right font-semibold text-green-600">
                        +{tx.coins}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab ? 'bg-[#3483FA] text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* ── Tab: MGM ── */}
        {activeTab === 'mgm' && (
          <>
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Mis referidos MGM
              </h2>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[480px]">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="pb-2 pl-2 font-medium">Negocio</th>
                      <th className="pb-2 font-medium">Estado</th>
                      <th className="pb-2 font-medium text-center w-24">Días rest.</th>
                      <th className="pb-2 pr-2 font-medium">Hitos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO.referidos.map((r) => (
                      <tr key={r.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pl-2 pr-4 font-semibold text-gray-900">{r.negocio}</td>
                        <td className="py-3 pr-4">
                          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ESTADO_STYLES[r.estado] ?? ''}`}>
                            {r.estado}
                          </span>
                        </td>
                        <td className="py-3 text-center text-gray-500">{r.dias}d</td>
                        <td className="py-3 pr-2">
                          <div className="flex gap-1">
                            {HITO_ORDER.map((tipo) => (
                              <div
                                key={tipo}
                                title={HITO_LABELS[tipo]}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  r.hitos.includes(tipo)
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-300'
                                }`}
                              >
                                {r.hitos.includes(tipo) ? '✓' : '○'}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Catálogo de premios */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Catálogo de premios
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {PRIZES.map((prize) => {
                  const canRedeem = DEMO.coins >= prize.coins
                  return (
                    <div key={prize.name} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{prize.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{prize.coins.toLocaleString('es-PE')} coins</p>
                      </div>
                      <button
                        disabled={!canRedeem}
                        onClick={() => alert('Contactá a tu asesor para gestionar el canje.')}
                        className={`w-full text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                          canRedeem
                            ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {canRedeem ? 'Canjear' : `Te faltan ${(prize.coins - DEMO.coins).toLocaleString('es-PE')} coins`}
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {/* ── Tab: MGB ── */}
        {activeTab === 'mgb' && (
          <>
            {/* Cupón */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Mi cupón MGB
              </h2>
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <span className="text-4xl font-black tracking-widest text-gray-900 font-mono">
                  {DEMO_MGB.coupon}
                </span>
                <button
                  onClick={copyLink}
                  className="bg-[#3483FA] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                >
                  {copied ? '¡Copiado!' : 'Copiar link'}
                </button>
              </div>
              <div className="flex gap-8 text-sm text-gray-500">
                <div>
                  <span className="text-2xl font-black text-gray-900">{DEMO_MGB.referidos.length}</span>
                  <span className="ml-1.5">compradores referidos</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-[#3483FA]">{totalCoinsMGB}</span>
                  <span className="ml-1.5">coins ganados por MGB</span>
                </div>
              </div>
            </section>

            {/* Tabla compradores */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Compradores referidos
              </h2>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[480px]">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="pb-2 pl-2 font-medium">Comprador</th>
                      <th className="pb-2 font-medium text-center">Compras</th>
                      <th className="pb-2 font-medium text-right">NMV (S/)</th>
                      <th className="pb-2 font-medium">Última compra</th>
                      <th className="pb-2 pr-2 font-medium text-right">Coins gen.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_MGB.referidos.map((r) => (
                      <tr key={r.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pl-2 font-semibold text-gray-900">{r.nombre}</td>
                        <td className="py-3 text-center text-gray-600">{r.compras}</td>
                        <td className="py-3 text-right text-gray-600">
                          S/ {r.total_nmv.toLocaleString('es-PE')}
                        </td>
                        <td className="py-3 text-gray-500">{r.ultima_compra}</td>
                        <td className="py-3 pr-2 text-right font-semibold text-green-600">
                          +{r.coins_generados}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Wallet MGB */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Transacciones MGB
              </h2>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[380px]">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="pb-2 pl-2 font-medium w-28">Fecha</th>
                      <th className="pb-2 font-medium">Descripción</th>
                      <th className="pb-2 pr-2 font-medium text-right w-20">Coins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_MGB.wallet_mgb.map((tx, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="py-2.5 pl-2 text-gray-400 whitespace-nowrap">{tx.fecha}</td>
                        <td className="py-2.5 text-gray-700 pr-4">{tx.descripcion}</td>
                        <td className="py-2.5 pr-2 text-right font-semibold text-green-600">
                          +{tx.coins}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* ── Tab: Cómo ganar coins ── */}
        {activeTab === 'guia' && (
          <div className="space-y-6">

            {/* MGM */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">
                Referís a un Vendedor (MGM)
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Cuando un negocio que referiste alcanza estos hitos en Mercado Libre, ganás coins automáticamente.
              </p>
              <div className="space-y-2">
                {GUIDE_MGM.map((item) => (
                  <div
                    key={item.hito}
                    className="flex items-center justify-between border-l-4 border-[#FFE600] bg-gray-50 rounded-r-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm text-gray-700">{item.hito}</span>
                    </div>
                    <span className="text-sm font-black text-[#3483FA] whitespace-nowrap ml-4">
                      +{item.coins} coins
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* MGB */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">
                Referís a un Comprador (MGB)
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Compartí tu cupón con compradores. Ganás coins cuando compran en Mercado Libre.
              </p>
              <div className="space-y-2">
                {GUIDE_MGB.map((item) => (
                  <div
                    key={item.hito}
                    className="flex items-center justify-between border-l-4 border-[#FFE600] bg-gray-50 rounded-r-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm text-gray-700">{item.hito}</span>
                    </div>
                    <span className="text-sm font-black text-[#3483FA] whitespace-nowrap ml-4">
                      +{item.coins} coins
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Nota al pie */}
            <p className="text-xs text-gray-400 text-center pb-2">
              ⏰ Los coins se acreditan automáticamente cada día a las 3am.
            </p>
          </div>
        )}

      </main>
    </div>
  )
}
