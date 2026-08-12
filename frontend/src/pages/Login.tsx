import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEmbajadores, type GASEmbajador } from '../lib/gas'

export default function Login() {
  const navigate = useNavigate()
  const [embajadores, setEmbajadores] = useState<GASEmbajador[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getEmbajadores()
      .then((data) => {
        setEmbajadores(data)
        if (data.length > 0) setSelectedId(data[0].id)
      })
      .catch(() => setError('No se pudo cargar la lista de embajadores.'))
      .finally(() => setLoading(false))
  }, [])

  const handleIngresar = () => {
    if (selectedId) navigate(`/embajador?id=${selectedId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFE600] rounded-2xl mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="#333" stroke="#333" strokeWidth="1.5" strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Embajadores</h1>
          <p className="text-base text-[#3483FA] font-semibold">Mercado Libre</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-8 h-8 border-4 border-[#3483FA] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Cargando embajadores…</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-[#3483FA] hover:underline"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Seleccioná tu perfil
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3483FA] bg-white"
              >
                {embajadores.map((emb) => (
                  <option key={emb.id} value={emb.id}>
                    {emb.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleIngresar}
              disabled={!selectedId}
              className="w-full bg-[#3483FA] hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Ingresar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
