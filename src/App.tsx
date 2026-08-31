import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import MiCredencial from './pages/MiCredencial'
import TerminosCondiciones from './pages/TerminosCondiciones'
import PrivateRoute from './components/PrivateRoute'
import VincularDNI from './pages/VincularDNI'
import { BottomNav } from './components/BottomNav'
import Perfil from './pages/Perfil'
import SideMenu from './components/SideMenu'
import { useState, useEffect} from 'react'
import { auth} from './firebase'
import { signOut } from 'firebase/auth'
import BuscarMedicamentoView from './components/MedicamentoSearchModal'
import PrimerIngreso from './pages/Primeringreso'

import InstalarApp from './pages/AppGuard'

import DetallePlan from './pages/DetallePlan'
import RecuperarPassword from './pages/RecuperarPassword'
import SolicitudTurno from './pages/SolicitudTurno'
import CartillaMedica from './pages/CartillaMedica'
import Citas from './pages/Citas'


function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const showNav = location.pathname !== '/' && location.pathname !== '/primer-ingreso' && location.pathname !== '/vincular-dni' && location.pathname !== '/recuperar-password';

  const [isStandalone, setIsStandalone] = useState<boolean | null>(null);

  const navigate = useNavigate();




useEffect(() => {
  
  const check =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;

  setIsStandalone(check);
}, []);

if (isStandalone === null) {
  return null;
}

if (!isStandalone) {
  return <InstalarApp />;
}


const handleLogout = async () => {
  // 1. Borramos las keys fijas que ya tenías
  localStorage.removeItem("auren_dni");
  localStorage.removeItem("auren_planes");
  localStorage.removeItem("nombre_socio");
  localStorage.removeItem("auren_socio"); 

  // 2. Buscamos y borramos TODAS las keys dinámicas de los planes
  const keysAEliminar = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("auren_detalle_plan_")) {
      keysAEliminar.push(key);
    }
  }
  keysAEliminar.forEach((key) => localStorage.removeItem(key));

  // 3. Cerramos sesión y redirigimos
  await signOut(auth);
  navigate("/", { replace: true });
};





  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar-password" element={<RecuperarPassword/>} />
        <Route path="/primer-ingreso" element={<PrimerIngreso />} />
        <Route path="/home" element={<PrivateRoute><Home openMenu={() => setMenuOpen(true)} /></PrivateRoute>} />
        <Route path="/credencial" element={<PrivateRoute><MiCredencial/></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil/></PrivateRoute>} />
        <Route path="/medicamentos" element={<PrivateRoute><BuscarMedicamentoView/></PrivateRoute>} />
        <Route path="/citas" element={<PrivateRoute><Citas/></PrivateRoute>} />
        <Route path="/cartilla" element={<PrivateRoute><CartillaMedica/></PrivateRoute>} />
        <Route path="/turnos" element={<PrivateRoute><SolicitudTurno/></PrivateRoute>} />
        <Route path="/planes/:plan" element={<PrivateRoute><DetallePlan/></PrivateRoute>} />
        <Route path="/terminos" element={<TerminosCondiciones />} />
        <Route path="/vincular-dni" element={<VincularDNI />} />
   
      </Routes>
            <SideMenu
  isOpen={menuOpen}
  onClose={() => setMenuOpen(false)}
  onLogout={handleLogout} // 
/>


      {showNav && <BottomNav />}
    </>
  )
}

export default App