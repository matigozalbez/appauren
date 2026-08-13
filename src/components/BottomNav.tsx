import { Link, useLocation } from "react-router-dom";
import { Shield, IdCard, Home as HomeIcon, User } from "lucide-react";

export const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-slate-200 bg-white py-2.5 z-50 shadow-lg">
      
      {/* Botón de Inicio corregido con Link */}
      <Link to="/home" className={`flex flex-col items-center gap-1 ${isActive('/home') ? 'text-[#0F1E3D]' : 'text-slate-400'}`}>
        <HomeIcon size={20} />
        <span className="text-[10px] font-bold">Inicio</span>
      </Link>

      <button className="flex flex-col items-center gap-1 text-slate-400">
        <Shield size={20} />
        <span className="text-[10px] font-medium">Coberturas</span>
      </button>

      <Link to="/credencial" className={`flex flex-col items-center gap-1 ${isActive('/credencial') ? 'text-[#0F1E3D]' : 'text-slate-400'}`}>
        <IdCard size={20} />
        <span className="text-[10px] font-medium">Credencial</span>
      </Link>
      
      <Link to="/perfil" className={`flex flex-col items-center gap-1 ${isActive('/perfil') ? 'text-[#0F1E3D]' : 'text-slate-400'}`}>
        <User size={20} />
        <span className="text-[10px] font-medium">Perfil</span>
      </Link>
    </div>
  );
};