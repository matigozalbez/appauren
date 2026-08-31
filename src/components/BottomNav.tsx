import { Link, useLocation } from "react-router-dom";
import { Shield, IdCard, Home as HomeIcon, User } from "lucide-react";

// Mapeamos los índices numéricos para saber qué está a la izquierda y qué a la derecha
const routeIndices: { [key: string]: number } = {
  "/home": 1,
  "/citas": 2,
  "/credencial": 3,
  "/medicamentos": 3.5, // 👈 Sigue manteniendo su lugar exacto para que las direcciones de animación funcionen joya
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
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-slate-200 bg-gradient-to-b from-[#FDFBF7] via-[#FBF6EC] to-[#F5EAD2] py-2.5 z-50 shadow-lg">
      <Link 
        to="/home"
        replace 
        className={`flex flex-col items-center gap-1 ${isActive('/home') ? 'text-[#0F1E3D]' : 'text-slate-400'}`}
        style={{ touchAction: "manipulation" }}

      >
        <HomeIcon size={20} />
        <span className="text-[10px] font-bold">Inicio</span>
      </Link>

<Link 
  to="/citas"
  replace
  onClick={() => handleNavClick("/citas")}
  className={`flex flex-col items-center gap-1 ${isActive('/coberturas') ? 'text-[#0F1E3D]' : 'text-slate-400'}`}
>
  <Shield size={20} />
  <span className="text-[10px] font-medium">Citas</span>
</Link>

      {/* 👻 Botón fantasma/invisible de Medicamentos para que el router y las animaciones lo amen */}


      <Link 
        to="/credencial" 
        replace
        onClick={() => handleNavClick("/credencial")}
        className={`flex flex-col items-center gap-1 ${isActive('/credencial') ? 'text-[#0F1E3D]' : 'text-slate-400'}`}
        style={{ touchAction: "manipulation" }}
      >
        <IdCard size={20} />
        <span className="text-[10px] font-medium">Credencial</span>
      </Link>
      
      <Link 
        to="/perfil" 
        replace
        onClick={() => handleNavClick("/perfil")}
        className={`flex flex-col items-center gap-1 ${isActive('/perfil') ? 'text-[#0F1E3D]' : 'text-slate-400'}`}
        style={{ touchAction: "manipulation" }}
      >
        <User size={20} />
        <span className="text-[10px] font-medium">Perfil</span>
      </Link>
    </div>
  );
};