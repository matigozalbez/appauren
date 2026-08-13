import { useState } from "react";
import { Heart, Shield,  Phone, IdCard,ChevronRight} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

export default function Home() {
  const [user] = useAuthState(auth);
  const firstName = user?.displayName?.split(" ")[0] || "Alan";
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

const handleLogout = async () => {
  localStorage.removeItem("auren_dni");
  await signOut(auth);
  navigate("/", { replace: true });
};

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header navy con curva inferior */}
      <div className="relative bg-[#0F1E3D] px-6 pb-16 pt-6 rounded-b-[30px] shadow-lg">
      <div className="flex items-center justify-between">
  <div className="flex items-center gap-2.5">
    <img src="/auren-isotipo.png" className="h-8 w-8 object-contain" alt="Auren" />
    <span
      className="text-2xl font-bold text-white tracking-tight"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      Auren
    </span>
  </div>

  <div className="flex items-center gap-3">
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#C9974A] text-sm font-bold text-[#0F1E3D]"
      >
        {user?.photoURL ? (
          <img src={user.photoURL} className="h-full w-full object-cover" alt="Perfil" />
        ) : (
          firstName.charAt(0).toUpperCase()
        )}
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">{firstName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>

    <button className="relative flex h-9 w-9 items-center justify-center  text-whitetransition">
     <img
     src="campanitasinfondo.png "
     />
      <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
    </button>
  </div>
</div>

        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold text-white">¡Hola, {firstName}!</h1>
          <p className="text-sm text-[#C9974A] mt-0.5">Bienvenido a Mi Auren</p>
        </div>
      </div>

      {/* Card de afiliación, flotando sobre el header */}
      <div className="-mt-8 px-6 relative z-10">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl border border-slate-100">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center ">
            <img
            src="/escudoverde.png"
            />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Afiliación Activa</p>
            <p className="text-xs text-slate-500">Tu cobertura está vigente.</p>
          </div>
        </div>
      </div>

      {/* Tus planes */}
      <div className="mt-6 px-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Tus planes</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4 shadow-sm">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 shadow-sm">
              <Heart size={18} className="text-white" />
            </div>
            <p className="font-semibold text-slate-900 text-sm">Auren Salud</p>
            <span className="mt-2 inline-block rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              ACTIVO
            </span>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 shadow-sm">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#C9974A] shadow-sm">
              <Shield size={18} className="text-white" />
            </div>
            <p className="font-semibold text-slate-900 text-sm">Auren en Ruta</p>
            <span className="mt-2 inline-block rounded-full bg-[#C9974A] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              ACTIVO
            </span>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 shadow-sm">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#C9974A] shadow-sm">
              <Shield size={18} className="text-white" />
            </div>
            <p className="font-semibold text-slate-900 text-sm">Auren Sepelios</p>
            <span className="mt-2 inline-block rounded-full bg-[#C9974A] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              ACTIVO
            </span>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="mt-6 px-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Accesos rápidos</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/credencial" className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-[#0F1E3D]">
                <IdCard size={18} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Mi Credencial</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>

          <button className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:border-slate-200 w-full text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-[#0F1E3D]">
                <Shield size={18} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Mis Coberturas</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:border-slate-200 w-full text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <img src="whatticono.png"/>
              </div>
              <span className="text-xs font-semibold text-slate-800">WhatsApp</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:border-slate-200 w-full text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-[#C9974A]">
                <Phone size={18} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Contacto</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Nav inferior fija */}
     
    </div>
  );
}