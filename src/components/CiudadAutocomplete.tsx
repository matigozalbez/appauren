import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL_LINK;

interface CiudadResult {
  nombre: string;
  description: string;
  lat?: number;
  lng?: number;
  fuente: string;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const CACHE_KEY = "ciudades_cache_v1";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function claveCache(q: string) {
  return q.trim().toLowerCase().replace(/[áéíóú]/g, (c) =>
    ({ á: "a", é: "e", í: "i", ó: "o", ú: "u" } as Record<string, string>)[c]
  );
}

function leerCacheCiudades(q: string): CiudadResult[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, { ts: number; items: CiudadResult[] }>;
    const entrada = data[claveCache(q)];
    if (!entrada || !Array.isArray(entrada.items)) return null;
    if (Date.now() - entrada.ts > CACHE_TTL_MS) return null;

    return entrada.items;

  } catch {
    return null;
  }
}

function guardarCacheCiudades(q: string, items: CiudadResult[]) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const data = raw ? (JSON.parse(raw) as Record<string, { ts: number; items: CiudadResult[] }>) : {};
    data[claveCache(q)] = { ts: Date.now(), items };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {
      // sin storage disponible
    }
  }
}



export default function CiudadAutocomplete({ value, onChange, placeholder }: Props) {
  const [sugerencias, setSugerencias] = useState<CiudadResult[]>([]);
  const [mostrar, setMostrar] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [sinResultados, setSinResultados] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);



  const buscar = async (q: string) => {
    const cacheadas = leerCacheCiudades(q);
    if (cacheadas) {
      setSugerencias(cacheadas);
      setSinResultados(cacheadas.length === 0);
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

      const res = await fetch(`${API_URL}/api/ciudades/buscar?q=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!res.ok) {
        setSugerencias([]);
        return;
      }

      const data: CiudadResult[] = await res.json();
      const lista = Array.isArray(data) ? data : [];
      guardarCacheCiudades(q, lista);
      setSugerencias(lista);
      setSinResultados(lista.length === 0);
    } catch (error) {
      console.error("Error buscando ciudades:", error);
      setSugerencias([]);
    } finally {
      setBuscando(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange(v);
    setMostrar(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (v.trim().length < 3) {
      setSugerencias([]);
      setBuscando(false);
      setSinResultados(false);
      return;
    }

    debounceRef.current = setTimeout(() => buscar(v.trim()), 400);
  };

  const seleccionar = (s: CiudadResult) => {
    const nombre = s.nombre || s.description.split(",")[0].trim();
    onChange(nombre);
    setMostrar(false);
    setSugerencias([]);
    setSinResultados(false);
  };

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

  const mostrarDropdown =
    mostrar && (sugerencias.length > 0 || buscando || sinResultados);




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
          {buscando && sugerencias.length === 0 && (
            <div className="px-4 py-3 text-xs text-slate-400">
              Buscando ciudades...
            </div>
          )}

          {!buscando && sinResultados && value.trim().length >= 3 && (
            <div className="px-4 py-3 text-xs text-slate-400">
              Sin resultados
            </div>
          )}

          {!buscando &&
            sugerencias.map((s, i) => (
              <button
                key={`${s.description}-${i}`}
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