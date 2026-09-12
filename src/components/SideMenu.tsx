import {
  X,
  Home,
  IdCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  FileText,
  User as UserIcon,
  CalendarDays,
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

  // Obtenemos el nombre de Firebase (o un fallback por defecto)
  const displayName = socio;

  const go = (path: string) => {
    onClose();
    navigate(path, { replace: true });
  };

   useEffect(() => {
    if (!isOpen) return;
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
    { icon: <UserIcon size={19} />, label: "Perfil", onClick: () => go("/perfil") },
    { icon: <CalendarDays size={19} />, label: "Citas", onClick: () => go("/citas") },
    { icon: <IdCard size={19} />, label: "Credencial", onClick: () => go("/credencial") },
    {
      icon: <Bell size={19} />,
      label: "Notificaciones",
      onClick: () => {
        onClose();
        localStorage.setItem("auren_abrir_notis", "1");
        navigate("/home", { replace: true });
      },
    },
    { icon: <FileText size={19} />, label: "Legales", onClick: () => go("/legales") },
  ];

  return (
    <div
      className={`fixed inset-0 z-[70] flex flex-col overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FBF6EC] to-[#F5EAD2] transition-transform duration-[520ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* franja dorada superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B38033] via-[#DDB268] to-[#B38033]" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-10 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#C9974A] bg-white text-[#C9974A] shadow-inner">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <UserIcon size={22} />
            )}
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-[#A87B32]">
              Mi Cuenta
            </span>
            <h2 className="truncate text-base font-bold tracking-wide text-[#0F1E3D]">
              {displayName}
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0F1E3D] shadow-sm ring-1 ring-[#0F1E3D]/5 transition active:scale-95"
          aria-label="Cerrar menú"
        >
          <X size={20} />
        </button>
      </div>

      {/* Items del menú */}
      <div className="flex-1 overflow-y-auto px-6 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className="flex w-full items-center justify-between border-b border-[#0F1E3D]/8 py-4 text-left transition active:opacity-70"
          >
            <div className="flex items-center gap-3.5">
              <span className="text-[#C9974A]">{item.icon}</span>
              <span className="text-sm font-semibold text-[#0F1E3D]">{item.label}</span>
            </div>
            <ChevronRight
              size={15}
              className="text-[#0F1E3D]/20"
            />
          </button>
        ))}
      </div>

      {/* Sección inferior */}
      <div className="px-6 pb-8 pt-3">
        <div className="mb-2 h-px bg-[#0F1E3D]/8" />

        {/* Ayuda */}
        <button
          onClick={() => {
            onClose();
            window.open("https://wa.me/549342XXXXXXX", "_blank", "noopener,noreferrer");
          }}
          className="flex w-full items-center justify-between border-b border-[#0F1E3D]/8 py-4 text-left transition active:opacity-70"
        >
          <div className="flex items-center gap-3.5">
            <span className="text-[#C9974A]">
              <HelpCircle size={19} />
            </span>
            <span className="text-sm font-semibold text-[#0F1E3D]">Ayuda</span>
          </div>
          <ChevronRight size={15} className="text-[#0F1E3D]/20" />
        </button>

        {/* Cerrar sesión */}
        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="flex w-full items-center gap-3.5 py-4 text-left transition active:opacity-70"
        >
          <span className="text-red-500">
            <LogOut size={19} />
          </span>
          <span className="text-sm font-semibold text-red-500">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}