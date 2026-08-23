    import { Menu, Bell } from "lucide-react";

    interface HeaderProps {
      onOpenMenu: () => void;
      onOpenNotifications?: () => void;
      unreadCount?: number;
    }

    export default function Header({ onOpenMenu, onOpenNotifications, unreadCount = 0 }: HeaderProps) {
      return (
        <header className="fixed top-0 left-0 w-full bg-[#FDFBF7] px-4 py-3 flex items-center justify-between shadow-sm z-50">
          {/* Botón de menú hamburguesa */}
          <button
            onClick={onOpenMenu}
            className="p-2 rounded-xl text-[#0F1E3D] hover:bg-[#0F1E3D]/5 transition active:scale-95"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>

          {/* Logo en el centro */}
          <div className="flex items-center justify-center">
            <div className="h-8 flex items-center justify-center">
              <img src="auren-isotipo.png" alt="Auren Logo" className="h-7 w-auto object-contain" />
            </div>
          </div>

          {/* Botón de notificaciones con la campana */}
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-xl text-[#0F1E3D] hover:bg-[#0F1E3D]/5 transition active:scale-95 relative"
            aria-label="Notificaciones"
          >
            <Bell size={22} />
            
            {/* Insignia con el número de no leídas */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </header>
      );
    }