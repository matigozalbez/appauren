import { useState, useEffect } from "react";
import {
  ChevronRight,
  Tag,
  Gift,
  Percent,
  MessageCircle,
  QrCode,
  Globe,
  Stethoscope,
  Users,
  CalendarArrowDown,
  Home as HomeIcon,
  Layers,
  CalendarDays,
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { GestorNotificaciones } from "../components/GestorNotificaciones";
import NotificationsModal, {
  contarNoLeidas,
} from "../components/Modalnotis";

const API_URL = import.meta.env.VITE_API_URL_LINK;

interface PlanSocio {
  nombre: string;
  
  estado: string;
}

interface HomeProps {
  openMenu: () => void;
}

function ListaPlanes({
  planes,
  loading,
}: {
  planes: PlanSocio[];
  loading: boolean;
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-xl bg-[#0F1E3D]/5"
          />
        ))}
      </div>
    );
  }

  if (!planes.length) {
    return (
      <p className="text-sm font-light text-[#5C5248]">
        Todavía no tenés planes cargados.
      </p>
    );
  }

  return (
    <div className="divide-y divide-[#0F1E3D]/8">
      {planes.map((plan) => (
        <button
          key={plan.nombre}
          type="button"
          onClick={() =>
            navigate(`/planes/${encodeURIComponent(plan.nombre)}`, {
              replace: true,
            })
          }
          className="flex w-full items-center gap-3 py-3.5 text-left transition active:opacity-70"
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br from-[#DDB268] to-[#B38033]" />
          <div className="flex-1 leading-tight">
            <p className="font-serif text-base font-semibold text-[#0F1E3D]">
              {plan.nombre}
            </p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[#A87B32]">
              {plan.estado || "Activo"}
            </p>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </button>
      ))}
    </div>
  );
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
  console.log(currentSlide)
  const [tabActivo, setTabActivo] = useState("inicio");

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
      className={`min-h-screen bg-[#FBF6EC] text-slate-800 pb-16 ${animationClass}`}
    >
      <Header
        onOpenMenu={openMenu}
        onOpenNotifications={() => setNotisOpen(true)}
        unreadCount={unreadCount}
      />

      {/* ───────────────── BANNER: IDENTIDAD ───────────────── */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFBF3] via-[#FDF5E4] to-[#F8ECD3] px-5 pb-12 pt-7">
        {/* franja dorada superior */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B38033] via-[#DDB268] to-[#B38033]" />

        <div className="relative z-10">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A87B32]">
            Mi Auren
          </span>

          <h1 className="mt-1.5 font-serif text-2xl font-semibold tracking-tight text-[#0F1E3D]">
            Buen día, {nombresocio || "Hernán"}
          </h1>
        </div>
      </section>

      {/* ───────────────── ACCIONES + TABS ───────────────── */}

      <section className="px-5">
        {/* Dos botones de acción */}
        <div className="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#C9974A]/60 bg-white px-4 py-2.5 text-xs font-semibold text-[#0F1E3D] transition hover:bg-[#C9974A]/10 active:scale-[0.98]"
          >
            <Users size={15} className="text-[#C9974A]" />
            Adherentes
          </button>

          <button
            onClick={() => navigate("/turnos", { replace: true })}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0F1E3D] px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-[#152953] active:scale-[0.98]"
          >
            <CalendarArrowDown size={15} className="text-[#C9974A]" />
            Solicitar turno
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex items-center gap-6 overflow-x-auto border-b border-[#0F1E3D]/10 scrollbar-hide">
          {[
            { label: "Inicio", icon: HomeIcon, key: "inicio" },
            { label: "Citas", icon: CalendarDays, key: "citas" },
            { label: "Servicios", icon: Stethoscope, key: "servicios" },
            { label: "Tren", icon: Layers, key: "planes" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTabActivo(tab.key)}
              className={`relative min-w-[64px] pb-2.5 pt-1 text-xs font-semibold transition ${
                tabActivo === tab.key ? "text-[#0F1E3D]" : "text-slate-400"
              }`}
            >
              <span className="flex items-center gap-1 justify-center">
                <tab.icon size={14} />
                {tab.label}
              </span>
              {tabActivo === tab.key && (
                <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-gradient-to-r from-[#DDB268] to-[#C9974A]" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ───────────────── CONTENIDO POR TAB ───────────────── */}

      {tabActivo === "inicio" && (
        <section className="mt-5 px-5">
          <div className="mb-4">
            <p className="text-sm font-light leading-relaxed text-slate-600">
              Gestioná tu cobertura, pedí turnos, consultá tu cartilla y accedé a
              descuentos y beneficios de <span className="font-medium text-[#0F1E3D]">Auren</span> desde un solo lugar.
            </p>
          </div>

          {/* Lista info tipo contacto, bajo líneas divisorias */}
          <div className="divide-y divide-[#0F1E3D]/8">
            <button
              onClick={() => navigate("/credencial", { replace: true })}
              className="flex w-full items-center gap-3 py-3.5 text-left transition active:opacity-70"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                <QrCode size={17} className="text-[#C9974A]" />
              </span>
              <span className="flex-1">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Código de socio</span>
                <span className="block text-sm font-semibold text-[#0F1E3D]">Credencial digital</span>
              </span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button
              onClick={() => navigate("/cartilla", { replace: true })}
              className="flex w-full items-center gap-3 py-3.5 text-left transition active:opacity-70"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                <Stethoscope size={17} className="text-[#C9974A]" />
              </span>
              <span className="flex-1">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Cartilla</span>
                <span className="block text-sm font-semibold text-[#0F1E3D]">Especialistas adheridos</span>
              </span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button
              onClick={() => navigate("/medicamentos", { replace: true })}
              className="flex w-full items-center gap-3 py-3.5 text-left transition active:opacity-70"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                <Globe size={17} className="text-[#C9974A]" />
              </span>
              <span className="flex-1">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Farmacias</span>
                <span className="block text-sm font-semibold text-[#0F1E3D]">Descuentos en medicamentos</span>
              </span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <a
              href="https://wa.me/549342XXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 py-3.5 text-left transition active:opacity-70"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                <MessageCircle size={17} className="text-[#C9974A]" />
              </span>
              <span className="flex-1">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Contactá al</span>
                <span className="block text-sm font-semibold text-[#0F1E3D]">Soporte de Auren</span>
              </span>
              <span className="rounded-full bg-[#C9974A]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#A87B32]">Mensaje</span>
            </a>
          </div>
        </section>
      )}

      {tabActivo === "citas" && (
        <section className="mt-5 px-5">
          <div className="mb-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#A87B32]">
              Mis citas
            </p>
            <h2 className="mt-1 text-lg font-bold text-[#0F1E3D]">
              Turnos y agenda
            </h2>
          </div>

          <div className="divide-y divide-[#0F1E3D]/8">
            <button
              onClick={() => navigate("/citas", { replace: true })}
              className="flex w-full items-center gap-3 py-3.5 text-left transition active:opacity-70"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                <CalendarDays size={18} className="text-[#C9974A]" />
              </span>
              <span className="flex-1">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Agenda</span>
                <span className="block text-sm font-semibold text-[#0F1E3D]">Ver mis citas</span>
              </span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </section>
      )}

      {tabActivo === "servicios" && (
        <section className="mt-6">
          <div className="mb-3 px-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#A87B32]">
              Accesos rápidos
            </p>
            <h2 className="mt-1 text-lg font-bold text-[#0F1E3D]">
              ¿Qué necesitás?
            </h2>
          </div>

          <div className="divide-y divide-[#0F1E3D]/8 px-5">
            <button
              onClick={() => navigate("/cartilla", { replace: true })}
              className="flex w-full items-center gap-3 py-3.5 text-left transition active:opacity-70"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                <Stethoscope size={18} className="text-[#C9974A]" />
              </span>
              <span className="flex-1">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Médica</span>
                <span className="block text-sm font-semibold text-[#0F1E3D]">Cartilla</span>
              </span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button
              onClick={() => navigate("/turnos", { replace: true })}
              className="flex w-full items-center gap-3 py-3.5 text-left transition active:opacity-70"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                <CalendarArrowDown size={18} className="text-[#C9974A]" />
              </span>
              <span className="flex-1">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Agenda</span>
                <span className="block text-sm font-semibold text-[#0F1E3D]">Turnos</span>
              </span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </section>
      )}

      {tabActivo === "planes" && (
        <section className="mt-6 px-5">
          <div className="mb-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#A87B32]">
              Tus planes
            </p>
          </div>
          <ListaPlanes planes={planes} loading={planesLoading} />
        </section>
      )}

      {/* ───────────────── FOOTER ───────────────── */}

<footer className="mt-12 border-t border-[#0F1E3D]/8 px-5 pb-6 pt-6">
        <div className="flex items-center justify-center text-center">
          <a
            href="https://www.aurenservicios.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-lg font-medium text-[#0F1E3D] transition hover:text-[#C9974A]"
          >
            www.aurenservicios.com.ar
          </a>
        </div>
      </footer>

      <GestorNotificaciones />

      <NotificationsModal
        isOpen={notisOpen}
        onClose={() => setNotisOpen(false)}
        onReadStateChange={setUnreadCount}
      />
    </div>
  );
}