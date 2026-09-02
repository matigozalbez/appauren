import { useState, useEffect } from "react";
import {
  ChevronRight,
  Tag,
  Gift,
  Percent,
  User,
  MessageCircle,
  Phone,
  IdCard,
  HeartPulse,
  CalendarClock,
  Pill,
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { GestorNotificaciones } from "../components/GestorNotificaciones";
import NotificationsModal, {
  contarNoLeidas,
} from "../components/Modalnotis";
import PlanesCarousel from "../components/PlanesCarousel";

const API_URL = import.meta.env.VITE_API_URL_LINK;

interface PlanSocio {
  nombre: string;
  
  estado: string;
}

interface HomeProps {
  openMenu: () => void;
}

export default function Home({ openMenu }: HomeProps) {
 const [user] = useAuthState(auth);
  
 const [nombresocio,SetnombreSocio] = useState("")

  const [notisOpen, setNotisOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const [planes, setPlanes] = useState<PlanSocio[]>(() => {
    const cached = localStorage.getItem("auren_planes");
    return cached ? JSON.parse(cached) : [];
  });

  const [planesLoading, setPlanesLoading] = useState(() => {
    const cached = localStorage.getItem("auren_planes");
    return !cached;
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  const navigate = useNavigate();

  const slides = [
    {
      badge: "BENEFICIO EXCLUSIVO",
      title: "Conocé tus coberturas y ahorros vigentes",
      description: "Accedé a tus descuentos y cartilla médica al instante.",
      icon: Tag,
      bgImage:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    },
    {
      badge: "PROMOCIÓN DEL MES",
      title: "Descuentos en farmacias adheridas",
      description:
        "Presentá tu credencial digital y ahorrá en tus medicamentos.",
      icon: Gift,
      bgImage:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop",
    },
    {
      badge: "NOVEDADES AUREN",
      title: "Nueva cartilla de especialistas",
      description: "Sumamos nuevos profesionales.",
      icon: Percent,
      bgImage:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  useEffect(() => {
  const nombreGuardado = localStorage.getItem("nombre_socio");

  if (nombreGuardado) {
    SetnombreSocio(JSON.parse(nombreGuardado));
  }
}, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const direction = sessionStorage.getItem("nav_direction") || "right";

  const animationClass =
    direction === "right"
      ? "animate-slide-right"
      : "animate-slide-left";

  useEffect(() => {
    const fetchSocio = async () => {
      if (!user) return;

      const idToken = await user.getIdToken();

      try {
        const res = await fetch(`${API_URL}/api/mi-socio`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();

          setPlanes(data.planes || []);
          SetnombreSocio(data.nombre)

          localStorage.setItem(
            "auren_planes",
            JSON.stringify(data.planes || [])
          );

          localStorage.setItem("nombre_socio", JSON.stringify(data.nombre || "")
        );
        }
      } catch {
        // silencioso
      } finally {
        setPlanesLoading(false);
      }
    };

    fetchSocio();
  }, [user]);

  useEffect(() => {
    contarNoLeidas().then((count) => {
      setUnreadCount(count);
    });
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#F8F5EF] text-slate-800 pb-32 ${animationClass}`}
    >
      <Header
        onOpenMenu={openMenu}
        onOpenNotifications={() => setNotisOpen(true)}
        unreadCount={unreadCount}
      />

      {/* ───────────────── HEADER / SALUDO ───────────────── */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F1E3D] via-[#152953] to-[#0A1429] px-6 pb-16 pt-5">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#C9974A]/10 blur-3xl" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-300">
              Buenos días
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
              {nombresocio} 👋
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Todo lo que necesitás, en un solo lugar.
            </p>
          </div>

          <button
            onClick={() => navigate("/perfil", {replace: true})}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white shadow-md"
          >
            <User size={18} className="text-[#C9974A]" />
          </button>
        </div>
      </section>

      {/* ───────────────── BANNER ───────────────── */}

      <section className="-mt-9 px-6">
        <div
          className="relative h-[155px] overflow-hidden rounded-[26px] shadow-xl"
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(255,255,255,.97) 0%,
                rgba(255,255,255,.88) 52%,
                rgba(255,255,255,.35) 100%
              ),
              url("${slides[currentSlide].bgImage}")
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 flex h-full max-w-[75%] flex-col justify-center p-5">
            <span className="mb-2 w-fit rounded-full bg-[#C9974A]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#A67932]">
              {slides[currentSlide].badge}
            </span>

            <h2 className="text-base font-bold leading-snug text-[#0F1E3D]">
              {slides[currentSlide].title}
            </h2>

            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              {slides[currentSlide].description}
            </p>
          </div>

          <button
            onClick={() => {}}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-full bg-[#0F1E3D] px-3 py-1.5 text-[10px] font-bold text-white shadow-md"
          >
            Ver más
            <ChevronRight size={12} />
          </button>
        </div>

        <div className="mt-3 flex justify-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === index
                  ? "w-5 bg-[#C9974A]"
                  : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ───────────────── COBERTURA ───────────────── */}

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between px-6">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#C9974A]">
              Tu salud
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-[#0F1E3D]">
              Tu cobertura
            </h2>
          </div>


        </div>

        <PlanesCarousel
          planes={planes}
          titulo=""
          loading={planesLoading}
        />
      </section>

      {/* ───────────────── ACCESOS ───────────────── */}

    {/* ───────────────── ACCESOS ───────────────── */}

      {/* ───────────────── ACCESOS ───────────────── */}

   {/* ───────────────── ACCESOS ───────────────── */}

      <section className="mt-8 px-6">
  <div className="mb-3">
    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#C9974A]">
      Accesos rápidos
    </p>

    <h2 className="mt-1 text-lg font-bold text-[#0F1E3D]">
      ¿Qué necesitás?
    </h2>
  </div>

  <style>{`
    @keyframes slideUpFade {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>

  <div className="grid grid-cols-2 gap-3">
    {/* Credencial */}
    <button
      onClick={() => navigate("/credencial",   { replace: true })}
      style={{ animation: "slideUpFade 0.4s ease-out 0.1s forwards", opacity: 0 }}
      className="group relative flex h-28 flex-col justify-between overflow-hidden rounded-2xl border border-[#C9974A]/30 bg-gradient-to-br from-[#FFFBF3] via-[#FDF5E4] to-[#F8ECD3] p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
    >
      <div className="absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r from-[#C9974A] via-[#DDB268] to-[#C9974A]" />
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F1E3D] transition-transform group-hover:scale-110">
        <IdCard size={18} className="text-[#C9974A]" />
      </div>
      <div className="leading-tight">
        <p className="text-[9px] font-medium text-[#A87B32]">Digital</p>
        <p className="mt-0.5 text-base font-bold text-[#2A2420]">Credencial</p>
      </div>
    </button>

    {/* Cartilla */}
    <button
      onClick={() => navigate("/cartilla",   { replace: true })}
      style={{ animation: "slideUpFade 0.4s ease-out 0.2s forwards", opacity: 0 }}
      className="group relative flex h-28 flex-col justify-between overflow-hidden rounded-2xl border border-[#C9974A]/30 bg-gradient-to-br from-[#FFFBF3] via-[#FDF5E4] to-[#F8ECD3] p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
    >
      <div className="absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r from-[#C9974A] via-[#DDB268] to-[#C9974A]" />
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F1E3D] transition-transform group-hover:scale-110">
        <HeartPulse size={18} className="text-[#C9974A]" />
      </div>
      <div className="leading-tight">
        <p className="text-[9px] font-medium text-[#A87B32]">Médica</p>
        <p className="mt-0.5 text-base font-bold text-[#2A2420]">Cartilla</p>
      </div>
    </button>

    {/* Turnos */}
    <button
      onClick={() => navigate("/turnos",   { replace: true })}
      style={{ animation: "slideUpFade 0.4s ease-out 0.3s forwards", opacity: 0 }}
      className="group relative flex h-28 flex-col justify-between overflow-hidden rounded-2xl border border-[#C9974A]/30 bg-gradient-to-br from-[#FFFBF3] via-[#FDF5E4] to-[#F8ECD3] p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
    >
      <div className="absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r from-[#C9974A] via-[#DDB268] to-[#C9974A]" />
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F1E3D] transition-transform group-hover:scale-110">
        <CalendarClock size={18} className="text-[#C9974A]" />
      </div>
      <div className="leading-tight">
        <p className="text-[9px] font-medium text-[#A87B32]">Agenda</p>
        <p className="mt-0.5 text-base font-bold text-[#2A2420]">Turnos</p>
      </div>
    </button>

    {/* Medicamentos */}
    <button
      onClick={() => navigate("/medicamentos",   { replace: true })}
      style={{ animation: "slideUpFade 0.4s ease-out 0.4s forwards", opacity: 0 }}
      className="group relative flex h-28 flex-col justify-between overflow-hidden rounded-2xl border border-[#C9974A]/30 bg-gradient-to-br from-[#FFFBF3] via-[#FDF5E4] to-[#F8ECD3] p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
    >
      <div className="absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r from-[#C9974A] via-[#DDB268] to-[#C9974A]" />
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F1E3D] transition-transform group-hover:scale-110">
        <Pill size={18} className="text-[#C9974A]" />
      </div>
      <div className="leading-tight min-w-0">
        <p className="text-[9px] font-medium text-[#A87B32]">Descuentos</p>
        <p className="mt-0.5 text-base font-bold text-[#2A2420] leading-snug">Medicamentos</p>
      </div>
    </button>
  </div>
</section>

      {/* ───────────────── AYUDA ───────────────── */}

      <section className="mt-10 px-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[#C9974A]/20" />

          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#C9974A]">
            Estamos para ayudarte
          </span>

          <div className="h-px flex-1 bg-[#C9974A]/20" />
        </div>

        <div className="mt-4 flex items-center justify-center gap-6">
          <a
            href="tel:0800XXXXXXX"
            className="flex items-center gap-2 text-xs font-semibold text-[#0F1E3D]"
          >
            <Phone size={15} className="text-[#C9974A]" />
            0800-XXX-XXXX
          </a>

          <a
            href="https://wa.me/549342XXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold text-[#0F1E3D]"
          >
            <MessageCircle size={16} className="text-[#C9974A]" />
            WhatsApp
          </a>
        </div>
      </section>

      <GestorNotificaciones />

      <NotificationsModal
        isOpen={notisOpen}
        onClose={() => setNotisOpen(false)}
        onReadStateChange={setUnreadCount}
      />
    </div>
  );
}