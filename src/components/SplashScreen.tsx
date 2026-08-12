import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true); // arranca visible, no oculto

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center bg-[#071328] transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <img src="/logovertical.png" className="w-56 object-contain" alt="Auren" />

      <div className="absolute bottom-16 flex items-center gap-2">
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9974A]" style={{ animationDelay: "0ms" }} />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9974A]" style={{ animationDelay: "150ms" }} />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9974A]" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}