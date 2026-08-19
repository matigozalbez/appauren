import { useState, useEffect } from "react";
import { getToken } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { messaging, auth, db } from "../firebase";

const VAPID_KEY = "BCB0-_Qu_aFcJ5x3_SJEvCFDkphk1RizC0ZEpHTRbcf1TkC3aoFn8cZ4qYYJt_fMTihbbMI0lL3zo_5guUGoNc4";

export function GestorNotificaciones() {
    const [user] = useAuthState(auth);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [estadoPermiso, setEstadoPermiso] = useState<"default" | "granted" | "denied">("default");
    const [guardando, setGuardando] = useState(false);

const guardarToken = async (token: string) => {
    if (!user) return;
    try {
        await setDoc(doc(db, "push_tokens", user.uid), {
            token,
            user_id: user.uid, // <--- Esto es lo único que necesita el backend para el envío individual
            updatedAt: new Date(),
        }, { merge: true });
    } catch (error) {
        console.error("Error al guardar el token en Firestore:", error);
    }
};

    const obtenerYGuardarToken = async () => {
        try {
            const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
            await navigator.serviceWorker.ready;

            const token = await getToken(messaging, {
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: registration,
            });

            if (token) {
                await guardarToken(token);
            }
        } catch (error) {
            console.error("Error obteniendo/guardando token:", error);
        }
    };

    // Control de permisos iniciales
    useEffect(() => {
        if (typeof Notification === "undefined" || !user) return;

        if (Notification.permission === "granted") {
            setMostrarModal(false);
            obtenerYGuardarToken();
        } else if (Notification.permission === "denied") {
            setMostrarModal(true);
            setEstadoPermiso("denied");
        } else {
            setMostrarModal(true);
        }
    }, [user]);

    // Escuchar mensajes en FOREGROUND

    const solicitarPermisoNoti = async () => {
        setGuardando(true);
        try {
            const permission = await Notification.requestPermission();

            if (permission === "granted") {
                await obtenerYGuardarToken();
                setMostrarModal(false);
                setEstadoPermiso("granted");
            } else {
                setEstadoPermiso("denied");
            }
        } catch (error) {
            console.error("Error al solicitar permiso:", error);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <>
            {mostrarModal && (
                <div className="fixed inset-0 z-[9999] bg-[#0F1E3D]/60 backdrop-blur-sm flex items-center justify-center px-6">
                    <div className="bg-white rounded-3xl p-6 text-center max-w-[320px] w-full shadow-xl">
                        {estadoPermiso === "denied" ? (
                            <>
                                <h3 className="text-[#0F1E3D] font-bold text-lg">Notificaciones bloqueadas</h3>
                                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                                    Activá las notificaciones desde la configuración de tu teléfono para no perderte novedades ni beneficios.
                                </p>
                                <button
                                    onClick={() => setMostrarModal(false)}
                                    className="mt-5 w-full py-2.5 rounded-full bg-[#0F1E3D]/5 text-[#0F1E3D] text-sm font-bold active:scale-95 transition"
                                >
                                    Entendido
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-[#0F1E3D] font-bold text-lg">Activá las notificaciones</h3>
                                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                                    Enterate al instante de descuentos, novedades y avisos importantes de Auren.
                                </p>
                                <button
                                    onClick={solicitarPermisoNoti}
                                    disabled={guardando}
                                    className="mt-5 w-full py-2.5 rounded-full bg-[#0F1E3D] text-white text-sm font-bold active:scale-95 transition disabled:opacity-60"
                                >
                                    {guardando ? "Activando..." : "Activar notificaciones"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}