import { useState, useEffect } from "react";

const PRESTADORES_BANNER = [
  {
    id: "cardinal",
    banner: "wqe",
    link: "wqe",
  },
  {
    id: "prevencion",
    banner: "wqe",
    link: "wqe",
  },
  {
    id: "amupym",
    banner: "/tu-banner-amupym.png",
    link: "https://turismo.cardinalassistance.com/public/2026/img/home/banner_2.png",
  },
  {
    id: "minardi",
    banner: "/tu-banner-minardi.png",
    link: "https://tu-link-aqui.com",
  },
  {
    id: "serenium",
    banner: "/tu-banner-serenium.png",
    link: "https://tu-link-aqui.com",
  },
];

export default function PrestadoresCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PRESTADORES_BANNER.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const actual = PRESTADORES_BANNER[currentIndex];

  return (
    <div className="-mt-8 px-6 relative z-10">
      {/* Contenedor principal con tus medidas exactas y fondo oscuro corporativo por si el banner es transparente */}
      <div className="relative flex items-center justify-between rounded-2xl bg-[#0F1E3D] shadow-lg border border-slate-100/85 overflow-hidden transition-all duration-500 h-[72px]">
        
        {/* Banner interactivo completo */}
   <a 
  href={actual.link} 
  target="_blank" 
  rel="noreferrer" 
  className="absolute inset-0 z-10 block w-full h-full"
>
  <img 
    src={actual.banner} 
    className="w-full h-full object-fill" 
    alt="Publicidad" 
  />
</a>

        {/* Indicadores laterales / Paginador */}
        <div className="absolute right-3 flex flex-col gap-1 z-20 pointer-events-auto">
          {PRESTADORES_BANNER.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex(idx);
              }}
              className={`rounded-full transition-all shadow-md ${
                idx === currentIndex ? "w-3 h-1 bg-[#C9974A]" : "w-1 h-1 bg-white/60"
              }`}
              aria-label={`Ver banner ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}