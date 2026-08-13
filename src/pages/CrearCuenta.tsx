import { useState, type FormEvent } from "react";
import { Mail, Lock, IdCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Asegurate de tener la imagen en tu carpeta public o assets y ajustar el import/ruta si es necesario.
// Para este ejemplo, asumimos que la imagen está en la carpeta public.
import aurenIsotipo from "/horizontalazul.png"; 

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
      // He corregido el error de sintaxis en el string del fetch original
      const res = await fetch("https://backendauren.onrender.com/api/crear-usuario", {
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
    // 1. Contenedor principal: Fondo blanco, centrado vertical y horizontal.
    <div className="flex min-h-screen-safe flex-col justify-center bg-white px-6">
      <div className="mx-auto w-full max-w-sm">
        
        {/* 2. Logo: Reemplazado por la imagen del isotipo. */}
        <div className="mb-10 text-center flex flex-col items-center">
          <img 
            src={aurenIsotipo} 
            alt="Auren Logo" 
            className="mb-3 h-auto w-32 object-contain" 
          />
          <span className="text-xs font-semibold tracking-widest text-[#C9974A] uppercase mt-1">Mi auren</span>
        </div>

        {/* 3. Indicador de pasos: Estilizado para coincidir con la referencia (gris y dorado). */}
        <div className="mb-8 flex items-center justify-center gap-3">
          {/* Paso 1 (Activo) */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9974A] text-base font-semibold text-white">
            1
          </div>
          <div className="h-0.5 w-16 bg-zinc-200" /> {/* Línea divisoria */}
          
          {/* Paso 2 (Inactivo) */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-base font-semibold text-zinc-400">
            2
          </div>
          <div className="h-0.5 w-16 bg-zinc-200" /> {/* Línea divisoria */}
          
          {/* Paso 3 (Inactivo) */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-base font-semibold text-zinc-400">
            3
          </div>
        </div>

        {/* Títulos */}
        <div className="mb-8 text-left">
          <h2 className="text-2xl font-bold text-[#0F1E3D]">Creá tu cuenta</h2>
          <p className="mt-1.5 text-sm text-zinc-600">Ingresá tus datos para comenzar.</p>
        </div>

        {/* 4. Formulario: Inputs con fondo/borde claro y texto oscuro. */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Campo Email */}
          <div className="relative">
            <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-[#0F1E3D] placeholder-zinc-400 outline-none focus:border-[#C9974A]"
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="relative">
            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crear contraseña"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-[#0F1E3D] placeholder-zinc-400 outline-none focus:border-[#C9974A]"
              required
            />
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="relative">
            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-[#0F1E3D] placeholder-zinc-400 outline-none focus:border-[#C9974A]"
              required
            />
          </div>

          {/* Campo DNI */}
          <div className="relative">
            <IdCard size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Tu DNI"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-[#0F1E3D] placeholder-zinc-400 outline-none focus:border-[#C9974A]"
              required
            />
          </div>

          {/* Checkbox Términos */}
          <label className="flex items-start gap-3 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 rounded border-zinc-300 bg-white accent-[#C9974A]"
            />
            <span>
              Acepto los{" "}
              <span className="font-medium text-[#C9974A]">Términos y Condiciones</span> y la{" "}
              <span className="font-medium text-[#C9974A]">Política de Privacidad</span>.
            </span>
          </label>

          {/* Mensaje de Error */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* 5. Botón Continuar: Estilizado con fondo oscuro y texto blanco. */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#0F1E3D] py-4 text-sm font-semibold text-white tracking-wider shadow-md transition-opacity hover:opacity-90 disabled:bg-zinc-400"
          >
            {loading ? "Creando..." : "CONTINUAR"}
          </button>
        </form>

        {/* 6. Pie de página: Texto protegido, más pequeño y sutil. */}
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