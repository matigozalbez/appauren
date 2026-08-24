import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL_LINK;

interface Beneficio {
  clave: string;
  titulo: string;
  descripciones: string[];
}

interface CatalogoPlan {
  nombre: string;
  beneficios: Beneficio[];
}

interface PlanSocio {
  nombre: string;
  estado: string;
}

interface Socio {
  planes?: PlanSocio[];
  beneficios?: Record<string, unknown>;
}

// Borde tipo "ticket / póliza" — se construye una sola vez, no depende de datos.
const TEETH = 30;
const ZIGZAG_CLIP_PATH = `polygon(0% 0%, 100% 0%, ${Array.from(
  { length: TEETH + 1 },
  (_, i) => {
    const x = 100 - (i / TEETH) * 100;
    const y = i % 2 === 0 ? 100 : 55;
    return `${x}% ${y}%`;
  }
).join(", ")})`;

// Cache simple por plan — datos públicos del catálogo, no dependen del socio.
const cacheKey = (plan?: string) => (plan ? `auren_detalle_plan_${plan}` : null);

function leerCache(plan?: string): CatalogoPlan | null {
  const key = cacheKey(plan);
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as CatalogoPlan) : null;
  } catch {
    return null;
  }
}

export default function DetallePlan() {
  const [user] = useAuthState(auth);
  const { plan } = useParams<{ plan: string }>();

  const [socio, setSocio] = useState<Socio | null>(null);
  const [catalogo, setCatalogo] = useState<CatalogoPlan | null>(() => leerCache(plan));
  const [cargando, setCargando] = useState(() => !leerCache(plan));
  const [revalidando, setRevalidando] = useState(false);
  const [error, setError] = useState("");

  // Tipografía: Fraunces (display, con carácter, para el nombre del plan y
  // los números de cláusula) + Inter (texto). Se inyecta una sola vez.
  useEffect(() => {
    if (document.getElementById("detalle-plan-fonts")) return;
    const link = document.createElement("link");
    link.id = "detalle-plan-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  console.log(socio);

  useEffect(() => {
    const teniaCache = leerCache(plan) !== null;

    const cargarDetalle = async () => {
      try {
        setError("");
        if (teniaCache) {
          setRevalidando(true);
        } else {
          setCargando(true);
        }

        if (!user) {
          setError("Usuario no autenticado");
          return;
        }

        if (!plan) {
          setError("No se especificó el plan");
          return;
        }

        const idToken = await user.getIdToken();

        // 1. Obtener información del socio
        const resSocio = await fetch(`${API_URL}/api/mi-socio`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!resSocio.ok) {
          throw new Error("No se pudo obtener la información del socio");
        }

        const dataSocio = await resSocio.json();

        // 2. Verificar que tenga este plan
        const tienePlan = (dataSocio.planes || []).some(
          (p: PlanSocio) => p.nombre === plan && p.estado === "activo"
        );

        if (!tienePlan) {
          throw new Error("No tenés contratado este plan");
        }

        setSocio(dataSocio);

        // 3. Obtener beneficios del catálogo
        const resCatalogo = await fetch(
          `${API_URL}/api/planes/detalle?nombre=${encodeURIComponent(plan)}`
        );

        if (!resCatalogo.ok) {
          throw new Error("No se pudo obtener el catálogo del plan");
        }

        const dataCatalogo: CatalogoPlan = await resCatalogo.json();

        setCatalogo(dataCatalogo);

        const key = cacheKey(plan);
        if (key) {
          try {
            localStorage.setItem(key, JSON.stringify(dataCatalogo));
          } catch {
            // localStorage lleno o no disponible — no es crítico, seguimos igual
          }
        }
      } catch (err) {
        console.error("Error cargando detalle del plan:", err);

        // Si había algo cacheado pero ahora falla (p. ej. perdió el plan),
        // no dejamos el dato viejo mostrado como si fuera vigente.
        const key = cacheKey(plan);
        if (key) {
          try {
            localStorage.removeItem(key);
          } catch {
            // no-op
          }
        }
        setCatalogo(null);

        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar el detalle del plan"
        );
      } finally {
        setCargando(false);
        setRevalidando(false);
      }
    };

    cargarDetalle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, plan]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-[#FBF6EC] to-[#F5EAD2]">
      {/* ── Header fijo, edge-to-edge — ya no "flota" en el contenido ── */}
      <header className="sticky top-0 z-20 bg-gradient-to-br from-[#0F1E3D] via-[#152953] to-[#0A1429] shadow-lg shadow-[#0F1E3D]/10">
        <div className="mx-auto max-w-2xl px-4 pb-7 pt-6 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-[#C9974A]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C9974A]">
              Tu cobertura
            </p>
          </div>

          <h1
            className="mt-3 text-[1.9rem] leading-[1.1] text-white sm:text-[2.3rem]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            {plan}
          </h1>

          <div className="mt-4 flex min-h-[18px] flex-wrap items-center gap-x-5 gap-y-2">
            {catalogo && (
              <>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Plan activo
                </span>
                <span className="text-xs font-medium text-white/50">
                  {catalogo.beneficios.length}{" "}
                  {catalogo.beneficios.length === 1
                    ? "beneficio incluido"
                    : "beneficios incluidos"}
                </span>
                {revalidando && (
                  <span className="text-[11px] font-medium text-white/35">
                    Actualizando…
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Borde dentado pegado al header — se mueve con él al hacer sticky */}
        <div
          className="h-3 bg-[#0A1429]"
          style={{ clipPath: ZIGZAG_CLIP_PATH }}
          aria-hidden="true"
        />
      </header>

      {/* ── Cuerpo: documento de beneficios, scrollea debajo del header ── */}
      <main className="mx-auto max-w-2xl px-4 pb-14 pt-8 sm:px-6">
        {cargando && !catalogo && <BeneficiosEsqueleto />}

        {!cargando && error && (
          <div className="border-l-2 border-red-400 py-1 pl-5">
            <p className="text-sm font-semibold text-[#0F1E3D]">
              No pudimos mostrar este plan
            </p>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
          </div>
        )}

        {!error && catalogo && (
          <>
            {catalogo.beneficios.length === 0 ? (
              <div className="border-l-2 border-dashed border-[#0F1E3D]/15 py-1 pl-5">
                <p className="text-sm font-medium text-slate-400">
                  Este plan todavía no tiene beneficios cargados.
                </p>
              </div>
            ) : (
              <div className="columns-1 gap-x-10 sm:columns-2">
                {catalogo.beneficios.map((beneficio, index) => (
                  <div
                    key={beneficio.clave}
                    className="mb-7 break-inside-avoid-column border-t border-[#0F1E3D]/[0.07] pt-4 [&:first-child]:border-t-0 [&:first-child]:pt-0"
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span
                        className="shrink-0 text-sm text-[#C9974A]"
                        style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                      >
                        N.{String(index + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="text-[15px] leading-snug text-[#0F1E3D]"
                        style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
                      >
                        {beneficio.titulo}
                      </h3>
                    </div>

                    {beneficio.descripciones.length > 0 && (
                      <div className="mt-2 space-y-1.5 pl-[1.65rem]">
                        {beneficio.descripciones.map((descripcion, i) => (
                          <p
                            key={i}
                            className="text-[13px] leading-relaxed text-slate-500"
                          >
                            {descripcion}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Skeleton borroso — misma silueta que la lista real (número + título + líneas),
// así no hay salto de layout cuando llegan los datos.
function BeneficiosEsqueleto() {
  return (
    <div
      className="columns-1 gap-x-10 sm:columns-2 blur-[2px]"
      aria-hidden="true"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="mb-7 animate-pulse break-inside-avoid-column border-t border-[#0F1E3D]/[0.07] pt-4 [&:first-child]:border-t-0 [&:first-child]:pt-0"
        >
          <div className="flex items-baseline gap-2.5">
            <span className="h-3 w-6 shrink-0 rounded bg-[#C9974A]/40" />
            <span className="h-4 w-3/4 rounded bg-[#0F1E3D]/15" />
          </div>
          <div className="mt-3 space-y-2 pl-[1.65rem]">
            <span className="block h-2.5 w-full rounded bg-slate-300/60" />
            <span className="block h-2.5 w-5/6 rounded bg-slate-300/60" />
          </div>
        </div>
      ))}
    </div>
  );
}