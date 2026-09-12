import { useEffect } from "react";
import { CheckCircle2, CalendarDays, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SolicitudEnviadaModalProps {
  isOpen: boolean;
  tipo: "turno" | "estudio";
  onClose: () => void;
}

export default function SolicitudEnviadaModal({
  isOpen,
  tipo,
  onClose,
}: SolicitudEnviadaModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const irACitas = () => {
    onClose();
    navigate("/citas", { replace: true });
  };

  const palabra = tipo === "estudio" ? "estudio" : "turno";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-[#0F1E3D]/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="badge-pop relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition active:scale-95"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={34} className="text-emerald-600" />
        </div>

        <h2 className="mt-4 font-serif text-xl font-semibold text-[#0F1E3D]">
          Solicitud de {palabra} enviada
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Revisá la sección{" "}
          <span className="font-semibold text-[#0F1E3D]">Citas</span> para
          seguir el estado de tu {palabra}.
        </p>

        <button
          type="button"
          onClick={irACitas}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F1E3D] py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_10px_24px_rgba(15,30,61,0.25)] transition hover:bg-[#152953] active:scale-[0.98]"
        >
          <CalendarDays size={15} className="text-[#C9974A]" />
          Ver mis citas
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full py-2 text-xs font-semibold uppercase tracking-widest text-slate-400 transition active:opacity-70"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}