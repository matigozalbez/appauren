    import { Menu, Bell } from "lucide-react";
    import { useEffect, useState } from "react";

    interface HeaderProps {
      onOpenMenu: () => void;
      onOpenNotifications?: () => void;
      unreadCount?: number;
    }

    export default function Header({ onOpenMenu, onOpenNotifications, unreadCount = 0 }: HeaderProps) {
      const [scrolled, setScrolled] = useState(false);

      useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
      }, []);

      return (
        <header
          className={`sticky top-0 left-0 w-full bg-[#FDFBF7] px-4 flex items-center justify-between z-50 transition-all duration-300 ${
            scrolled ? "py-2 shadow-md shadow-[#0F1E3D]/5 border-b border-[#C9974A]/20" : "py-3 shadow-sm"
          }`}
        >
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
            <div className={`flex items-center justify-center transition-all duration-300 ${scrolled ? "h-7" : "h-8"}`}>
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
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm badge-pop">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </header>
      );
    }