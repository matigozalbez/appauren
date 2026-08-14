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

const SEARCH_ENDPOINT = "http://127.0.0.1:8080/api/medicamentos";

function formatPrecio(precio: number) {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

function SkeletonCard() {
  return (
    <div className="animate-pulse flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function BuscarMedicamentoView() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<MedicamentoAPI[]>([]);
  const [buscando, setBuscando] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
  const { descuentos } = useMedicamentosDescuento();
*/
// Nos aseguramos de que sessionStorage nunca esté vacío
// Si hay algo guardado lo usa, si es null o vacío, le encaja "right" por defecto al toque
  const direction = sessionStorage.getItem("nav_direction") || "right";
  const animationClass = direction === "right" ? "animate-slide-right" : "animate-slide-left";

  useEffect(() => {
    if (!query.trim()) {
      setResultados([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await fetch(SEARCH_ENDPOINT, {
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
    <div className={`min-h-screen-safe bg-slate-50 text-slate-800 pb-32 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${animationClass}`}>
      
      {/* Header Estilo Perfil */}
      <div className="pt-8 pb-6 px-6 border-b border-slate-200 bg-[#0F1E3D] flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="text-white/80 hover:text-white transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center justify-between flex-1">
          <span>Buscar medicamento</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#C9974A]/20 text-[#C9974A] border border-[#C9974A]/30">
            Vademecum
          </span>
        </h1>
      </div>

      <div className="px-6 pt-6 space-y-6">
        
        {/* Barra de Búsqueda */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: Ibuprofeno"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-base outline-none focus:border-[#0F1E3D] shadow-sm transition"
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
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
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

          {!buscando &&
            resultados.map((med) => {
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
                  className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-slate-200 transition"
                >
                  <div className="space-y-1 pr-2">
                    <p className="text-sm font-bold text-[#0F1E3D]">
                      {med.nombre} {med.presentacion ? `- ${med.presentacion}` : ""}
                    </p>
                    <p className="text-xs text-slate-400">
                      Laboratorio: <span className="font-medium text-slate-600">{med.laboratorio || "No especificado"}</span>
                    </p>
                 <p className="text-xs text-slate-400">
  Precio: <span className="font-medium text-slate-600">${med.precio ? formatPrecio(med.precio) : "No disponible"}</span>
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
      </div>
    </div>
  );
}