import { useState, type FormEvent } from "react";
import { Mail, Lock, IdCard } from "lucide-react";
import { useNavigate } from "react-router-dom";



export default function CrearCuenta() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [dni, setDni] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("Las contraseñas no coinciden.");
    return;
  }
  if (!acceptedTerms) {
    setError("Tenés que aceptar los Términos y Condiciones.");
    return;
  }
  if (!dni) {
    setError("Ingresá tu DNI.");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("http://localhost:8080/api/crear-usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, dni }),
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || "No se pudo crear la cuenta.");
      return;
    }

    navigate("/terminos");
  } catch {
    setError("Error de conexión.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen-safe flex-col justify-center bg-[#0F1E3D] px-6">
      <div className="mx-auto w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <span className="text-2xl">💛</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Mi Auren</h1>
        </div>

        {/* Indicador de pasos */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C9974A] text-sm font-semibold text-[#0F1E3D]">
            1
          </div>
          <div className="h-px w-10 bg-white/20" />
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/50">
            2
          </div>
          <div className="h-px w-10 bg-white/20" />
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/50">
            3
          </div>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-white">Creá tu cuenta</h2>
          <p className="mt-1 text-sm text-white/60">Ingresá tus datos para comenzar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 outline-none focus:border-[#C9974A]"
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crear contraseña"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 outline-none focus:border-[#C9974A]"
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 outline-none focus:border-[#C9974A]"
            />
          </div>

          <div className="relative">
  <IdCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
  <input
    type="text"
    value={dni}
    onChange={(e) => setDni(e.target.value)}
    placeholder="Tu DNI"
    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 outline-none focus:border-[#C9974A]"
  />
</div>

          <label className="flex items-start gap-2 text-xs text-white/60">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-[#C9974A]"
            />
            <span>
              Acepto los <span className="text-[#C9974A]">Términos y Condiciones</span> y la{" "}
              <span className="text-[#C9974A]">Política de Privacidad</span>.
            </span>
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading}>
  {loading ? "Creando..." : "CONTINUAR"}
</button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">🔒 Tus datos están protegidos.</p>
      </div>
    </div>
  );
}