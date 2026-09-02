import { useState } from "react";
import { IdCard, KeyRound, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firebase";

import aurenIsotipo from "/horizontalazul.png";

// TODO: volver a la URL de Render cuando terminemos de testear en local
const API_URL = import.meta.env.VITE_API_URL_LINK;

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
        body: JSON.stringify({ dni: dni.trim(), flujo: "primer_ingreso" }),
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

  const pasosLabels = ["Documento", "Código", "Contraseña"];

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

        {/* Indicador de pasos */}
        <div className="mb-10">
          <div className="flex items-center">
            {pasosLabels.map((label, i) => {
              const step = i + 1;
              const activo = paso >= step;
              return (
                <div key={label} className={`flex items-center ${i > 0 ? "flex-1" : ""}`}>
                  {i > 0 && (
                    <div className={`mx-2 h-[2px] flex-1 rounded-full ${paso > i ? "bg-[#C9974A]" : "bg-[#0F1E3D]/10"}`} />
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                        activo ? "bg-[#C9974A] text-white" : "bg-[#0F1E3D]/5 text-[#0F1E3D]/40"
                      }`}
                    >
                      {activo && paso === step ? (
                        step
                      ) : activo ? (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        step
                      )}
                    </div>
                    <span className={`text-[10px] font-medium tracking-wide ${activo ? "text-[#0F1E3D]" : "text-[#0F1E3D]/40"}`}>
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PASO 1: Ingreso de DNI */}
        {paso === 1 && (
          <form onSubmit={handleSolicitarCodigo}>
            <div className="mb-8 text-left">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F1E3D]">Ingresá tu DNI</h2>
              <p className="mt-2 text-sm font-light text-slate-500">
                Ingresá tu documento para activar tu cuenta.
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
              className="mt-8 w-full rounded-full bg-[#0F1E3D] py-4 text-sm font-semibold tracking-widest text-white uppercase shadow-[0_10px_24px_rgba(15,30,61,0.25)] transition hover:bg-[#152953] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar código"}
            </button>
          </form>
        )}

        {/* PASO 2: Ingreso de Código */}
        {paso === 2 && (
          <form onSubmit={handleVerificarCodigo}>
            <div className="mb-8 text-left">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F1E3D]">Código de verificación</h2>
              <p className="mt-2 text-sm font-light text-slate-500">
                Te enviamos un código a <span className="font-medium text-[#0F1E3D]">{mailEnmascarado || "tu correo"}</span>.
              </p>
            </div>

            <div className="flex items-center gap-3 border-b border-[#0F1E3D]/12 py-4">
              <KeyRound size={20} className="text-[#C9974A]" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Código de 6 dígitos"
                className="w-full bg-transparent text-lg tracking-[0.4em] text-[#0F1E3D] placeholder-slate-300 outline-none"
                required
              />
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-full bg-[#0F1E3D] py-4 text-sm font-semibold tracking-widest text-white uppercase shadow-[0_10px_24px_rgba(15,30,61,0.25)] transition hover:bg-[#152953] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Siguiente"}
            </button>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => handleSolicitarCodigo()}
                disabled={loading}
                className="text-sm font-medium text-[#C9974A] hover:underline"
              >
                Reenviar código
              </button>
            </div>
          </form>
        )}

        {/* PASO 3: Contraseña y Términos */}
        {paso === 3 && (
          <form onSubmit={handleCrearCuenta}>
            <div className="mb-8 text-left">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F1E3D]">Creá tu contraseña</h2>
              <p className="mt-2 text-sm font-light text-slate-500">
                Establecé tu clave para finalizar.
              </p>
            </div>

            <div className="flex items-center gap-3 border-b border-[#0F1E3D]/12 py-4">
              <Lock size={20} className="text-[#C9974A]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crear contraseña"
                className="w-full bg-transparent text-base text-[#0F1E3D] placeholder-slate-400 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-3 border-b border-[#0F1E3D]/12 py-4">
              <Lock size={20} className="text-[#C9974A]" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
                className="w-full bg-transparent text-base text-[#0F1E3D] placeholder-slate-400 outline-none"
                required
              />
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-slate-600">
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

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-full bg-[#0F1E3D] py-4 text-sm font-semibold tracking-widest text-white uppercase shadow-[0_10px_24px_rgba(15,30,61,0.25)] transition hover:bg-[#152953] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Creando cuenta..." : "Finalizar"}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="mt-10 flex items-center justify-center gap-1.5 text-xs font-light text-slate-400">
          <ShieldCheck size={14} className="text-[#C9974A]" />
          Tus datos están protegidos.
        </p>

      </div>
    </div>
  );
}
