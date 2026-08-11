import { ChevronLeft, FileCheck, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TerminosCondiciones() {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

const handleAceptar = () => {
  if (!accepted) return;
  navigate("/home");
};

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-slate-700">
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-base font-semibold text-slate-900">Términos y Condiciones</h1>
      </div>
      <div className="mt-1 h-0.5 w-16 bg-[#C9974A]" />

      {/* Contenido central */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-[#0F1E3D]/5">
          <div className="relative">
            <FileCheck size={56} className="text-[#0F1E3D]" strokeWidth={1.3} />
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#C9974A]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900">Un último paso</h2>
        <p className="mt-2 max-w-xs text-sm text-slate-500">
          Leé y aceptá los términos para acceder a tu cuenta.
        </p>

        <button className="mt-6 flex items-center gap-2 rounded-full bg-[#0F1E3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16264d]">
          VER TÉRMINOS Y CONDICIONES
          <ExternalLink size={14} />
        </button>
      </div>

      {/* Checkbox + botón final */}
      <div className="pb-4">
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#C9974A]"
          />
          <span>
            He leído y acepto los <span className="font-medium text-[#0F1E3D]">Términos y Condiciones</span>.
          </span>
        </label>

        <button
          onClick={handleAceptar}
          disabled={!accepted}
          className="mt-4 w-full rounded-full bg-[#C9974A] py-3 font-semibold text-[#0F1E3D] transition hover:bg-[#d9a75a] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ACEPTAR E INGRESAR
        </button>
      </div>
    </div>
  );
}