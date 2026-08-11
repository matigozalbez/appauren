import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import CrearCuenta from './pages/CrearCuenta'
import Home from './pages/Home'
import MiCredencial from './pages/MiCredencial'
import TerminosCondiciones from './pages/TerminosCondiciones'
import PrivateRoute from './components/PrivateRoute'
import VincularDNI from './pages/VincularDNI'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/crear-cuenta" element={<CrearCuenta />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/credencial" element={<PrivateRoute><MiCredencial/></PrivateRoute>} />
      <Route path="/terminos" element={<TerminosCondiciones />} />
      <Route path="/vincular-dni" element={<VincularDNI />} />
    </Routes> 
  )
}

export default App