import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Embajador from './pages/Embajador'
import Asesor from './pages/Asesor'
import AuthVerify from './pages/AuthVerify'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/embajador" element={<Embajador />} />
        <Route path="/asesor" element={<Asesor />} />
        <Route path="/auth/verify" element={<AuthVerify />} />
      </Routes>
    </HashRouter>
  )
}
