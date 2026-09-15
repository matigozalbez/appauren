import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { obtenerTokenYGuardar, marcarAvisoPush, leerAvisoPush, COOLDOWN_MS } from "../services/push";

export function GestorNotificaciones() {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [mostrarModal, setMostrarModal] = useState(false);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (typeof Notification === "undefined" || !user) return;

        if (Notification.permission === "granted") {
            // Ya activadas: solo aseguramos que el token esté guardado
            marcarAvisoPush("granted");
            setMostrarModal(false);
            obtenerTokenYGuardar(user.uid).catch((error) =>
                console.error("Error re-guardando token:", error)
            );
        } else if (Notification.permission === "denied") {
            // Bloqueadas en el navegador: no tiene sentido volver a preguntar.
            // Solamente se informa desde Configuración / Perfil.
            marcarAvisoPush("denied");
            setMostrarModal(false);
        } else {
            // "default": mostramos solo la primera vez (incluye el primer login)
            // o cuando pasó el cooldown de 7 días.
            const aviso = leerAvisoPush();
            setMostrarModal(!aviso || Date.now() - aviso.visto >= COOLDOWN_MS);
        }
    }, [user]);

    const solicitarPermisoNoti = async () => {
        setGuardando(true);
        try {
            const permission = await Notification.requestPermission();

            if (permission === "granted") {
                if (!user) return;
                await obtenerTokenYGuardar(user.uid);
                marcarAvisoPush("granted");
                setMostrarModal(false);
            } else {
                // Denegado o cerrado el prompt del navegador: respetamos y no jodemos por 7 días.
                marcarAvisoPush("denied");
                setMostrarModal(false);
            }
        } catch (error) {
            console.error("Error al solicitar permiso:", error);
        } finally {
            setGuardando(false);
        }
    };

    const masTarde = () => {
        marcarAvisoPush("default");
        setMostrarModal(false);
    };

    const irAPerfil = () => {
        setMostrarModal(false);
        navigate("/perfil");
    };

    return createPortal(
        <>
            {mostrarModal && (
                <div className="fixed inset-0 z-[9999] bg-[#0F1E3D]/60 backdrop-blur-sm flex items-center justify-center px-6">
                    <div className="bg-white rounded-3xl p-6 text-center max-w-[320px] w-full shadow-xl badge-pop">
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
                        <button
                            onClick={irAPerfil}
                            className="mt-2.5 w-full py-2.5 rounded-full bg-[#0F1E3D]/5 text-[#0F1E3D] text-sm font-bold active:scale-95 transition"
                        >
                            Configurarlo en Perfil
                        </button>
                        <button
                            onClick={masTarde}
                            className="mt-1 w-full py-2 text-xs font-semibold text-slate-400 active:opacity-70 transition"
                        >
                            Ahora no
                        </button>
                    </div>
                </div>
            )}
        </>,
        document.body
    );
}