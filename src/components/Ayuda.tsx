import { Headphones, Phone, MessageCircle, ChevronRight } from "lucide-react";

interface AyudaProps {
  /** Teléfono de contacto (ej: "0800-222-3333") */
  telefono?: string;
  /** Número de WhatsApp con código de país y área sin símbolos (ej: "5493421234567") */
  whatsapp?: string;
  /** Mensaje predeterminado opcional para WhatsApp */
  mensajeWhatsapp?: string;
}

export default function Ayuda({
  telefono = "0800-333-XXXX",
  whatsapp = "5493425555555",
  mensajeWhatsapp = "Hola, necesito ayuda con mi plan de salud y autorizaciones.",
}: AyudaProps) {
  const numeroTelefono = telefono.replace(/\D/g, "");
  const numeroWhatsappLimpio = whatsapp.replace(/\D/g, "");

  return (
    <section className="mt-8 px-6" aria-labelledby="seccion-ayuda-titulo">
      <div className="relative overflow-hidden rounded-2xl border border-[#C9974A]/30 bg-gradient-to-br from-[#FFFBF3] via-[#FDF5E4] to-[#F8ECD3] p-5 shadow-md shadow-[#C9974A]/10">
        {/* franja dorada — misma firma que las cards de planes */}
        <div className="absolute inset-x-0 top-0 h-[5px] bg-gradient-to-r from-[#C9974A] via-[#DDB268] to-[#C9974A]" aria-hidden="true" />

        {/* marca de agua, misma lógica que ShieldCheck en las plan cards */}
        <Headphones
          size={104}
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-6 -right-6 text-[#0F1E3D]/[0.05]"
          aria-hidden="true"
        />

        {/* Header: mismo patrón badge + eyebrow + título que "Tu cobertura" */}
        <div className="relative z-10 flex items-start gap-3 pt-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F1E3D]/[0.06]">
            <Headphones size={16} className="text-[#0F1E3D]/70" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#A87B32]">
              Asistencia al socio
            </p>
            <h2
              id="seccion-ayuda-titulo"
              className="mt-1 text-lg leading-tight text-[#2A2420]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              ¿Necesitás ayuda?
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#5C5248]">
              Estamos para acompañarte con tu plan, autorizaciones y cualquier consulta.
            </p>
          </div>
        </div>

        {/* Acciones — filas con el mismo peso, en vez de un botón gigante + link suelto */}
        <div className="relative z-10 mt-4 overflow-hidden rounded-xl border border-[#C9974A]/20 bg-white/50 backdrop-blur-sm">
          <a
            href={`https://wa.me/${numeroWhatsappLimpio}?text=${encodeURIComponent(mensajeWhatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir chat de WhatsApp para asistencia al socio"
            className="flex items-center justify-between border-b border-[#C9974A]/15 p-3.5 transition active:bg-[#C9974A]/5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F1E3D]">
                <MessageCircle size={14} className="text-[#C9974A]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2A2420]">Escribinos por WhatsApp</p>
                <p className="text-[10px] text-[#8A8074]">Respuesta rápida</p>
              </div>
            </div>
            <ChevronRight size={15} className="text-[#C9974A]" aria-hidden="true" />
          </a>

          <a
            href={`tel:${numeroTelefono}`}
            aria-label={`Llamar al teléfono ${telefono}`}
            className="flex items-center justify-between p-3.5 transition active:bg-[#C9974A]/5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F1E3D]">
                <Phone size={14} className="text-[#C9974A]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2A2420]">Línea de atención</p>
                <p className="text-[10px] text-[#8A8074]">{telefono}</p>
              </div>
            </div>
            <ChevronRight size={15} className="text-[#C9974A]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}