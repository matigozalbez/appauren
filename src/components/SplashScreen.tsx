import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // pequeño delay para que se note la animación, aunque cargue rápido
    const timer = setTimeout(() => setVisible(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#071328]">
      <div
        className={`flex flex-col items-center transition-all duration-700 ${
          visible ? "opacity-0 scale-90" : "opacity-100 scale-100"
        }`}
      >
        <img
          src="/auren-isotipo.png"
          className="h-20 w-20 object-contain animate-pulse"
          alt="Auren"
        />
        <img
          src="/auren-logo-horizontal-blanco.png"
          className="mt-4 h-8 w-auto object-contain"
          alt="Auren"
        />
      </div>

      <div className="absolute bottom-16 flex items-center gap-2">
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9974A]" style={{ animationDelay: "0ms" }} />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9974A]" style={{ animationDelay: "150ms" }} />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9974A]" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}