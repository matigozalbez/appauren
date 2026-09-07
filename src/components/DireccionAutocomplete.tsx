import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL_LINK;

interface DireccionResult {
  id?: string;
  description: string;
  lat?: number;
  lng?: number;
  place_id?: string;
  fuente: string;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ciudad?: string;
}

const CACHE_KEY = "direcciones_cache_v2";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface CacheEntrada {
  ts: number;
  items: DireccionResult[];
}

function claveCache(ciudad: string, q: string) {
  return `${ciudad.trim().toLowerCase()}|${q.trim().toLowerCase()}`;
}

function leerCacheDirecciones(ciudad: string, q: string): DireccionResult[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, CacheEntrada>;
    const entrada = data[claveCache(ciudad, q)];
    if (!entrada || !Array.isArray(entrada.items)) return null;
    if (Date.now() - entrada.ts > CACHE_TTL_MS) return null;
    return entrada.items.filter((s) => s.fuente !== "ciudad");
  } catch {
    return null;
  }
}

function guardarCacheDirecciones(ciudad: string, q: string, items: DireccionResult[]) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const data = raw ? (JSON.parse(raw) as Record<string, CacheEntrada>) : {};
    data[claveCache(ciudad, q)] = { ts: Date.now(), items };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {
      // sin storage disponible
    }
  }
}

export default function DireccionAutocomplete({
  value,
  onChange,
  placeholder,
  ciudad = "",
}: Props) {
  const [sugerencias, setSugerencias] = useState<DireccionResult[]>([]);
  const [mostrar, setMostrar] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const buscarRef = useRef<(q: string) => Promise<void>>(async () => {});
  const valueRef = useRef(value);
  const ciudadRef = useRef(ciudad);
  valueRef.current = value;
  ciudadRef.current = ciudad;

  const buscar = async (q: string) => {
    if (ciudadRef.current.trim() === "") {
      setSugerencias([]);
      setBuscando(false);
      setAviso("No ingreso ninguna ciudad");
      return;
    }

    const ciudadVal = ciudadRef.current;
    const cacheados = leerCacheDirecciones(ciudadVal, q);
    if (cacheados) {
      setSugerencias(cacheados);
      setAviso(null);
      setBuscando(false);
      return;
    }

    try {
      setBuscando(true);

      const user = auth.currentUser;
      if (!user) {
        setSugerencias([]);
        return;
      }

      const idToken = await user.getIdToken();

      const params = new URLSearchParams({ q });
      const ciudadTrim = ciudadVal.trim();
      if (ciudadTrim) params.set("ciudad", ciudadTrim);

      const res = await fetch(`${API_URL}/api/direcciones/buscar?${params.toString()}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!res.ok) {
        setSugerencias([]);
        return;
      }

      const data: DireccionResult[] = await res.json();
      const lista = (Array.isArray(data) ? data : []).filter(
        (s) => s.fuente !== "ciudad"
      );
      if (lista.length > 0) {
        guardarCacheDirecciones(ciudadVal, q, lista);
      }
      setSugerencias(lista);
      setAviso(null);
    } catch (error) {
      console.error("Error buscando direcciones:", error);
      setSugerencias([]);
    } finally {
      setBuscando(false);
    }
  };
  buscarRef.current = buscar;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange(v);
    setMostrar(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (v.trim().length < 3) {
      setSugerencias([]);
      setBuscando(false);
      setAviso(null);
      return;
    }

    if (ciudadRef.current.trim() === "") {
      setSugerencias([]);
      setBuscando(false);
      setAviso("No ingreso ninguna ciudad");
      return;
    }

    setAviso(null);
    debounceRef.current = setTimeout(() => buscar(v.trim()), 400);
  };

  const seleccionar = (s: DireccionResult) => {
    onChange(s.description);
    setMostrar(false);
    setSugerencias([]);
    setAviso(null);
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = valueRef.current.trim();

    if (q.length < 3) {
      setAviso(null);
      return;
    }

    if (ciudadRef.current.trim() === "") {
      setSugerencias([]);
      setBuscando(false);
      setAviso("No ingreso ninguna ciudad");
      setMostrar(true);
      return;
    }

    setAviso(null);
    setMostrar(true);
    debounceRef.current = setTimeout(() => buscarRef.current(q), 400);
  }, [ciudad]);

  useEffect(() => {
    const onClickFuera = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setMostrar(false);
      }
    };
    document.addEventListener("mousedown", onClickFuera);
    return () => document.removeEventListener("mousedown", onClickFuera);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const mostrarDropdown = mostrar && (sugerencias.length > 0 || buscando || aviso !== null);

  return (
    <div ref={contenedorRef} className="relative">
      <div className="relative">
        <MapPin
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9974A]"
        />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-2xl border border-[#C9974A]/30 bg-white py-3.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#C9974A]"
        />
      </div>

      {mostrarDropdown && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-[#C9974A]/30 bg-white shadow-lg">
          {buscando && sugerencias.length === 0 && !aviso && (
            <div className="px-4 py-3 text-xs text-slate-400">
              Buscando direcciones...
            </div>
          )}

          {aviso && (
            <div className="px-4 py-3 text-xs text-slate-400">{aviso}</div>
          )}

          {!buscando && !aviso && sugerencias.length === 0 && value && (
            <div className="px-4 py-3 text-xs text-slate-400">
              Sin resultados
            </div>
          )}

          {!buscando &&
            sugerencias.map((s, i) => (
              <button
                key={s.id || `${s.description}-${i}`}
                type="button"
                onClick={() => seleccionar(s)}
                className="flex w-full items-start gap-2 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-[#C9974A]/10"
              >
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#C9974A]" />
                <span className="leading-snug">{s.description}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}