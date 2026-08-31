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
      navigate('/home');
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
      navigate(data.vinculado ? "/home" : "/vincular-dni");

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
    <div className="relative flex min-h-screen-safe w-full items-center justify-center bg-gradient-to-b from-[#FDFBF7] via-[#FBF6EC] to-[#F5EAD2] overflow-hidden font-sans antialiased px-6">
      <div className="mt-4 flex justify-center">
        <div className="absolute top-4 right-4 z-50">
          <InstallButton />
        </div>
      </div>

      {/* Glow superior, ahora en tono dorado suave para que se note sobre el fondo claro */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-[#C9974A]/20 rounded-full blur-[130px]" />

      {/* Ola inferior, ahora en navy bien tenue en vez de blanco translúcido */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-36 z-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 150"
          className="absolute bottom-0 w-full h-full fill-[#0F1E3D]/[0.05]"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C400,130 1040,130 1440,60 L1440,150 L0,150 Z"></path>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[340px] flex flex-col justify-between py-6">

        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <img 
  src="data:image/png;base64,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" 
  className="h-8 w-8" 
  alt="Auren" 
/>
            <span className="text-4xl font-serif text-[#0F1E3D] tracking-tight">Auren</span>
          </div>

          <h1 className="text-xs font-semibold tracking-widest text-[#C9974A] uppercase mt-1">Mi Auren</h1>
          <div className="my-2.5 h-[1px] w-20 bg-[#C9974A]/50 mx-auto" />
          <p className="text-xs text-slate-500 font-light">Todo resuelto, en un solo lugar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full rounded-2xl border border-[#0F1E3D]/10 bg-white py-3.5 pl-11 pr-4 text-xs text-[#0F1E3D] placeholder-slate-400 outline-none transition duration-200 focus:border-[#C9974A] focus:bg-white shadow-sm"
            />
          </div>

          <div className="relative">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full rounded-2xl border border-[#0F1E3D]/10 bg-white py-3.5 pl-11 pr-11 text-xs text-[#0F1E3D] placeholder-slate-400 outline-none transition duration-200 focus:border-[#C9974A] focus:bg-white shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F1E3D] transition"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {error && <p className="text-[11px] text-red-500">{error}</p>}

        <div className="text-right pt-0.5">
  <Link to="/recuperar-password" className="text-[11px] text-[#C9974A] hover:underline font-light">
    ¿Olvidaste tu contraseña?
  </Link>
</div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-[#DAB062] via-[#C9974A] to-[#B38033] py-3.5 text-xs font-bold tracking-widest text-[#071328] uppercase shadow-[0_4px_20px_rgba(201,151,74,0.35)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'INGRESAR'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#0F1E3D]/10" />
          <span className="text-[11px] text-slate-400 font-light">o</span>
          <div className="h-px flex-1 bg-[#0F1E3D]/10" />
        </div>
<button
  type="button"
  onClick={loginWithGoogle}
  className="flex justify-center py-1 transition active:scale-[0.95]"
>
  <svg className="w-7 h-7" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
</button>

        <div className="mt-5 text-center">
          <p className="text-xs text-slate-500 font-light mb-2">¿Es tu primera vez?</p>
          <Link
            to="/primer-ingreso"
            className="block w-full rounded-2xl border border-[#C9974A]/80 py-3 text-center text-xs font-bold tracking-widest text-[#C9974A] uppercase transition hover:bg-[#C9974A]/10 active:scale-[0.99]"
          >
            PRIMER INGRESO
          </Link>
        </div>

        <div className="relative mt-5 flex justify-center z-10 text-[#C9974A] drop-shadow-[0_0_6px_rgba(201,151,74,0.5)]">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

      </div>
   

    </div>
  );
}