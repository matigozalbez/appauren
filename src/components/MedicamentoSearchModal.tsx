import { useState, useEffect, useRef } from "react";
import { Search, Tag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMedicamentosDescuento } from "../services/Usemedicamentosdescuento";

interface MedicamentoAPI {
  codigo: string;
  nombre: string;
  laboratorio: string;
  presentacion?: string;
  precio: number;
}

const API_URL = import.meta.env.VITE_API_URL_LINK;

function formatPrecio(precio: number) {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

function SkeletonCard() {
  return (
    <div className="animate-pulse space-y-2 flex-1 bg-[#0F1E3D]/5 rounded-xl p-4">
      <div className="h-4 bg-[#0F1E3D]/10 rounded w-3/4" />
      <div className="h-3 bg-[#0F1E3D]/5 rounded w-1/2" />
    </div>
  );
}

export default function BuscarMedicamentoView() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<MedicamentoAPI[]>([]);
  const [buscando, setBuscando] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { descuentos } = useMedicamentosDescuento();

  useEffect(() => {
    if (!query.trim()) {
      setResultados([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await fetch(`${API_URL}/api/medicamentos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchdata: query }),
        });
        const data: MedicamentoAPI[] = await res.json();
        setResultados(data);
      } catch (err) {
        console.error("Error buscando medicamentos:", err);
      } finally {
        setBuscando(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const getDescuento = (codigo: string) =>
    descuentos.find((d) => d.codigo === codigo);

  return (
    <div className="min-h-screen-safe bg-[#FBF6EC] text-slate-800 pb-32 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

      {/* Header: banner elegante */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFBF3] via-[#FDF5E4] to-[#F8ECD3] px-5 pb-9 pt-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B38033] via-[#DDB268] to-[#B38033]" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#C9974A]/10 blur-2xl" />

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => navigate("/home", { replace: true })}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#0F1E3D] shadow-sm ring-1 ring-[#0F1E3D]/5 backdrop-blur transition active:scale-95"
            style={{ touchAction: "manipulation" }}
          >
            <ArrowLeft size={17} />
          </button>

          <div className="flex flex-1 items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A87B32]">
                Farmacias
              </span>
              <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-[#0F1E3D]">
                Buscar medicamento
              </h1>
            </div>

            <span className="rounded-full bg-[#C9974A]/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#A87B32]">
              Vademecum
            </span>
          </div>
        </div>
      </section>

      <main className="px-5 -mt-4">
        
        {/* Barra de Búsqueda */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9974A]"
          />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: Ibuprofeno"
            className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-[#C9974A]/30 text-base outline-none focus:border-[#C9974A] shadow-sm transition"
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            autoCorrect="off"
            role="presentation"
            data-form-type="other"
          />
        </div>

        {/* Resultados */}
        <div className="space-y-3">
          {buscando &&
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

          {!buscando && resultados.length === 0 && query.trim() && (
            <div className="text-center py-14">
              <p className="text-sm font-medium text-slate-500">
                No encontramos resultados para "{query}"
              </p>
            </div>
          )}

          {!buscando && resultados.length === 0 && !query.trim() && (
            <div className="text-center py-16 px-4">
              <p className="text-sm text-slate-400">
                Escribí el nombre de un medicamento para comenzar la búsqueda.
              </p>
            </div>
          )}

          {!buscando && (
            <div className="divide-y divide-[#C9974A]/25">
              {resultados.map((med) => {
                const descuento = getDescuento(med.codigo);

                // Cálculo de Precio Auren si hay descuento
                let precioAurenFormatted = "-";
                try {
                  if (descuento && typeof descuento.porcentaje === "number" && med.precio) {
                    const precioConDescuento = med.precio * (1 - descuento.porcentaje / 100);
                    precioAurenFormatted = formatPrecio(precioConDescuento);
                  }
                } catch (e) {
                  console.error("Error calculando descuento:", e);
                }

                return (
                  <div
                    key={med.codigo}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="space-y-1 pr-2">
                      <p className="text-sm font-bold text-[#0F1E3D]">
                        {med.nombre} {med.presentacion ? `- ${med.presentacion}` : ""}
                      </p>
                      <p className="text-xs text-slate-400">
                        Laboratorio: <span className="font-medium text-slate-600">{med.laboratorio || "No especificado"}</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        Precio: <span className="font-medium text-slate-600">{med.precio ? formatPrecio(med.precio) : "No disponible"}</span>
                      </p>
                      <p className="text-xs font-bold text-[#C9974A] pt-0.5">
                        Precio Auren: <span className="text-slate-800">{precioAurenFormatted}</span>
                      </p>
                    </div>

                    {descuento && (
                      <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-100 shrink-0">
                        <Tag size={11} />
                        {descuento.porcentaje}% OFF
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}