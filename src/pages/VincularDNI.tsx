import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { IdCard, ShieldCheck, ArrowRight } from "lucide-react";
import { auth } from "../firebase";

import aurenIsotipo from "/horizontalazul.png";
const API_URL = import.meta.env.VITE_API_URL_LINK;
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
      const res = await fetch(`${API_URL}/api/vincular-socio`, {
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
    <div className="relative flex min-h-screen-safe flex-col justify-center overflow-hidden bg-[#FBF6EC] px-6 font-sans antialiased">
      {/* franja dorada superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B38033] via-[#DDB268] to-[#B38033]" />

      <div className="relative z-10 mx-auto w-full max-w-[400px] py-10">

        {/* Logo */}
        <div className="mb-9 flex flex-col items-center text-center">
          <img
            src={aurenIsotipo}
            alt="Auren Logo"
            className="mb-2 h-auto w-36 object-contain"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-8 text-left">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F1E3D]">Un último paso</h2>
            <p className="mt-2 text-sm font-light text-slate-500">
              Ingresá tu DNI para vincular tu cuenta con tu afiliación.
            </p>
          </div>

          <div className="flex items-center gap-3 border-b border-[#0F1E3D]/12 py-4">
            <IdCard size={20} className="text-[#C9974A]" />
            <input
              type="text"
              inputMode="numeric"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Tu DNI"
              className="w-full bg-transparent text-base text-[#0F1E3D] placeholder-slate-400 outline-none"
              required
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F1E3D] py-4 text-sm font-semibold tracking-widest text-white uppercase shadow-[0_10px_24px_rgba(15,30,61,0.25)] transition hover:bg-[#152953] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Validando..." : (
              <>
                Continuar
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-10 flex items-center justify-center gap-1.5 text-xs font-light text-slate-400">
          <ShieldCheck size={14} className="text-[#C9974A]" />
          Tus datos están protegidos.
        </p>

      </div>
    </div>
  );
}
