import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallButton() {
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
  }, []);

  const handleInstall = () => {
    setShowIOSHint(true);
  };

  return (
    <>
      <button
        onClick={handleInstall}
        className="flex items-center gap-2 rounded-full bg-[#C9974A] px-4 py-2 text-xs font-semibold text-[#0F1E3D] transition hover:bg-[#d9a75a]"
      >
        <Download size={14} />
        Instalar app
      </button>

      {showIOSHint && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4"
          onClick={() => setShowIOSHint(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#0F1E3D] p-5 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-semibold">📲 Instalar app</p>
            <p className="mt-2 text-xs text-white/70 leading-relaxed">
              Tocá el botón <strong className="text-[#C9974A]">•••</strong> abajo y elegí <strong className="text-[#C9974A]">"Agregar a inicio"</strong>.
            </p>
            <button
              onClick={() => setShowIOSHint(false)}
              className="mt-4 w-full rounded-full bg-[#C9974A] py-2 text-sm font-semibold text-[#0F1E3D]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}