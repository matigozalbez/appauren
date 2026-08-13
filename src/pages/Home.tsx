import { useState, useEffect } from "react";
import { Heart, Shield, Phone, IdCard, ChevronRight } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";


export default function Home() {
  const [user] = useAuthState(auth);
  const firstName = user?.displayName?.split(" ")[0] || "Alan";
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [planes, setPlanes] = useState<string[]>(() => {
    const cached = localStorage.getItem("auren_planes");
    return cached ? JSON.parse(cached) : [];
  });

  const direction = sessionStorage.getItem("nav_direction") || "right";
  const animationClass = direction === "right" ? "animate-slide-right" : "animate-slide-left";


  useEffect(() => {
    const fetchSocio = async () => {
      if (!user) return;
      const idToken = await user.getIdToken();
      try {
        const res = await fetch("https://backendauren.onrender.com/api/mi-socio", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPlanes(data.planes || []);
          localStorage.setItem("auren_planes", JSON.stringify(data.planes || []));
        }
      } catch {
        // silencioso
      }
    };
    fetchSocio();
  }, [user]);

  const handleLogout = async () => {
    localStorage.removeItem("auren_dni");
    localStorage.removeItem("auren_planes");
    await signOut(auth);
    navigate("/", { replace: true });
  };

  const planStyles = [
    { icon: Heart, bg: "bg-[#0F1E3D]", cardBg: "bg-white", cardBorder: "border-slate-100", badgeBg: "bg-emerald-600" },
    { icon: Shield, bg: "bg-[#C9974A]", cardBg: "bg-white", cardBorder: "border-slate-100", badgeBg: "bg-[#C9974A]" },
    { icon: Shield, bg: "bg-[#C9974A]", cardBg: "bg-white", cardBorder: "border-slate-100", badgeBg: "bg-[#C9974A]" },
    { icon: Shield, bg: "bg-[#C9974A]", cardBg: "bg-white", cardBorder: "border-slate-100", badgeBg: "bg-[#C9974A]" },
  ];

  return (
    <div className={`min-h-screen bg-slate-50 pb-24 overflow-y-auto ${animationClass}`}>
      {/* Header navy con curva inferior */}
      <div className="relative bg-[#0F1E3D] px-6 pb-16 pt-6 rounded-b-[32px] shadow-md">
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
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#C9974A] text-sm font-bold text-[#0F1E3D] ring-2 ring-white/20 transition hover:scale-105"
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
                  <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-100">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">{firstName}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-slate-50 font-medium transition"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>

            <button className="relative flex h-9 w-9 items-center justify-center text-white transition hover:opacity-80">
              <img src="campanitasinfondo.png" className="w-5 h-5 object-contain" alt="Notificaciones" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0F1E3D]" />
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold text-white">¡Hola, {firstName}!</h1>
          <p className="text-xs text-[#C9974A] font-medium tracking-wide mt-1 uppercase">Bienvenido a Mi Auren</p>
        </div>
      </div>

      {/* Card de afiliación, flotando sobre el header */}
      <div className="-mt-8 px-6 relative z-10">
        <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 shadow-lg border border-slate-100/80">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <img src="/escudoverde.png" className="w-full h-full object-contain" alt="Escudo" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">Afiliación Activa</p>
            <p className="text-xs text-slate-500">Tu cobertura está vigente.</p>
          </div>
        </div>
      </div>

      {/* Tus planes */}
      <div className="mt-6 px-6">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Tus planes</h2>
        <div className="grid grid-cols-2 gap-3">
          {planes.map((plan, i) => {
            const style = planStyles[i % planStyles.length];
            const Icon = style.icon;
            return (
              <div key={plan} className={`rounded-2xl border ${style.cardBorder} ${style.cardBg} p-4 shadow-sm transition hover:shadow-md flex flex-col justify-between`}>
                <div>
                  <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${style.bg} text-white shadow-sm`}>
                    <Icon size={18} />
                  </div>
                  <p className="font-semibold text-slate-900 text-sm leading-snug">{plan}</p>
                </div>
                <div className="mt-4">
                  <span className={`inline-block rounded-full ${style.badgeBg} px-2.5 py-0.5 text-[10px] font-bold text-white tracking-wider`}>
                    ACTIVO
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="mt-6 px-6">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Accesos rápidos</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/credencial" className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:border-slate-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-[#0F1E3D]">
                <IdCard size={18} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Mi Credencial</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>

          <button className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:border-slate-200 hover:shadow-md w-full text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-[#0F1E3D]">
                <Shield size={18} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Mis Coberturas</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:border-slate-200 hover:shadow-md w-full text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <img src="whatticono.png" className="w-5 h-5 object-contain" alt="WhatsApp" />
              </div>
              <span className="text-xs font-semibold text-slate-800">WhatsApp</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:border-slate-200 hover:shadow-md w-full text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#C9974A]">
                <Phone size={18} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Contacto</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}