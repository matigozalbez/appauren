import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

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
      const res = await fetch("http://localhost:8080/api/vincular-socio", {
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F1E3D] px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-bold text-white">Un último paso</h1>
        <p className="mt-2 text-sm text-white/60">
          Ingresá tu DNI para vincular tu cuenta con tu afiliación.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Tu DNI"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-white placeholder-white/40 outline-none focus:border-[#C9974A]"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#C9974A] py-3 font-semibold text-[#0F1E3D] disabled:opacity-50"
          >
            {loading ? "Validando..." : "CONTINUAR"}
          </button>
        </form>
      </div>
    </div>
  );
}