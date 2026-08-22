// components/PlanCard.tsx
interface PlanCardProps {
  plan: string;
  imageSrc: string;
  wide?: boolean;
  onVerDetalle?: () => void;
}

export default function PlanCard({
  plan,
  imageSrc,
  wide,
  onVerDetalle,
}: PlanCardProps) {
  return (
    <div
      className={`group relative h-32 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        wide ? "col-span-2" : ""
      }`}
    >
      {/* Imagen de fondo */}
      <img
        src={imageSrc}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay degradado */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E3D]/85 via-[#0F1E3D]/20 to-transparent" />

      {/* Contenido */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-2">
        <p className="font-semibold text-white text-sm leading-snug drop-shadow-sm">
          {plan}
        </p>

        <button
          onClick={onVerDetalle}
          className="shrink-0 text-[11px] font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2.5 py-1.5 rounded-lg transition"
        >
          Ver detalle
        </button>
      </div>
    </div>
  );
}