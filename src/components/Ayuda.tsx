import { Headphones, Phone, ChevronRight } from "lucide-react";

interface AyudaProps {
  /** Teléfono de contacto (ej: "0800-222-3333") */
  telefono?: string;
}

export default function Ayuda({
  telefono = "0800-333-XXXX",
}: AyudaProps) {
  const numeroTelefono = telefono.replace(/\D/g, "");

  return (
    <section className="mt-10 px-5" aria-labelledby="seccion-ayuda-titulo">
      {/* Encabezado editorial con marca de agua */}
      <div className="relative">
        <Headphones
          size={56}
          strokeWidth={1}
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#C9974A]/15"
          aria-hidden="true"
        />

        <div className="max-w-[260px]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#A87B32]">
            Asistencia al socio
          </p>
          <h2
            id="seccion-ayuda-titulo"
            className="mt-1.5 font-serif text-xl font-semibold text-[#0F1E3D]"
          >
            ¿Necesitás ayuda?
          </h2>
          <p className="mt-1.5 text-xs font-light leading-relaxed text-[#5C5248]">
            Estamos para acompañarte con tu plan, autorizaciones y cualquier consulta.
          </p>
        </div>
      </div>

      {/* Línea de atención bajo línea divisoria */}
      <div className="mt-5 divide-y divide-[#0F1E3D]/8">
        <a
          href={`tel:${numeroTelefono}`}
          aria-label={`Llamar al teléfono ${telefono}`}
          className="flex w-full items-center gap-3 py-3.5 transition active:opacity-70"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
            <Phone size={16} className="text-[#C9974A]" aria-hidden="true" />
          </span>
          <span className="flex-1 leading-tight">
            <span className="block text-sm font-semibold text-[#0F1E3D]">
              Línea de atención
            </span>
            <span className="block text-xs text-[#8A8074]">{telefono}</span>
          </span>
          <ChevronRight size={16} className="text-slate-400" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}