import {
  X,
  Home,
  Shield,
  IdCard,
  Tag,
  Search,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  FileText,
  User as UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export default function SideMenu({ isOpen, onClose, onLogout }: Props) {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [socio, setNombreSocio] = useState("")

  // Obtenemos el nombre y apellido de Firebase (o un fallback por defecto)
  const displayName = socio;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

   useEffect(() => {
    const nombreGuardado = localStorage.getItem("nombre_socio");
    if (nombreGuardado) {
      try {
        // Intentamos parsear por si quedó como JSON, si falla lo usamos como texto plano
        const parsed = JSON.parse(nombreGuardado);
        setNombreSocio(typeof parsed === "string" ? parsed : nombreGuardado);
      } catch {
        setNombreSocio(nombreGuardado);
      }
    }
  }, [isOpen]);

  const items: MenuItem[] = [
    { icon: <Home size={19} />, label: "Inicio", onClick: () => go("/home") },
    { icon: <Shield size={19} />, label: "Coberturas", onClick: () => go("/coberturas") },
    { icon: <IdCard size={19} />, label: "Credencial", onClick: () => go("/credencial") },
    { icon: <Tag size={19} />, label: "Promociones", onClick: () => go("/promociones") },
    { icon: <Search size={19} />, label: "Buscar Medicamentos", onClick: () => go("/medicamentos") },
    { icon: <Bell size={19} />, label: "Notificaciones", onClick: () => {} },
    { icon: <FileText size={19} />, label: "Legales", onClick: () => go("/legales") },
  ];

  return (
    <div
      className={`fixed  inset-0 z-[70] transition-opacity duration-300  ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className={`absolute top-0 left-0 h-full w-[85%] max-w-sm
          bg-[#FDFBF7] shadow-2xl transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden`}
      >
        {/* Header Superior con Perfil (Estilo la referencia pero con colores Auren) */}
        <div className="relative bg-gradient-to-br from-[#0F1E3D] via-[#152953] to-[#0A1429] px-6 pt-10 pb-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition"
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white /20 border-2 border-[#C9974A] flex items-center justify-center text-[#C9974A] shadow-inner overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={28} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[#C9974A] text-[10px] font-bold uppercase tracking-widest block">
                Mi Cuenta
              </span>
              <h2 className="text-base font-bold truncate tracking-wide text-white">
                {displayName}
              </h2>
            </div>
          </div>
        </div>

        {/* Línea dorada fina */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#C9974A]/50 to-transparent mx-6 my-4" />

        {/* Items del Menú */}
        <div className="flex-1 px-4 space-y-1.5">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl
                text-[#0F1E3D] bg-slate-50 hover:bg-[#C9974A]/10 active:scale-[0.98] transition group"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-[#C9974A]">{item.icon}</span>
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              <ChevronRight
                size={15}
                className="text-[#0F1E3D]/20 group-hover:text-[#C9974A] transition"
              />
            </button>
          ))}
        </div>

        {/* Sección Inferior: Ayuda y Cerrar Sesión */}
        <div className="px-4 pb-8 pt-4 space-y-2">
          <div className="h-px bg-slate-100 mb-2" />

          {/* Ayuda reubicada abajo */}
          <button
            onClick={() => {
              onClose();
              // poné tu lógica de ayuda acá si la hay
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl
              text-[#0F1E3D] bg-slate-50 hover:bg-[#C9974A]/10 transition group"
          >
            <div className="flex items-center gap-3.5">
              <span className="text-[#C9974A]">
                <HelpCircle size={19} />
              </span>
              <span className="text-sm font-semibold">Ayuda</span>
            </div>
            <ChevronRight
              size={15}
              className="text-[#0F1E3D]/20 group-hover:text-[#C9974A] transition"
            />
          </button>

          {/* Cerrar sesión */}
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl
              text-red-500 bg-red-50 hover:bg-red-100 transition"
          >
            <LogOut size={19} />
            <span className="text-sm font-semibold">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}