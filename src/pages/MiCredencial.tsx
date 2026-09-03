import { useState, useEffect } from "react";
import { ArrowLeft, Share2, Shield, Calendar, MessageCircle, Phone, Globe, ShieldCheck, IdCard, Users } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

interface Adherente {
  nombre?: string;
  apellido?: string;
  dni?: string;
  edad?: string;
  relacion?: string;
}

interface PlanSocio {
  nombre: string;
  estado: string;
}

interface Socio {
  nombre?: string;
  apellido?: string;
  dni?: string;
  estado?: string;
  fechaActivacion?: string;
  planes?: PlanSocio[];
  adherentes?: Adherente[];
}

const API_URL = import.meta.env.VITE_API_URL_LINK;

export default function MiCredencial() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  
  // Inicializamos caché y estado de carga inicial
  const [socio, setSocio] = useState<Socio>(() => {
    const cached = localStorage.getItem("auren_socio");
    return cached ? JSON.parse(cached) : {};
  });
  
  const [cargando, setCargando] = useState(() => !localStorage.getItem("auren_socio"));
  const [currentIndex, setCurrentIndex] = useState(0);

  const direction = sessionStorage.getItem("nav_direction") || "right";
  const animationClass = direction === "right" ? "animate-slide-right" : "animate-slide-left";

  useEffect(() => {
    const fetchSocio = async () => {
      if (!user) return;
      try {
        const idToken = await user.getIdToken();
        const res = await fetch(`${API_URL}/api/mi-socio`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSocio(data);
          localStorage.setItem("auren_socio", JSON.stringify(data));
        }
      } catch {
        // silencioso
      } finally {
        setCargando(false);
      }
    };
    fetchSocio();
  }, [user]);

  const adherentesList = socio.adherentes || [];
  const totalCredenciales = 1 + adherentesList.length;

  const personaActiva = currentIndex === 0 ? {
    nombre: socio.nombre && socio.apellido ? `${socio.nombre} ${socio.apellido}` : user?.displayName || "—",
    dni: socio.dni || "—",
    estado: (socio.estado || "activo").toUpperCase(),
    fechaActivacion: socio.fechaActivacion || "13/08",
    planes: socio.planes && socio.planes.length > 0 ? socio.planes : [],
    tipoTexto: "Cuidamos cada momento",
  } : {
    nombre: `${adherentesList[currentIndex - 1]?.nombre || ""} ${adherentesList[currentIndex - 1]?.apellido || ""}`.trim() || "—",
    dni: adherentesList[currentIndex - 1]?.dni || "—",
    estado: (socio.estado || "activo").toUpperCase(),
    fechaActivacion: socio.fechaActivacion || "13/08",
    planes: socio.planes && socio.planes.length > 0 ? socio.planes : [],
    tipoTexto: `Adherente (${adherentesList[currentIndex - 1]?.relacion || "Familiar"})`,
  };

  return (
    <div className={`min-h-screen-safe bg-[#FBF6EC] pb-10 ${animationClass}`}>
        {/* Header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFBF3] via-[#FDF5E4] to-[#F8ECD3] px-5 pb-9 pt-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B38033] via-[#DDB268] to-[#B38033]" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#C9974A]/10 blur-2xl" />

          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/home", { replace: true })}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#0F1E3D] shadow-sm ring-1 ring-[#0F1E3D]/5 backdrop-blur transition active:scale-95"
                style={{ touchAction: "manipulation" }}
              >
                <ArrowLeft size={17} />
              </button>
              <span className="font-serif text-2xl font-semibold tracking-tight text-[#0F1E3D]">
                Mi Credencial
              </span>
            </div>
            <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#0F1E3D] shadow-sm ring-1 ring-[#0F1E3D]/5 backdrop-blur transition active:scale-95">
              <Share2 size={17} />
            </button>
          </div>
        </section>

        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <ShieldCheck size={14} className="text-[#C9974A]" />
          Tu credencial es personal e intransferible.
        </p>

        {/* Selector de Credenciales */}
        {totalCredenciales > 1 && (
          <div className="px-5 mt-4">
            <div className="flex items-center justify-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl max-w-sm mx-auto">
              <div className="flex items-center gap-1 px-2 text-[10px] font-bold text-slate-500">
                <Users size={12} />
                <span>Credenciales ({totalCredenciales}):</span>
              </div>
              {Array.from({ length: totalCredenciales }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition shadow-sm ${
                    currentIndex === idx
                      ? "bg-[#0F1E3D] text-white shadow"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {idx === 0 ? "Titular" : `Adh. ${idx}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Card frente */}
        <div className="px-5 pt-4">
          <div className="relative mx-auto aspect-[1.53/1] w-full max-w-sm overflow-hidden rounded-[16px] bg-[#061e3f] shadow-xl">

            <div className="pointer-events-none absolute -inset-x-20 top-0 h-full opacity-40 overflow-hidden">
              <div className="absolute transform -rotate-12 -top-10 left-1/4 w-72 h-40 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-2xl" />
            </div>

            <div className="pointer-events-none absolute right-1 top-[32%] w-28 opacity-[0.22]">
              <img src="/aurenblancocard.png" className="w-full" alt="" />
            </div>

            <svg className="pointer-events-none absolute bottom-0 right-0 z-10 h-[55%] w-[50%]" viewBox="0 0 150 120" fill="none">
              <defs>
                <linearGradient id="goldFade1" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#C9974A" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#C9974A" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="goldFade2" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#C9974A" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#C9974A" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M150 120 Q90 100 50 60" stroke="url(#goldFade1)" strokeWidth="1.4" fill="none" />
              <path d="M150 105 Q95 90 60 50" stroke="url(#goldFade2)" strokeWidth="1" fill="none" />
              <path d="M150 90 Q100 80 70 42" stroke="url(#goldFade2)" strokeWidth="0.7" fill="none" />
            </svg>

            <div className="relative z-20 flex h-full flex-col justify-between px-5 pt-3.5 pb-[13%]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 flex items-center mt-1">
                      <img src="/aureblanco.png" className="h-full w-auto object-contain" alt="Auren" />
                    </div>
                  </div>
                  <p className="ml-1 text-[9px] text-[#C9974A] tracking-wide">
                    {personaActiva.tipoTexto}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#C9974A]">Credencial</p>
                  <p className="text-[8px] font-semibold uppercase tracking-[2px] text-white">Digital</p>
                </div>
              </div>

              <div className="w-full h-[1px] min-h-[1px] shrink-0 bg-gradient-to-r from-[#C9974A]/80 via-[#C9974A]/30 to-transparent mt-2" />

              {/* Contenido dinámico con soporte de Skeleton Borroso */}
              {cargando && !socio.dni ? (
                <div className="space-y-2 mt-0.5 blur-[2px] animate-pulse" aria-hidden="true">
                  <div className="h-5 w-3/4 rounded bg-white/20" />
                  <div className="h-2 w-7 bg-[#C9974A]/50" />
                </div>
              ) : (
                <div className="mt-0.5">
                  <p className="text-lg font-bold leading-tight text-white">{personaActiva.nombre}</p>
                  <div className="mt-0.5 h-[2px] w-7 bg-[#C9974A]" />
                </div>
              )}

              <div className="grid grid-cols-2 mt-1 gap-x-4">
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-[8px] leading-none text-[#C9974A]">DNI</p>
                    {cargando && !socio.dni ? (
                      <div className="mt-1 h-3 w-20 rounded bg-white/20 animate-pulse blur-[2px]" />
                    ) : (
                      <p className="mt-0.5 text-xs font-semibold text-white">{personaActiva.dni}</p>
                    )}
                  </div>

                  <div className="mt-1">
                    <p className="text-[8px] text-[#C9974A]">Fecha de activación</p>
                    <div className="mt-0.5 flex items-center gap-1">
                      <Calendar size={11} strokeWidth={1.8} className="text-[#C9974A]" />
                      <p className="text-[10px] font-semibold text-white">{personaActiva.fechaActivacion}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-[8px] leading-none text-[#C9974A]">Estado</p>
                    <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-[#18a957] px-2 py-0.5 text-[8px] font-bold text-white shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      {personaActiva.estado}
                    </span>
                  </div>

                  <div className="mt-1">
                    <p className="text-[8px] text-[#C9974A]">Planes contratados</p>
                    <div className="mt-0.5 space-y-0.5">
                      {cargando && !socio.planes ? (
                        <div className="h-3 w-20 rounded bg-white/20 animate-pulse blur-[2px]" />
                      ) : personaActiva.planes.length > 3 ? (
                        <div className="flex items-center gap-1">
                          <span className="flex h-[11px] w-[11px] shrink-0 items-center justify-center rounded-full bg-[#C9974A] text-[7px] text-[#061e3f]">★</span>
                          <span className="text-[9px] font-bold text-[#C9974A] tracking-wide">AUREN BLACK · Todo incluido</span>
                        </div>
                      ) : (
                        personaActiva.planes.map((plan) => (
                          <div key={plan.nombre} className="flex items-center gap-1">
                            <span className="flex h-[11px] w-[11px] shrink-0 items-center justify-center rounded-full border border-[#C9974A] text-[7px] text-[#C9974A]">✓</span>
                            <span className="text-[9px] font-medium text-white truncate max-w-[90px]">{plan.nombre}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-30 flex h-[13%] items-center justify-between bg-[#C9974A] px-4">
              <div className="flex items-center gap-1.5">
                <Shield size={12} className="text-[#061e3f]" />
                <span className="text-[9px] font-medium text-[#061e3f]">Emitida por Auren Servicios</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={12} fill="currentColor" className="text-[#061e3f]" />
                <span className="text-[9px] font-bold uppercase text-[#061e3f]">Verificada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reverso */}
        <div className="px-5 pt-4">
          <div className="relative mx-auto aspect-[1.53/1] w-full max-w-sm overflow-hidden rounded-[16px] bg-[#061e3f] shadow-xl">
            <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-[#C9974A] px-2.5 py-0.5">
              <span className="text-[8px] font-bold uppercase tracking-wide text-[#061e3f]">Reverso</span>
            </div>

            <div className="relative z-10 flex h-full flex-col justify-center px-5 pb-[13%] pt-8">
              <div className="relative grid grid-cols-2 gap-5">
                <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-white/15" />

                <div>
                  <p className="mb-2 h-[20px] overflow-hidden text-[9px] font-bold uppercase leading-tight tracking-wide text-[#C9974A]">
                    ¿Cómo usar tu credencial?
                  </p>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-1.5">
                      <IdCard size={13} strokeWidth={1.6} className="mt-0.5 shrink-0 text-[#C9974A]" />
                      <p className="text-[9px] leading-tight text-white/90">
                        Presentala para identificarte cuando solicites un servicio.
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Phone size={13} strokeWidth={1.6} className="mt-0.5 shrink-0 text-[#C9974A]" />
                      <p className="text-[9px] leading-tight text-white/90">
                        Comunicate con nuestras líneas de atención.
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Shield size={13} strokeWidth={1.6} className="mt-0.5 shrink-0 text-[#C9974A]" />
                      <p className="text-[9px] leading-tight text-white/90">
                        Tu información está protegida y es de uso exclusivo.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pl-2">
                  <p className="mb-2 h-[20px] overflow-hidden text-[9px] font-bold uppercase leading-tight tracking-wide text-[#C9974A]">
                    Centros y líneas de atención
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MessageCircle size={13} className="text-emerald-400" />
                        <div>
                          <p className="text-[9px] font-semibold text-white">WhatsApp</p>
                          <p className="text-[8px] text-white/70">342 405 4346</p>
                        </div>
                      </div>
                      <span className="text-white/40">›</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-sky-400" />
                        <div>
                          <p className="text-[9px] font-semibold text-white">Línea de atención</p>
                          <p className="text-[8px] text-white/70">0800 555 2873</p>
                        </div>
                      </div>
                      <span className="text-white/40">›</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Globe size={13} className="text-sky-400" />
                        <div>
                          <p className="text-[9px] font-semibold text-white">Sitio web</p>
                          <p className="text-[8px] text-white/70">www.auren.com.ar</p>
                        </div>
                      </div>
                      <span className="text-white/40">›</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 flex h-[13%] items-center justify-center gap-2 bg-[#C9974A] px-4">
              <span className="text-[9px] font-bold text-[#061e3f]">Auren. Cuidamos cada momento.</span>
              <Shield size={12} className="text-[#061e3f]" />
            </div>
          </div>
        </div>

    </div>
  );
}