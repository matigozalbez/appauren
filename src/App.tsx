import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import CrearCuenta from './pages/CrearCuenta'
import Home from './pages/Home'
import MiCredencial from './pages/MiCredencial'
import TerminosCondiciones from './pages/TerminosCondiciones'
import PrivateRoute from './components/PrivateRoute'
import VincularDNI from './pages/VincularDNI'
import { BottomNav } from './components/BottomNav'
import Perfil from './pages/Perfil'
import SideMenu from './components/SideMenu'
import { useState } from 'react'
import { auth } from './firebase'
import { signOut } from 'firebase/auth'
import BuscarMedicamentoView from './components/MedicamentoSearchModal'


function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const showNav = location.pathname !== '/';
  const navigate = useNavigate();

    const handleLogout = async () => {
      localStorage.removeItem("auren_dni");
      localStorage.removeItem("auren_planes");
      await signOut(auth);
      navigate("/", { replace: true });
    };



  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/crear-cuenta" element={<CrearCuenta />} />
        <Route path="/home" element={<PrivateRoute><Home openMenu={() => setMenuOpen(true)} /></PrivateRoute>} />
        <Route path="/credencial" element={<PrivateRoute><MiCredencial/></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil/></PrivateRoute>} />
        <Route path="/medicamentos" element={<PrivateRoute><BuscarMedicamentoView/></PrivateRoute>} />
        <Route path="/terminos" element={<TerminosCondiciones />} />
        <Route path="/vincular-dni" element={<VincularDNI />} />
   
      </Routes>
            <SideMenu
  isOpen={menuOpen}
  onClose={() => setMenuOpen(false)}
  onLogout={handleLogout} // tu función de logout existente
/>


      {showNav && <BottomNav />}
    </>
  )
}

export default App