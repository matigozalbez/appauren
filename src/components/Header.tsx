
import { Menu, Bell } from "lucide-react";

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export default function Header({ onOpenMenu, onOpenNotifications }: HeaderProps) {
  return (
    <header className="w-full bg-[#FDFBF7] px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Botón de menú hamburguesa (Azul corporativo) */}
      <button
        onClick={onOpenMenu}
        className="p-2 rounded-xl  text-[#0F1E3D] hover:bg-[#0F1E3D]/5 transition active:scale-95"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      {/* Logo en el centro (Espacio para tu imagen dorada) */}
      <div className="flex items-center justify-center">
        {/* Reemplazá este div o la img por tu logo dorado real */}
        <div className="h-8 flex items-center justify-center">
          <div className="h-8 flex items-center justify-center">
  <img src="auren-isotipo.png" alt="Auren Logo" className="h-7 w-auto object-contain" />
</div>
          {/* <img src="/tu-logo-dorado.png" alt="Logo" className="h-7 object-contain" /> */}
        </div>
      </div>

      {/* Botón de notificaciones con la campana azul */}
      <button
        onClick={onOpenNotifications}
        className="p-2 rounded-xl text-[#0F1E3D] hover:bg-[#0F1E3D]/5 transition active:scale-95 relative"
        aria-label="Notificaciones"
      >
        <Bell size={22} />
        {/* Opcional: puntito rojo indicador de notificación */}
        {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" /> */}
      </button>
    </header>
  );
}