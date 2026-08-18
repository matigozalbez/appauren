import { useState, useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase';
// Ajustá la ruta de tu archivo de firebase

export function GestorNotificaciones() {
  const [notiActivas, setNotiActivas] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [estadoPermiso, setEstadoPermiso] = useState<'default' | 'granted' | 'denied'>('default');

  useEffect(() => {
    // Verificamos el estado real al entrar
    if (Notification.permission === 'granted') {
      setNotiActivas(true);
      setMostrarModal(false);
    } else if (Notification.permission === 'denied') {
      setNotiActivas(false);
      setMostrarModal(true); // Ya lo denegó antes, mostramos el modal para guiarlo a ajustes
      setEstadoPermiso('denied');
    } else {
      // Si está en 'default', mostramos el modal apenas entra para que elija
      setMostrarModal(true);
    }
  }, []);

  const solicitarPermisoNoti = async () => {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: 'BCB0-_Qu_aFcJ5x3_SJEvCFDkphk1RizC0ZEpHTRbcf1TkC3aoFn8cZ4qYYJt_fMTihbbMI0lL3zo_5guUGoNc4'
        });
        
        if (token) {
          console.log("Token obtenido:", token);
          alert("¡Token obtenido con éxito!");
          // Acá mandarías el token a tu backend en Go
        }

        setNotiActivas(true);
        setMostrarModal(false);
        setEstadoPermiso('granted');
      } else {
        // Tocó que "no" (denegado para siempre en este flujo)
        setNotiActivas(false);
        setEstadoPermiso('denied');
        // El modal sigue abierto pero ahora cambia su mensaje para guiarlo a la configuración
      }
    } catch (error: any) {
      console.error("Error al obtener el token:", error);
      alert("Error: " + (error?.message || JSON.stringify(error)));
    }
  };

  // Si ya están activas, no mostramos nada (o podés mostrar otra cosa)
  if (notiActivas) return null;

  return (
    <>
      {mostrarModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            {estadoPermiso === 'denied' ? (
              <>
                <h3>¡Notificaciones bloqueadas!</h3>
                <p>Activa las notificaciones desde la configuración de tu teléfono para no perderte nada.</p>
              </>
            ) : (
              <>
                <h3>¡Activa las notificaciones!</h3>
                <p>Enterate de las novedades al instante.</p>
                <button onClick={solicitarPermisoNoti} style={botonStyle}>
                  Activar notificaciones
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Estilos rápidos para que se vea como modal
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: '12px',
  textAlign: 'center',
  maxWidth: '320px',
  width: '90%',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
};

const botonStyle: React.CSSProperties = {
  marginTop: '16px',
  padding: '10px 20px',
  backgroundColor: '#007AFF',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
};