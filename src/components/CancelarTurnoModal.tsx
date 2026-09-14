import { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, X } from "lucide-react";

import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL_LINK;

interface Cita {
  id: string;
}

interface CancelarTurnoModalProps {
  cita: Cita;
  esEstudio?: boolean;
  onClose: () => void;
  onCancelada: () => void;
}

export default function CancelarTurnoModal({
  cita,
  esEstudio,
  onClose,
  onCancelada,
}: CancelarTurnoModalProps) {
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const palabra = esEstudio ? "estudio" : "turno";

  const puedeCancelar = !enviando && motivo.trim().length > 0;

  const cancelar = async () => {
    if (!puedeCancelar) return;

    setEnviando(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Tenés que iniciar sesión");
        return;
      }

      const idToken = await user.getIdToken();

      const res = await fetch(`${API_URL}/api/mis-turnos/cancelar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ turnoId: cita.id, motivo }),
      });

      if (!res.ok) {
        const text = await res.text();
        let mensaje = `No se pudo cancelar el ${palabra}`;
        try {
          const parsed = JSON.parse(text);
          if (parsed && parsed.mensaje) mensaje = parsed.mensaje;
        } catch {
          if (text) mensaje = text;
        }
        setError(mensaje);
        return;
      }

      onCancelada();
    } catch (error) {
      console.error("Error cancelando turno:", error);
      setError("Error de conexión, intentá de nuevo");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-[#0F1E3D]/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="badge-pop relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition active:scale-95"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle size={26} className="text-red-600" />
        </div>

        <h2 className="mt-4 text-center font-serif text-lg font-semibold text-[#0F1E3D]">
          ¿Cancelar este {palabra}?
        </h2>

        <p className="mt-1.5 text-center text-xs leading-relaxed text-slate-500">
          Contanos qué pasó. Tu aviso le llega al equipo y liberás tu{" "}
          {palabra} del mes.
        </p>

        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder={`¿Por qué cancelás el ${palabra}?`}
          rows={4}
          maxLength={300}
          className="mt-4 w-full resize-none rounded-2xl border border-[#C9974A]/30 bg-white px-4 py-3.5 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
        />

        {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}

        <button
          type="button"
          disabled={!puedeCancelar}
          onClick={cancelar}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#BB1E1E] py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_10px_24px_rgba(187,30,30,0.25)] transition hover:bg-[#a51a1a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CalendarDays size={14} />
          {enviando ? "Cancelando..." : "Confirmar cancelación"}
        </button>

        <button
          type="button"
          onClick={onClose}
          disabled={enviando}
          className="mt-2 w-full py-2 text-xs font-semibold uppercase tracking-widest text-slate-400 transition active:opacity-70"
        >
          Volver
        </button>
      </div>
    </div>
  );
}