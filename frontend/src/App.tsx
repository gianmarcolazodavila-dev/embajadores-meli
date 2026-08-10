import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Embajador from './pages/Embajador'
import Asesor from './pages/Asesor'
import AuthVerify from './pages/AuthVerify'

export default function App() {
  return (
    <BrowserRouter basename="/embajadores-meli">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/embajador" element={<Embajador />} />
        <Route path="/asesor" element={<Asesor />} />
        <Route path="/auth/verify" element={<AuthVerify />} />
      </Routes>
    </BrowserRouter>
  )
}
