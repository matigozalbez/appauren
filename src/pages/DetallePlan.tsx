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

// Borde tipo "ticket / póliza" — construido una sola vez, no depende de datos.
const TEETH = 22;
const ZIGZAG_CLIP_PATH = `polygon(0% 0%, 100% 0%, ${Array.from(
  { length: TEETH + 1 },
  (_, i) => {
    const x = 100 - (i / TEETH) * 100;
    const y = i % 2 === 0 ? 100 : 55;
    return `${x}% ${y}%`;
  }
).join(", ")})`;

export default function DetallePlan() {
  const [user] = useAuthState(auth);
  const { plan } = useParams<{ plan: string }>();
  const [socio, setSocio] = useState<Socio | null>(null);
  const [catalogo, setCatalogo] = useState<CatalogoPlan | null>(null);
  const [cargando, setCargando] = useState(true);
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

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        setCargando(true);
        setError("");

        if (!user) {
          setError("Usuario no autenticado");
          setCargando(false);
          return;
        }

        if (!plan) {
          setError("No se especificó el plan");
          setCargando(false);
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

        const dataCatalogo = await resCatalogo.json();

        setCatalogo(dataCatalogo);
      } catch (err) {
        console.error("Error cargando detalle del plan:", err);

        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar el detalle del plan"
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDetalle();
  }, [user, plan]);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-[#FBF6EC] to-[#F5EAD2] px-4 py-8 sm:px-6"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mx-auto max-w-2xl">
        {/* ── Cabecera tipo credencial de cobertura ── */}
        <div className="overflow-hidden rounded-t-[28px] bg-gradient-to-br from-[#0F1E3D] via-[#152953] to-[#0A1429] shadow-xl shadow-[#0F1E3D]/10">
          <div className="px-7 pb-9 pt-8 sm:px-9">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#C9974A]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C9974A]">
                Tu cobertura
              </p>
            </div>

            <h1
              className="mt-3 text-[2rem] leading-[1.1] text-white sm:text-[2.5rem]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              {plan}
            </h1>

            {!cargando && !error && catalogo && (
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
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
              </div>
            )}
          </div>
        </div>

        {/* Borde dentado — la credencial "se despega" del documento de beneficios */}
        <div
          className="h-3.5 bg-[#0A1429]"
          style={{ clipPath: ZIGZAG_CLIP_PATH }}
          aria-hidden="true"
        />

        {/* ── Cuerpo: documento de beneficios, sin card sobre card ── */}
        <div className="rounded-b-[28px] border border-t-0 border-[#0F1E3D]/[0.06] bg-white/60 px-7 pb-10 pt-8 sm:px-9">
          {cargando && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#0F1E3D]/10 border-t-[#0F1E3D]" />
              <p
                className="mt-4 text-sm text-slate-400"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Cargando tu cobertura…
              </p>
            </div>
          )}

          {!cargando && error && (
            <div className="border-l-2 border-red-400 py-1 pl-5">
              <p className="text-sm font-semibold text-[#0F1E3D]">
                No pudimos mostrar este plan
              </p>
              <p className="mt-1 text-sm text-slate-500">{error}</p>
            </div>
          )}

          {!cargando && !error && catalogo && (
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
        </div>
      </div>
    </div>
  );
}