import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#FFE600] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo + título */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="#FFE600" stroke="#FFE600" strokeWidth="1.5" strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-900">Embajadores</h1>
          <p className="text-lg font-bold text-gray-900">Mercado Libre</p>
          <p className="text-sm text-gray-600 mt-2">Seleccioná tu vista para el demo</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/embajador')}
            className="bg-white hover:bg-gray-50 rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all group"
          >
            <div className="text-3xl mb-3">🛍️</div>
            <p className="font-bold text-gray-900 text-base leading-tight">Vista Embajador</p>
            <p className="text-xs text-gray-400 mt-1">Dashboard personal</p>
            <div className="mt-4 text-xs font-semibold text-[#3483FA] group-hover:underline">
              Ingresar →
            </div>
          </button>

          <button
            onClick={() => navigate('/asesor')}
            className="bg-gray-900 hover:bg-gray-800 rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all group"
          >
            <div className="text-3xl mb-3">📊</div>
            <p className="font-bold text-white text-base leading-tight">Vista Asesor</p>
            <p className="text-xs text-gray-400 mt-1">Panel de gestión</p>
            <div className="mt-4 text-xs font-semibold text-[#FFE600] group-hover:underline">
              Ingresar →
            </div>
          </button>
        </div>

      </div>
    </div>
  )
}
