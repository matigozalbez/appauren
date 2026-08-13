import { useState, useEffect } from "react";
import {
  Mail,
  IdCard,
  Bell,
  Lock,
  MessageCircle,
  Phone,
  HelpCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
const [dni, setDni] = useState<string | null>(() => {
  // al montar, intenta leer del cache local primero (instantáneo)
  return localStorage.getItem("auren_dni");
});

useEffect(() => {
  const fetchDni = async () => {
    if (!user) return;
    const idToken = await user.getIdToken();
    try {
      const res = await fetch("https://backendauren.onrender.com/api/mi-socio", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDni(data.dni);
        localStorage.setItem("auren_dni", data.dni); // guardamos para la próxima vez
      }
    } catch {
      // silencioso
    }
  };
  fetchDni();
}, [user]);

const handleLogout = async () => {
  localStorage.removeItem("auren_dni");
  await signOut(auth);
  navigate("/", { replace: true });
};

  return (
<div className="animate-slideInFromRight min-h-screen-safe">
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header navy */}
      <div className="bg-[#0F1E3D] px-6 pb-12 pt-8 rounded-b-[30px] shadow-lg">
        <h1 className="text-xl font-bold text-white text-center">Mi Perfil</h1>
      </div>

      {/* Avatar + nombre, flotando sobre el header */}
      <div className="-mt-10 px-6">
        <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#C9974A] text-2xl font-bold text-[#0F1E3D]">
            {user?.photoURL ? (
              <img src={user.photoURL} className="h-full w-full object-cover" alt="Perfil" />
            ) : (
              user?.displayName?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <p className="mt-3 text-lg font-bold text-slate-900">{user?.displayName || "Usuario"}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>

      {/* Datos básicos */}
      <div className="mt-6 px-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Mis datos
        </h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
            <Mail size={16} className="text-[#C9974A]" />
            <div>
              <p className="text-[10px] text-slate-400">Correo electrónico</p>
              <p className="text-sm font-medium text-slate-800">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <IdCard size={16} className="text-[#C9974A]" />
            <div>
              <p className="text-[10px] text-slate-400">DNI</p>
              <p className="text-sm font-medium text-slate-800">{dni || "—"}</p>    
            </div>
          </div>
        </div>
      </div>

      {/* Configuración */}
      <div className="mt-6 px-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Configuración
        </h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
          <button className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3.5 text-left hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-[#C9974A]" />
              <span className="text-sm font-medium text-slate-800">Notificaciones</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
          <button className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <Lock size={16} className="text-[#C9974A]" />
              <span className="text-sm font-medium text-slate-800">Cambiar contraseña</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Soporte */}
      <div className="mt-6 px-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Ayuda y soporte
        </h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
          
           <a href="https://wa.me/5493424054346"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <MessageCircle size={16} className="text-emerald-500" />
              <span className="text-sm font-medium text-slate-800">WhatsApp</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </a>
          
           <a href="tel:08005552873"
            className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-[#C9974A]" />
              <span className="text-sm font-medium text-slate-800">Línea de atención</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </a>
          <button className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <HelpCircle size={16} className="text-[#C9974A]" />
              <span className="text-sm font-medium text-slate-800">Preguntas frecuentes</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Cerrar sesión */}
      <div className="mt-6 px-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-semibold text-red-600"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
    </div>
  );
}