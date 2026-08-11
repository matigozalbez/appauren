import { useEffect, useState } from "react";
import { Download } from "lucide-react";

// Definimos la interfaz para que TypeScript no chille con el evento nativo de PWA
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallButton() {
  const [isAndroid, setIsAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // 1. Detectamos si es Android
    const android = /Android/i.test(navigator.userAgent);
    setIsAndroid(android);

    // 2. Capturamos el evento de instalación nativo que lanza el navegador
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Evita que aparezca el banner automático feo de Chrome
      setDeferredPrompt(e as BeforeInstallPromptEvent); // Guardamos el evento para usarlo después
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Si por alguna razón el navegador todavía no lanzó el evento, le avisamos al usuario
      alert("Para instalar la app, toca el menú de los tres puntos de tu navegador (Chrome) y selecciona 'Instalar aplicación' o 'Agregar a la pantalla principal'.");
      return;
    }

    // 3. Mostramos el banner de instalación nativo de Android
    deferredPrompt.prompt();

    // Esperamos a ver qué eligió el usuario
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar la PWA');
    } else {
      console.log('Usuario canceló la instalación');
    }

    // El evento solo se puede usar una vez, lo limpieamos
    setDeferredPrompt(null);
  };

  // Si no es Android, no muestra nada
  if (!isAndroid) return null;

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-1.5 rounded-full bg-[#C9974A] px-3.5 py-1.5 text-[11px] font-semibold text-[#071328] transition hover:bg-[#d9a75a] shadow-[0_2px_10px_rgba(201,151,74,0.2)] active:scale-95"
    >
      <Download size={13} />
      Instalar app
    </button>
  );
}