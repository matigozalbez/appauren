import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { IdCard } from "lucide-react";
import { auth } from "../firebase";

import aurenIsotipo from "/horizontalazul.png";

export default function VincularDNI() {
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch("https://backendauren.onrender.com/api/vincular-socio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ dni }),
      });

      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "No se pudo validar el DNI.");
        return;
      }

      navigate("/home");
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen-safe flex-col justify-center bg-gradient-to-b from-[#FDFBF7] via-[#FBF6EC] to-[#F5EAD2] px-6">
      <div className="mx-auto w-full max-w-sm">

        {/* Logo e Isotipo */}
        <div className="mb-10 text-center flex flex-col items-center">
          <img 
            src={aurenIsotipo} 
            alt="Auren Logo" 
            className="mb-3 h-auto w-32 object-contain" 
          />
          <span className="text-xs font-semibold tracking-widest text-[#C9974A] uppercase mt-1">Vinculación</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left mb-6">
            <h2 className="text-2xl font-bold text-[#0F1E3D]">Un último paso</h2>
            <p className="mt-1.5 text-sm text-zinc-600">
              Ingresá tu DNI para vincular tu cuenta con tu afiliación.
            </p>
          </div>

          <div className="relative">
            <IdCard size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              inputMode="numeric"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Tu DNI"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-[#0F1E3D] placeholder-zinc-400 outline-none focus:border-[#C9974A]"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#0F1E3D] py-4 text-sm font-semibold text-white tracking-wider shadow-md transition-opacity hover:opacity-90 disabled:bg-zinc-400"
          >
            {loading ? "VALIDANDO..." : "CONTINUAR"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-zinc-400 flex items-center justify-center gap-1.5">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-[#C9974A]"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Tus datos están protegidos.
        </p>

      </div>
    </div>
  );
}