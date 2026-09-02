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
    <div
            className={`min-h-screen bg-gradient-to-b from-[#FDFBF7] via-[#FBF6EC] to-[#F5EAD2]  text-slate-800 ${animationClass}`}
            
    >

           <div className="min-h-screen overflow-y-auto pb-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      {/* Header Minimalista con tus colores */}
      <div className="pt-8 pb-6 px-6 border-b border-slate-200 bg-gradient-to-br from-[#0F1E3D] via-[#152953] to-[#0A1429]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/home", { replace: true })}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
            style={{ touchAction: "manipulation" }}
          >
            <ArrowLeft size={17} />
          </button>
          <h1 className="flex-1 text-xl font-bold tracking-tight text-white flex items-center justify-between">
            <span>Mi Perfil</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#C9974A]/20 text-[#C9974A] border border-[#C9974A]/30">
            Socio Activo
          </span>
          </h1>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">

        {/* Tarjeta de Identidad Estilo ID Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 border border-slate-100 shadow-xl">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-[#C9974A]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#C9974A] text-[#0F1E3D] font-black text-xl shadow-md">
              {user?.photoURL ? (
                <img src={user.photoURL} className="h-full w-full object-cover" alt="Perfil" />
              ) : (
                user?.displayName?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-base font-bold text-slate-900 truncate">{socio.nombre || "Usuario"}</h2>
              <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#C9974A] bg-[#C9974A]/10 px-2 py-0.5 rounded">
                <IdCard size={12} /> DNI: {socio.dni || "Cargando..."}
              </div>
            </div>
          </div>
        </div>

        {/* Sección Datos */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            Información personal
          </p>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#C9974A]" />
                <span className="text-sm text-slate-700 font-medium">Correo</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <IdCard size={16} className="text-[#C9974A]" />
                <span className="text-sm text-slate-700 font-medium">Documento</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">{socio.dni || "No disponible"}</span>
            </div>
          </div>
        </div>

        {/* Sección Ajustes */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            Preferencias de cuenta
          </p>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            <button className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-[#C9974A]" />
                <span className="text-sm text-slate-700 font-medium">Notificaciones</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
            <button className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-[#C9974A]" />
                <span className="text-sm text-slate-700 font-medium">Cambiar contraseña</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Botón Salir */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 border border-red-200 py-4 text-sm font-bold text-red-600 hover:bg-red-100 transition shadow-sm"
          >
            <LogOut size={16} />
            Cerrar sesión en este dispositivo
          </button>
        </div>

      </div>
      </div>
    </div>
  );
}