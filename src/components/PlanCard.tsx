// components/PlanCard.tsx
interface PlanCardProps {
  plan: string;
  imageSrc: string;
  wide?: boolean;
}

export default function PlanCard({ plan, imageSrc, wide }: PlanCardProps) {
  return (
    <div className={`group relative h-32 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${wide ? "col-span-2" : ""}`}>
      {/* Imagen de fondo */}
      <img
        src={imageSrc}
        alt={plan}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay degradado para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E3D]/85 via-[#0F1E3D]/20 to-transparent" />

      {/* Nombre del plan */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-semibold text-white text-sm leading-snug drop-shadow-sm">{plan}</p>
      </div>
    </div>
  );
}