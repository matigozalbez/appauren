import { useState, type FormEvent, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import InstallButton from '../components/InstallButton';
import SplashScreen from '../components/SplashScreen';



const API_URL = import.meta.env.VITE_API_URL_LINK;

export default function Login() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [checkingAuth, setCheckingAuth] = useState(true);


const [showSplash] = useState(
  sessionStorage.getItem("auren_splash_shown") !== "true"
);




  useEffect(() => {
  const minDelay = showSplash
    ? new Promise((resolve) => setTimeout(resolve, 2000))
    : Promise.resolve();

  const authCheck = new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      unsubscribe();

      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();

          const res = await fetch(`${API_URL}/api/verificar-vinculacion`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });

          const data = await res.json();

          navigate(
            data.vinculado ? "/home" : "/vincular-dni",
            { replace: true }
          );
        } catch (err) {
          console.error("Error verificando sesión existente:", err);
        }
      }

      resolve();
    });
  });

  Promise.all([minDelay, authCheck]).finally(() => {
    setCheckingAuth(false);

    if (showSplash) {
      sessionStorage.setItem("auren_splash_shown", "true");
    }
  });
}, [navigate, showSplash]);

if (checkingAuth && showSplash) {
  return <SplashScreen />;
}

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home", { replace: true });
    } catch (err: any) {
      console.error('Error de login:', err.code, err.message);
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch(`${API_URL}/api/verificar-vinculacion`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const data = await res.json();
      navigate(data.vinculado ? "/home" : "/vincular-dni",
         { replace: true }
      );

    } catch (err: any) {
      console.error('Error:', err);
      if (err.code === 'auth/popup-blocked') {
        setError("El navegador bloqueó la ventana emergente. Por favor, habilita las ventanas emergentes.");
      } else {
        setError("No se pudo iniciar sesión con Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen-safe w-full items-center justify-center overflow-hidden bg-[#FBF6EC] px-6 font-sans antialiased">
      <div className="mt-4 flex justify-center">
        <div className="absolute right-4 top-4 z-50">
          <InstallButton />
        </div>
      </div>

      {/* franja dorada superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B38033] via-[#DDB268] to-[#B38033]" />

      <div className="relative z-10 flex w-full max-w-[400px] flex-col justify-between py-10">

        {/* ── Marca ── */}
        <div className="mb-10 flex flex-col items-center text-center">
          <img src="auren-isotipo.png" className="mb-4 h-12 w-12" alt="Auren" />
          <span className="font-serif text-5xl font-semibold tracking-tight text-[#0F1E3D]">Auren</span>
          <p className="mt-2 text-xs font-light tracking-wide text-slate-500">
            Tu salud, en un solo lugar.
          </p>
        </div>

        {/* ── Campos ── */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 border-b border-[#0F1E3D]/12 py-4">
            <Mail size={18} className="text-[#C9974A]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full bg-transparent text-base text-[#0F1E3D] placeholder-slate-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 border-b border-[#0F1E3D]/12 py-4">
            <Lock size={18} className="text-[#C9974A]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full bg-transparent text-base text-[#0F1E3D] placeholder-slate-400 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 transition hover:text-[#0F1E3D]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

          <div className="mt-2 text-right">
            <Link to="/recuperar-password" className="text-xs font-medium text-[#C9974A] hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-full bg-[#0F1E3D] py-4 text-sm font-semibold tracking-widest text-white uppercase shadow-[0_10px_24px_rgba(15,30,61,0.25)] transition-all duration-300 hover:bg-[#152953] hover:shadow-[0_14px_30px_rgba(15,30,61,0.3)] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#0F1E3D]/10" />
          <span className="text-xs font-light text-slate-400">o</span>
          <div className="h-px flex-1 bg-[#0F1E3D]/10" />
        </div>

        <button
          type="button"
          onClick={loginWithGoogle}
          aria-label="Continuar con Google"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full transition active:scale-90 hover:scale-105"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs font-light text-slate-500">¿Es tu primera vez?</p>
          <Link
            to="/primer-ingreso"
            className="mt-3 inline-block text-sm font-semibold text-[#C9974A] hover:underline"
          >
            Primer Ingreso
          </Link>
        </div>

      </div>
    </div>
  );
}
