import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallButton() {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detecta estrictamente si el dispositivo es Android
    const android = /Android/i.test(navigator.userAgent);
    setIsAndroid(android);
  }, []);

  const handleInstall = () => {
    // Aquí puedes meter la lógica de tu prompt de instalación si la tienes
    alert("Iniciando la instalación de la app...");
  };

  // Si no es Android, el componente no renderiza absolutamente nada
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
