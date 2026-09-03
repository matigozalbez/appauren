import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  IdCard,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface SocioData {
  nombre?: string;
  apellido?: string;
  dni?: string;
  estado?: string;
  // Agregá los campos que te mande tu backend
}
const CACHE_KEY = "auren_socio";
const API_URL = import.meta.env.VITE_API_URL_LINK;

export default function Perfil() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [socio, setSocio] = useState<SocioData>(() => {
    const cached = localStorage.getItem("auren_socio");
    return cached ? JSON.parse(cached) : {};
  });

  const direction = sessionStorage.getItem("nav_direction") || "right";
  const animationClass = direction === "right" ? "animate-slide-right" : "animate-slide-left";

  useEffect(() => {
    const fetchDni = async () => {
      if (!user) return;
      const idToken = await user.getIdToken();
      try {
        const res = await fetch(`${API_URL}/api/mi-socio`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSocio(data);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        }
      } catch {
        // silencioso
      }
    };
    fetchDni();
  }, [user]);

const handleLogout = async () => {
  // 1. Borramos las keys fijas que ya tenías
  localStorage.removeItem("auren_dni");
  localStorage.removeItem("auren_planes");
  localStorage.removeItem("nombre_socio");
  localStorage.removeItem("auren_socio"); 

  // 2. Buscamos y borramos TODAS las keys dinámicas de los planes
  const keysAEliminar = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("auren_detalle_plan_")) {
      keysAEliminar.push(key);
    }
  }
  keysAEliminar.forEach((key) => localStorage.removeItem(key));

  // 3. Cerramos sesión y redirigimos
  await signOut(auth);
  navigate("/", { replace: true });
};



  return (
    <div className={`min-h-screen bg-[#FBF6EC] text-slate-800 ${animationClass}`}>

      {/* Header: banner elegante */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFBF3] via-[#FDF5E4] to-[#F8ECD3] px-5 pb-9 pt-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B38033] via-[#DDB268] to-[#B38033]" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#C9974A]/10 blur-2xl" />

        <div className="relative z-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/home", { replace: true })}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#0F1E3D] shadow-sm ring-1 ring-[#0F1E3D]/5 backdrop-blur transition active:scale-95"
            style={{ touchAction: "manipulation" }}
          >
            <ArrowLeft size={17} />
          </button>

          <div className="flex flex-1 items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A87B32]">
                Auren
              </span>
              <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-[#0F1E3D]">
                Mi perfil
              </h1>
            </div>

            <span className="rounded-full bg-[#C9974A]/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#A87B32]">
              Socio activo
            </span>
          </div>
        </div>
      </section>

      <main className="px-5 -mt-4">

        {/* Tarjeta de identidad */}
        <div className="relative overflow-hidden rounded-3xl border border-[#C9974A]/20 bg-gradient-to-br from-[#FFFBF3] via-[#FDF5E4] to-[#F8ECD3] p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#C9974A]/10 blur-2xl" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0F1E3D] text-[#C9974A] text-xl font-black shadow-md">
              {user?.photoURL ? (
                <img src={user.photoURL} className="h-full w-full object-cover" alt="Perfil" />
              ) : (
                user?.displayName?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="min-w-0 overflow-hidden">
              <h2 className="truncate text-base font-bold text-[#0F1E3D]">{socio.nombre || "Usuario"}</h2>
              <p className="mt-0.5 truncate text-xs text-slate-500">{user?.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#A87B32]">
                <IdCard size={12} className="text-[#C9974A]" /> DNI: {socio.dni || "Cargando..."}
              </div>
            </div>
          </div>
        </div>

        {/* Datos */}
        <div className="mt-7">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#A87B32] px-1">
            Información personal
          </p>
          <div className="mt-2 divide-y divide-[#C9974A]/25">
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                  <Mail size={15} className="text-[#C9974A]" />
                </span>
                <span className="text-sm text-slate-600 font-medium">Correo</span>
              </div>
              <span className="max-w-[50%] truncate text-xs text-slate-500">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                  <IdCard size={15} className="text-[#C9974A]" />
                </span>
                <span className="text-sm text-slate-600 font-medium">Documento</span>
              </div>
              <span className="text-xs text-slate-500">{socio.dni || "No disponible"}</span>
            </div>
          </div>
        </div>

        {/* Preferencias */}
        <div className="mt-7">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#A87B32] px-1">
            Preferencias de cuenta
          </p>
          <div className="mt-2 divide-y divide-[#C9974A]/25">
            <button className="flex w-full items-center justify-between py-3.5 text-left transition active:opacity-70">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                  <Bell size={15} className="text-[#C9974A]" />
                </span>
                <span className="text-sm text-slate-700 font-medium">Notificaciones</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
            <button className="flex w-full items-center justify-between py-3.5 text-left transition active:opacity-70">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                  <Lock size={15} className="text-[#C9974A]" />
                </span>
                <span className="text-sm text-slate-700 font-medium">Cambiar contraseña</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Salir */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 py-3.5 text-sm font-bold text-red-600 transition active:scale-[0.98]"
          >
            <LogOut size={16} />
            Cerrar sesión en este dispositivo
          </button>
        </div>

      </main>
    </div>
  );
}