import { useState } from "react";
import { IdCard, KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firebase";

import aurenIsotipo from "/horizontalazul.png";

// TODO: volver a la URL de Render cuando terminemos de testear en local
const API_URL = "https://backendauren.onrender.com";

export default function PrimerIngreso() {
  const navigate = useNavigate();

  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [dni, setDni] = useState("");
  const [mailEnmascarado, setMailEnmascarado] = useState("");

  const [codigo, setCodigo] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const handleSolicitarCodigo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    if (!dni.trim()) {
      setError("Ingresá tu DNI");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/afiliados/solicitar-codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni: dni.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No pudimos enviar el código");

      setMailEnmascarado(data.mailEnmascarado || "");
      setPaso(2);
    } catch (err: any) {
      setError(err.message || "Ese DNI no está registrado. Verificalo o contactá a soporte.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificarCodigo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    if (codigo.trim().length !== 6) {
      setError("El código tiene 6 dígitos");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/afiliados/verificar-codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni: dni.trim(), codigo: codigo.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.verificado) throw new Error(data.error || "Código incorrecto");

      setPaso(3);
    } catch (err: any) {
      setError(err.message || "Código incorrecto o vencido");
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCuenta = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!aceptaTerminos) {
      setError("Tenés que aceptar los Términos y Condiciones para continuar");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/afiliados/crear-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni: dni.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No pudimos crear tu cuenta");

      if (data.customToken) {
        await signInWithCustomToken(auth, data.customToken);
      }

      navigate("/home");
    } catch (err: any) {
      setError(err.message || "No pudimos crear tu cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen-safe flex-col justify-center bg-white px-6">
      <div className="mx-auto w-full max-w-sm">

        {/* Logo e Isotipo */}
        <div className="mb-10 text-center flex flex-col items-center">
          <img 
            src={aurenIsotipo} 
            alt="Auren Logo" 
            className="mb-3 h-auto w-32 object-contain" 
          />
          <span className="text-xs font-semibold tracking-widest text-[#C9974A] uppercase mt-1">Primer Ingreso</span>
        </div>

        {/* Indicador de pasos */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-base font-semibold ${
            paso >= 1 ? "bg-[#C9974A] text-white" : "bg-zinc-100 text-zinc-400"
          }`}>
            1
          </div>
          <div className={`h-0.5 w-16 ${paso >= 2 ? "bg-[#C9974A]" : "bg-zinc-200"}`} />

          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-base font-semibold ${
            paso >= 2 ? "bg-[#C9974A] text-white" : "bg-zinc-100 text-zinc-400"
          }`}>
            2
          </div>
          <div className={`h-0.5 w-16 ${paso >= 3 ? "bg-[#C9974A]" : "bg-zinc-200"}`} />

          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-base font-semibold ${
            paso >= 3 ? "bg-[#C9974A] text-white" : "bg-zinc-100 text-zinc-400"
          }`}>
            3
          </div>
        </div>

        {/* PASO 1: Ingreso de DNI */}
        {paso === 1 && (
          <form onSubmit={handleSolicitarCodigo} className="space-y-5">
            <div className="text-left mb-6">
              <h2 className="text-2xl font-bold text-[#0F1E3D]">Ingresá tu DNI</h2>
              <p className="mt-1.5 text-sm text-zinc-600">
                Ingresá tu número de documento para activar tu cuenta.
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
              {loading ? "ENVIANDO..." : "ENVIAR CÓDIGO"}
            </button>
          </form>
        )}

        {/* PASO 2: Ingreso de Código */}
        {paso === 2 && (
          <form onSubmit={handleVerificarCodigo} className="space-y-5">
            <div className="text-left mb-6">
              <h2 className="text-2xl font-bold text-[#0F1E3D]">Código de Verificación</h2>
              <p className="mt-1.5 text-sm text-zinc-600">
                Te enviamos un código a <span className="font-medium text-[#0F1E3D]">{mailEnmascarado || "tu correo"}</span>.
              </p>
            </div>

            <div className="relative">
              <KeyRound size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Código de 6 dígitos"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-[#0F1E3D] placeholder-zinc-400 outline-none focus:border-[#C9974A] tracking-widest"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#0F1E3D] py-4 text-sm font-semibold text-white tracking-wider shadow-md transition-opacity hover:opacity-90 disabled:bg-zinc-400"
            >
              {loading ? "VERIFICANDO..." : "SIGUIENTE"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => handleSolicitarCodigo()}
                disabled={loading}
                className="text-xs font-medium text-[#C9974A] hover:underline"
              >
                Reenviar código
              </button>
            </div>
          </form>
        )}

        {/* PASO 3: Contraseña y Términos */}
        {paso === 3 && (
          <form onSubmit={handleCrearCuenta} className="space-y-5">
            <div className="text-left mb-6">
              <h2 className="text-2xl font-bold text-[#0F1E3D]">Creá tu contraseña</h2>
              <p className="mt-1.5 text-sm text-zinc-600">
                Establecé tu clave de acceso para finalizar la activación.
              </p>
            </div>

            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crear contraseña"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-12 text-[#0F1E3D] placeholder-zinc-400 outline-none focus:border-[#C9974A]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-[#0F1E3D] placeholder-zinc-400 outline-none focus:border-[#C9974A]"
                required
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-zinc-600 cursor-pointer">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 rounded border-zinc-300 bg-white accent-[#C9974A]"
              />
              <span>
                Acepto los{" "}
                <span className="font-medium text-[#C9974A]">Términos y Condiciones</span> y la{" "}
                <span className="font-medium text-[#C9974A]">Política de Privacidad</span>.
              </span>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#0F1E3D] py-4 text-sm font-semibold text-white tracking-wider shadow-md transition-opacity hover:opacity-90 disabled:bg-zinc-400"
            >
              {loading ? "CREANDO CUENTA..." : "FINALIZAR"}
            </button>
          </form>
        )}

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