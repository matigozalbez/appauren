// components/PlanesCarousel.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import {  useNavigate } from "react-router-dom";

interface PlanItem {
  nombre: string;
  estado?: string; // "activo", etc. — si no viene, no se muestra el chip
}

interface PlanesCarouselProps {
  planes: PlanItem[];
  /** Opcional: si no se pasa, navega a /planes/:nombre */
  onSelectPlan?: (nombre: string) => void;
  /** Título de la sección. Default: "Tus planes" */
  titulo?: string;
}

export default function PlanesCarousel({
  planes,
  onSelectPlan,
  titulo = "Tus planes",
}: PlanesCarouselProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const esUnicoPlan = planes.length <= 1;

  const irADetalle = (nombre: string) => {
    if (onSelectPlan) return onSelectPlan(nombre);
   navigate(`/planes/${encodeURIComponent(nombre)}`, { replace: true });
  };
console.log("Hola")
  // Detecta qué card está "activa" para los dots — por intersección,
  // no por cuentas de scrollLeft (más prolijo con snap y anchos variables).
  useEffect(() => {
    if (esUnicoPlan) return;

    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = cardRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: [0.6] }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [esUnicoPlan, planes.length]);

  const items = useMemo(
    () =>
      planes.map((plan, i) => (
        <div
          key={plan.nombre}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          onClick={() => irADetalle(plan.nombre)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") irADetalle(plan.nombre);
          }}
          className={`group relative flex h-40 shrink-0 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[#C9974A]/30 bg-gradient-to-br from-[#FFFBF3] via-[#FDF5E4] to-[#F8ECD3] p-5 pt-6 shadow-md shadow-[#C9974A]/10 transition active:scale-[0.98] ${
            esUnicoPlan ? "w-full" : "w-[85%] snap-center"
          }`}
        >
          {/* franja dorada tipo carpeta/sello, arriba */}
          <div className="absolute inset-x-0 top-0 h-[5px] bg-gradient-to-r from-[#C9974A] via-[#DDB268] to-[#C9974A]" />

          <div className="relative z-10 flex items-start gap-3">
            {/* Espacio para el logo/ícono real de Auren — reemplazá el src */} 
            <div className="flex h-9 w-9 shrink-0 items-center justify-center ">
              <img src="/logoazulsolo.png" alt="" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#A87B32]">
                Tu cobertura
              </p>
              <h3
                className="mt-1 text-lg leading-tight text-[#2A2420]"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
              >
                {plan.nombre}
              </h3>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            {plan.estado ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#5C5248]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                {plan.estado === "activo" ? "Plan activo" : plan.estado}
              </span>
            ) : (
              <span />
            )}

            <span className="inline-flex items-center gap-1 rounded-full bg-[#0F1E3D] px-3 py-1 text-xs font-bold text-white shadow-sm transition group-active:scale-95">
              Ver cobertura
              <ChevronRight size={12} />
            </span>
          </div>
        </div>
      )),
    [planes, esUnicoPlan]
  );

  if (planes.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="mb-3 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">
        {titulo}
      </h2>

      {esUnicoPlan ? (
        <div className="px-6">{items}</div>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {items}
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5">
            {planes.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "w-4 bg-[#C9974A]" : "w-1.5 bg-[#C9974A]/25"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}