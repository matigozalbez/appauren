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

    interface SocioData {
    nombre?: string;
    apellido?: string;
    dni?: string;
    estado?: string;
    // Agregá los campos que te mande tu backend
    }
    const CACHE_KEY = "auren_socio";

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
            const res = await fetch("https://backendauren.onrender.com/api/mi-socio", {
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
        localStorage.removeItem("auren_socio");
        await signOut(auth);
        navigate("/", { replace: true });
    };

    return (
        <div 
        className={`min-h-screen bg-gradient-to-b from-[#FDFBF7] via-[#FBF6EC] to-[#F5EAD2]  text-slate-800 pb-32 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${animationClass}`}
        >
        {/* Header Minimalista con tus colores */}
        <div className="pt-8 pb-6 px-6 border-b border-slate-200 bg-gradient-to-br from-[#0F1E3D] via-[#152953] to-[#0A1429]">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center justify-between">
            <span>Mi Perfil</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#C9974A]/20 text-[#C9974A] border border-[#C9974A]/30">
                Socio Activo
            </span>
            </h1>
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
                <h2 className="text-base font-bold text-slate-900 truncate">{socio.nombre|| "Usuario"}</h2>
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

            {/* Sección Ayuda */}
            <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
                Centro de soporte
            </p>
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
                <a
                href="https://wa.me/5493425486031"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
                >
                <div className="flex items-center gap-3">
                    <MessageCircle size={16} className="text-emerald-500" />
                    <span className="text-sm text-slate-700 font-medium">Soporte por WhatsApp</span>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
                </a>
                
                <a
                href="tel:08005552873"
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
                >
                <div className="flex items-center gap-3">
                    <Phone size={16} className="text-[#C9974A]" />
                    <span className="text-sm text-slate-700 font-medium">Línea de atención telefónica</span>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
                </a>

                <button className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                    <HelpCircle size={16} className="text-[#C9974A]" />
                    <span className="text-sm text-slate-700 font-medium">Preguntas frecuentes</span>
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
    );
    }