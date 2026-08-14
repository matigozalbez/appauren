
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";


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

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const items: MenuItem[] = [
    { icon: <Home size={19} />, label: "Inicio", onClick: () => go("/home") },
    { icon: <Shield size={19} />, label: "Coberturas", onClick: () => go("/coberturas") },
    { icon: <IdCard size={19} />, label: "Credencial", onClick: () => go("/credencial") },
    { icon: <Tag size={19} />, label: "Promociones", onClick: () => go("/promociones") },
{ icon: <Search size={19} />, label: "Buscar Medicamentos", onClick: () => go("/medicamentos") },
    { icon: <Bell size={19} />, label: "Notificaciones", onClick: () => {} },
    { icon: <HelpCircle size={19} />, label: "Ayuda", onClick: () => {} },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <div
          className={`absolute top-0 left-0 h-full w-[85%] max-w-sm
            bg-white shadow-2xl transition-transform duration-300 ease-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden`}
        >
          {/* Header del menú */}
          <div className="flex items-center justify-between px-6 pt-8 pb-6">
            <span className="text-[#C9974A] text-xs font-bold uppercase tracking-widest">
              Menú
            </span>
            <button
              onClick={onClose}
              className="text-[#0F1E3D]/50 hover:text-[#0F1E3D] transition"
              aria-label="Cerrar menú"
            >
              <X size={22} />
            </button>
          </div>

          {/* Línea dorada fina */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9974A]/50 to-transparent mx-6 mb-4" />

          {/* Items */}
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

          {/* Salir, separado abajo */}
          <div className="px-4 pb-8 pt-4">
            <div className="h-px bg-slate-100 mb-4" />
            <button
              onClick={() => { onClose(); onLogout(); }}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl
                text-red-500 bg-red-50 hover:bg-red-100 transition"
            >
              <LogOut size={19} />
              <span className="text-sm font-semibold">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>


    </>

  );
}