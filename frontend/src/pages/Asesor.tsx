import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/sheets'

const MERCADO_STYLES: Record<string, string> = {
  wilson:         'bg-blue-100 text-blue-800',
  polvos_azules:  'bg-sky-100 text-sky-700',
  polvos_rosados: 'bg-pink-100 text-pink-800',
}

const MERCADO_LABELS: Record<string, string> = {
  wilson:         'Wilson',
  polvos_azules:  'Polvos Azules',
  polvos_rosados: 'Polvos Rosados',
}

export default function Asesor() {
  const navigate = useNavigate()
  const [embajadores, setEmbajadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getEmbajadores()
      .then(setEmbajadores)
      .catch(() => setError('No se pudo cargar la lista de embajadores.'))
      .finally(() => setLoading(false))
  }, [])

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Embajadores ({embajadores.length})
          </h2>
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="py-3 pl-6 font-medium">Nombre</th>
                  <th className="py-3 font-medium">Mercado</th>
                  <th className="py-3 font-medium">Coins</th>
                  <th className="py-3 pr-6 font-medium">Cupón</th>
                </tr>
              </thead>
              <tbody>
                {embajadores.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-gray-400">
                      No hay embajadores registrados.
                    </td>
                  </tr>
                ) : embajadores.map((emb) => (
                  <tr
                    key={emb.id}
                    onClick={() => navigate(`/embajador?id=${emb.id}`)}
                    className="border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 pl-6">
                      <p className="font-semibold text-gray-900">{emb.nombre}</p>
                      <p className="text-xs text-gray-400">{emb.id}</p>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${MERCADO_STYLES[emb.mercado] ?? 'bg-gray-100 text-gray-600'}`}>
                        {MERCADO_LABELS[emb.mercado] ?? emb.mercado}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-[#3483FA]">
                      {(emb.coins_balance ?? 0).toLocaleString('es-PE')}
                    </td>
                    <td className="py-3 pr-6 font-mono text-gray-700">
                      {emb.coupon_code ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
