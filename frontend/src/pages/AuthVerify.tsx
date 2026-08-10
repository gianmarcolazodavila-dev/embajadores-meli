import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default function AuthVerify() {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')

    if (!token) {
      setError(true)
      return
    }

    axios
      .get<{ token: string; role: string; nombre: string }>(
        `${API_URL}/auth/verify?token=${token}`
      )
      .then(({ data }) => {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_role', data.role)
        if (data.role === 'ambassador') {
          navigate('/embajador', { replace: true })
        } else {
          navigate('/asesor', { replace: true })
        }
      })
      .catch(() => setError(true))
  }, [location.search, navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center w-full max-w-sm">
          <div className="text-5xl mb-4">🔗</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Link inválido o vencido
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Pedí uno nuevo desde la pantalla de ingreso.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#3483FA] hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Volver al login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-4 border-[#3483FA] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-400">Verificando…</p>
      </div>
    </div>
  )
}
