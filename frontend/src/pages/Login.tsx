import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post(`${API_URL}/auth/magic-link`, { email })
      setSent(true)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Este email no está registrado en el programa')
      } else {
        setError('Error al enviar el link. Intentá de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FFE600] rounded-2xl mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="#333" stroke="#333" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Embajadores ML</h1>
          <p className="text-sm text-gray-400 mt-1">Ingresá con tu email</p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">📬</div>
            <p className="font-semibold text-gray-800">Revisá tu email</p>
            <p className="text-sm text-gray-400 mt-1">
              Te mandamos un link de acceso
            </p>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              className="mt-6 text-sm text-[#3483FA] hover:underline"
            >
              Usar otro email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3483FA] focus:border-transparent transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3483FA] hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              {loading ? 'Enviando…' : 'Ingresar'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
