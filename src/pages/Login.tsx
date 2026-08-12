import { useState, type FormEvent, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import {
    getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,

} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import InstallButton from '../components/InstallButton';
import SplashScreen from '../components/SplashScreen';


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  

const [checkingAuth, setCheckingAuth] = useState(true);

useEffect(() => {
  getRedirectResult(auth)
    .then(async (result) => {
      if (result) {
        const idToken = await result.user.getIdToken();
        const res = await fetch("https://backendauren.onrender.com/api/verificar-vinculacion", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        navigate(data.vinculado ? "/home" : "/vincular-dni");
      }
    })
    .catch((err) => {
      console.error('Error en redirect de Google:', err);
    })
    .finally(() => setCheckingAuth(false));
}, [navigate]);

if (checkingAuth) {
  return (
  <SplashScreen/>
  );
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
    // 1. Forzamos el uso de un popup. 
    // En iOS, el truco es que el popup sea invocado DIRECTAMENTE 
    // sin procesos asíncronos previos.
    const result = await signInWithPopup(auth, googleProvider);
    
    // 2. Aquí ya tenemos el usuario, el popup ya se abrió y se cerró solo al loguear.
    const idToken = await result.user.getIdToken();

    const res = await fetch("https://backendauren.onrender.com/api/verificar-vinculacion", {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    
    const data = await res.json();
    navigate(data.vinculado ? "/home" : "/vincular-dni");
    
  } catch (err: any) {
    console.error('Error:', err);
    // Solo si el error es porque el popup fue bloqueado, informamos
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
    <div className="relative flex  min-h-screen-safe w-full items-center justify-center bg-[#071328] overflow-hidden font-sans antialiased px-6">
<div className="mt-4 flex justify-center">
         <div className="absolute top-4 right-4 z-50">
        <InstallButton/>
      </div>

</div>
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-sky-500/15 rounded-full blur-[130px]" />

      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-36 z-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 150"
          className="absolute bottom-0 w-full h-full fill-white/[0.07] drop-shadow-[0_-4px_12px_rgba(255,255,255,0.08)]"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C400,130 1040,130 1440,60 L1440,150 L0,150 Z"></path>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[340px] flex flex-col justify-between py-6">

        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-2">

<img src="/auren-isotipo.png" className="h-8 w-8" alt="Auren" />
            <span className="text-4xl font-serif text-white tracking-tight">Auren</span>
          </div>
          
          <h1 className="text-xs font-semibold tracking-widest text-[#C9974A] uppercase mt-1">Mi Auren</h1>
          <div className="my-2.5 h-[1px] w-20 bg-[#C9974A]/50 mx-auto" />
          <p className="text-xs text-slate-300 font-light">Todo resuelto, en un solo lugar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pl-11 pr-4 text-xs text-white placeholder-slate-400 outline-none transition duration-200 focus:border-[#C9974A] focus:bg-white/10"
            />
          </div>

          <div className="relative">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pl-11 pr-11 text-xs text-white placeholder-slate-400 outline-none transition duration-200 focus:border-[#C9974A] focus:bg-white/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {error && <p className="text-[11px] text-red-400">{error}</p>}

          <div className="text-right pt-0.5">
            <a href="#" className="text-[11px] text-[#C9974A] hover:underline font-light">¿Olvidaste tu contraseña?</a>
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
          <div className="h-px flex-1 bg-white/15" />
          <span className="text-[11px] text-slate-400 font-light">o</span>
          <div className="h-px flex-1 bg-white/15" />
        </div>

        <button
          type="button"
          onClick={loginWithGoogle}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white py-3 text-xs font-semibold text-slate-900 transition hover:bg-slate-50 active:scale-[0.99] shadow-md"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Ingresar con Google
        </button>

        <div className="mt-5 text-center">
          <p className="text-xs text-slate-300 font-light mb-2">¿Es tu primera vez?</p>
          <Link
            to="/crear-cuenta"
            className="block w-full rounded-2xl border border-[#C9974A]/80 py-3 text-center text-xs font-bold tracking-widest text-[#C9974A] uppercase transition hover:bg-[#C9974A]/10 active:scale-[0.99]"
          >
            CREAR MI ACCESO
          </Link>
        </div>

        <div className="relative mt-5 flex justify-center z-10 text-[#C9974A] drop-shadow-[0_0_10px_rgba(201,151,74,0.9)]">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

      </div>
    </div>
  );
}