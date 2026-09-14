import { useEffect, useState } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { obtenerTokenYGuardar, marcarAvisoPush } from "../services/push";

interface PanelConfigProps {
    onClose: () => void;
}

export default function PanelConfig({ onClose }: PanelConfigProps) {
    const [user] = useAuthState(auth);
    const [guardando, setGuardando] = useState(false);
    const [tieneToken, setTieneToken] = useState(false);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    useEffect(() => {
        if (!user) return;
        getDoc(doc(db, "push_tokens", user.uid))
            .then((snap) => setTieneToken(snap.exists()))
            .catch(() => setTieneToken(false));
    }, [user]);

    const permiso = typeof Notification !== "undefined" ? Notification.permission : "denied";
    const pushActiva = permiso === "granted" && tieneToken;
    const bloqueada = permiso === "denied";

    const togglePush = async () => {
        if (!user) return;

        setGuardando(true);
        try {
            if (pushActiva) {
                await deleteDoc(doc(db, "push_tokens", user.uid));
                setTieneToken(false);
                marcarAvisoPush("default");
            } else {
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    marcarAvisoPush("denied");
                    return;
                }
                await obtenerTokenYGuardar(user.uid);
                marcarAvisoPush("granted");
                setTieneToken(true);
            }
        } catch (error) {
            console.error("Error cambiando estado de push:", error);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 z-[9000] bg-[#0F1E3D]/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="badge-pop fixed inset-x-0 bottom-20 z-[9001] mx-auto max-w-[560px] rounded-t-3xl bg-[#FBF6EC] p-6 pb-[max(24px,env(safe-area-inset-bottom))] shadow-2xl">
                <div className="flex items-center justify-between">
                    <h2 className="font-serif text-lg font-semibold text-[#0F1E3D]">Configuración</h2>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar configuración"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-900/[0.04] transition active:scale-95"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="mt-5 space-y-3">
                    <p className="px-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#A87B32]">
                        Preferencias
                    </p>

                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.03]">
                        {bloqueada ? (
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                                    <BellOff size={18} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-[#0F1E3D]">
                                        Notificaciones bloqueadas
                                    </p>
                                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                                        Activálas desde los ajustes del navegador para recibir avisos de tus turnos.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                                        <Bell size={18} className="text-[#C9974A]" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#0F1E3D]">
                                            Notificaciones push
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {pushActiva
                                                ? "Activadas: avisos de tus turnos y novedades"
                                                : "Recibí avisos de tus turnos y novedades"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={pushActiva}
                                    onClick={togglePush}
                                    disabled={guardando}
                                    className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-50 ${
                                        pushActiva ? "bg-emerald-500" : "bg-slate-300"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                                            pushActiva ? "left-6" : "left-1"
                                        }`}
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}