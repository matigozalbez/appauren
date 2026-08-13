import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import CrearCuenta from './pages/CrearCuenta'
import Home from './pages/Home'
import MiCredencial from './pages/MiCredencial'
import TerminosCondiciones from './pages/TerminosCondiciones'
import PrivateRoute from './components/PrivateRoute'
import VincularDNI from './pages/VincularDNI'
import { BottomNav } from './components/BottomNav'
import Perfil from './pages/Perfil'

function App() {
  const location = useLocation();
  const showNav = location.pathname !== '/';

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/crear-cuenta" element={<CrearCuenta />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/credencial" element={<PrivateRoute><MiCredencial/></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil/></PrivateRoute>} />
        <Route path="/terminos" element={<TerminosCondiciones />} />
        <Route path="/vincular-dni" element={<VincularDNI />} />
      </Routes>

      {showNav && <BottomNav />}
    </>
  )
}

export default App