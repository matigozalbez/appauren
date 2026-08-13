import { Link, useLocation } from "react-router-dom";
import { Shield, IdCard, Home as HomeIcon, User } from "lucide-react";

// Mapeamos los índices numéricos para saber qué está a la izquierda y qué a la derecha
const routeIndices: { [key: string]: number } = {
  "/home": 1,
  "/coberturas": 2,
  "/credencial": 3,
  "/perfil": 4,
};

export const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Función que detecta el sentido y guarda la dirección antes de cambiar de ruta
  const handleNavClick = (targetPath: string) => {
    const currentIndex = routeIndices[location.pathname] || 1;
    const targetIndex = routeIndices[targetPath] || 1;

    // Si el destino es mayor, vamos hacia la derecha (entra de derecha)
    // Si es menor, vamos hacia la izquierda (entra de izquierda)
    const direction = targetIndex > currentIndex ? "right" : "left";
    sessionStorage.setItem("nav_direction", direction);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-slate-200 bg-white py-2.5 z-50 shadow-lg">
      <Link 
        to="/home" 
        onClick={() => handleNavClick("/home")}
        className={`flex flex-col items-center gap-1 ${isActive('/home') ? 'text-[#0F1E3D]' : 'text-slate-400'}`}
      >
        <HomeIcon size={20} />
        <span className="text-[10px] font-bold">Inicio</span>
      </Link>

      <button 
        onClick={() => handleNavClick("/coberturas")} // Si más adelante creás la ruta de coberturas
        className="flex flex-col items-center gap-1 text-slate-400"
      >
        <Shield size={20} />
        <span className="text-[10px] font-medium">Coberturas</span>
      </button>

      <Link 
        to="/credencial" 
        onClick={() => handleNavClick("/credencial")}
        className={`flex flex-col items-center gap-1 ${isActive('/credencial') ? 'text-[#0F1E3D]' : 'text-slate-400'}`}
      >
        <IdCard size={20} />
        <span className="text-[10px] font-medium">Credencial</span>
      </Link>
      
      <Link 
        to="/perfil" 
        onClick={() => handleNavClick("/perfil")}
        className={`flex flex-col items-center gap-1 ${isActive('/perfil') ? 'text-[#0F1E3D]' : 'text-slate-400'}`}
      >
        <User size={20} />
        <span className="text-[10px] font-medium">Perfil</span>
      </Link>
    </div>
  );
};