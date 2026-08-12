import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const appear = setTimeout(() => setVisible(true), 100);
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => {
      clearTimeout(appear);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#071328]">
      <img
        src="/logovertical.png"
        className={`w-56 object-contain transition-all duration-700 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        alt="Auren"
      />

      <div className="absolute bottom-16 flex items-center gap-2">
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9974A]" style={{ animationDelay: "0ms" }} />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9974A]" style={{ animationDelay: "150ms" }} />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9974A]" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}