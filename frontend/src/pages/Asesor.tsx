import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Demo data ────────────────────────────────────────────────────────────────

const EMBAJADORES = [
  { id: 'EMB001', nombre: 'Jose Garcia',  mercado: 'Wilson',       coins: 520, referidos: 2, coupon: 'EMBA-JG01' },
  { id: 'EMB002', nombre: 'Maria Quispe', mercado: 'Polvos Azules', coins: 195, referidos: 1, coupon: 'EMBA-MQ02' },
]

const REFERIDOS = [
  { negocio: 'Tienda Tech Lima', ruc: '20123456789', embajador: 'Jose Garcia',  estado: 'activo',   dias: 90, hitos: 3 },
  { negocio: 'Moda y Mas',       ruc: '20987654321', embajador: 'Jose Garcia',  estado: 'validado', dias: 88, hitos: 1 },
  { negocio: 'Electro Norte',    ruc: '20456789123', embajador: 'Maria Quispe', estado: 'pendiente', dias: 90, hitos: 0 },
]

// ─── Constantes ───────────────────────────────────────────────────────────────

const MERCADO_STYLES: Record<string, string> = {
  'Wilson':       'bg-blue-100 text-blue-800',
  'Polvos Azules': 'bg-sky-100 text-sky-700',
  'Polvos Rosados': 'bg-pink-100 text-pink-800',
}

const ESTADO_STYLES: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  validado:  'bg-blue-100 text-blue-800',
  activo:    'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-700',
}

const HITO_TOTAL = 6

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Asesor() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'embajadores' | 'referidos'>('embajadores')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-[#FFE600] px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Panel Asesor</h1>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit">
          {(['embajadores', 'referidos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-[#3483FA] text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'embajadores' ? 'Embajadores' : 'Referidos MGM'}
            </button>
          ))}
        </div>

        {/* Tab: Embajadores */}
        {activeTab === 'embajadores' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Embajadores ({EMBAJADORES.length})
              </h2>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[520px]">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="py-3 pl-6 font-medium">Nombre</th>
                      <th className="py-3 font-medium">Mercado</th>
                      <th className="py-3 font-medium">Coins</th>
                      <th className="py-3 font-medium text-center">Referidos</th>
                      <th className="py-3 pr-6 font-medium">Cupón</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EMBAJADORES.map((emb) => (
                      <tr key={emb.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pl-6">
                          <p className="font-semibold text-gray-900">{emb.nombre}</p>
                          <p className="text-xs text-gray-400">{emb.id}</p>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${MERCADO_STYLES[emb.mercado] ?? 'bg-gray-100 text-gray-600'}`}>
                            {emb.mercado}
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-[#3483FA]">
                          {emb.coins.toLocaleString('es-PE')}
                        </td>
                        <td className="py-3 text-center text-gray-600">{emb.referidos}</td>
                        <td className="py-3 pr-6 font-mono text-gray-700">{emb.coupon}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Tab: Referidos MGM */}
        {activeTab === 'referidos' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Referidos MGM ({REFERIDOS.length})
              </h2>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[580px]">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="py-3 pl-6 font-medium">Negocio</th>
                      <th className="py-3 font-medium">RUC</th>
                      <th className="py-3 font-medium">Embajador</th>
                      <th className="py-3 font-medium">Estado</th>
                      <th className="py-3 font-medium text-center">Días rest.</th>
                      <th className="py-3 pr-6 font-medium text-center">Hitos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REFERIDOS.map((r, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pl-6 font-semibold text-gray-900">{r.negocio}</td>
                        <td className="py-3 font-mono text-gray-500 text-xs">{r.ruc}</td>
                        <td className="py-3 text-gray-600">{r.embajador}</td>
                        <td className="py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ESTADO_STYLES[r.estado] ?? ''}`}>
                            {r.estado}
                          </span>
                        </td>
                        <td className="py-3 text-center text-gray-500">{r.dias}d</td>
                        <td className="py-3 pr-6 text-center">
                          <span className="text-xs font-semibold text-gray-600">
                            {r.hitos}/{HITO_TOTAL}
                          </span>
                          <div className="mt-1 w-full bg-gray-100 rounded-full h-1.5 mx-auto max-w-[48px]">
                            <div
                              className="bg-[#3483FA] h-1.5 rounded-full"
                              style={{ width: `${(r.hitos / HITO_TOTAL) * 100}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
