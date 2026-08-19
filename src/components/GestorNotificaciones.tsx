import { useState, useEffect } from "react";
import { getToken } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { messaging, auth, db } from "../firebase";
import { onMessage } from "firebase/messaging";

const VAPID_KEY = "BCB0-_Qu_aFcJ5x3_SJEvCFDkphk1RizC0ZEpHTRbcf1TkC3aoFn8cZ4qYYJt_fMTihbbMI0lL3zo_5guUGoNc4";

export function GestorNotificaciones() {
  const [user] = useAuthState(auth);
  const [notiActivas, setNotiActivas] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [estadoPermiso, setEstadoPermiso] = useState<"default" | "granted" | "denied">("default");
  const [guardando, setGuardando] = useState(false);

  const guardarToken = async (token: string) => {
    if (!user) return;
    await setDoc(doc(db, "push_tokens", user.uid), {
      token,
      updatedAt: new Date(),
    });
  };

  const obtenerYGuardarToken = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
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

  useEffect(() => {
    if (typeof Notification === "undefined" || !user) return;

    if (Notification.permission === "granted") {
      setNotiActivas(true);
      setMostrarModal(false);
      // El permiso ya estaba concedido de antes: igual necesitamos
      // asegurarnos de tener el token guardado para este dispositivo/usuario.
      obtenerYGuardarToken();
    } else if (Notification.permission === "denied") {
      setNotiActivas(false);
      setMostrarModal(true);
      setEstadoPermiso("denied");
    } else {
      setMostrarModal(true);
    }
  }, [user]);

  useEffect(() => {
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("Mensaje en foreground:", payload);
    
    // Opción simple: notificación nativa del browser aunque esté en foreground
    if (Notification.permission === "granted") {
      new Notification(payload.notification?.title || "Auren", {
        body: payload.notification?.body,
        icon: "/icon-192.png",
      });
    }
  });

  return () => unsubscribe();
}, []);

  const solicitarPermisoNoti = async () => {
    setGuardando(true);
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        await obtenerYGuardarToken();
        setNotiActivas(true);
        setMostrarModal(false);
        setEstadoPermiso("granted");
      } else {
        setNotiActivas(false);
        setEstadoPermiso("denied");
      }
    } catch (error: any) {
      console.error("Error al obtener el token:", error);
    } finally {
      setGuardando(false);
    }
  };

  if (notiActivas) return null;

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