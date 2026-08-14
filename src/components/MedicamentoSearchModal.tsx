import { useState, useEffect, useRef } from "react";
import { X, Search, Tag } from "lucide-react";
import { useMedicamentosDescuento } from "../services/Usemedicamentosdescuento";


interface MedicamentoAPI {
  codigo: string;
  nombre: string;
  laboratorio: string;
  presentacion?: string;
  precio: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
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
    <div className="animate-pulse flex items-center justify-between bg-slate-100 rounded-lg p-3">
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-slate-300 rounded w-3/4" />
        <div className="h-2 bg-slate-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function MedicamentoSearchModal({ isOpen, onClose }: Props) {
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

  if (!isOpen) return null;

  const getDescuento = (codigo: string) =>
    descuentos.find((d) => d.codigo === codigo);

  // CORRECCIÓN: document.body va fuera del JSX, como segundo parámetro del createPortal
  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="font-semibold text-[#0F1E3D]">Buscar medicamento</h2>
          <button onClick={onClose} className="text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: Ibuprofeno"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm outline-none focus:border-[#0F1E3D]"
              autoCapitalize="off"
              autoComplete="off"
              spellCheck="false"
              autoCorrect="off"
            />
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {buscando &&
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

          {!buscando && resultados.length === 0 && query.trim() && (
            <p className="text-sm text-slate-400 text-center py-6">
              No encontramos resultados
            </p>
          )}

          {!buscando &&
            resultados.map((med) => {
              const descuento = getDescuento(med.codigo);
              return (
                <div
                  key={med.codigo}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100"
                >
                  <div>
                    <p className="text-sm font-medium text-[#0F1E3D]">
                      {med.nombre}
                    </p>
                    <p className="text-xs text-slate-400">
                      {med.laboratorio}
                    </p>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      {formatPrecio(med.precio)}
                    </p>
                  </div>
                  {descuento && (
                    <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">
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