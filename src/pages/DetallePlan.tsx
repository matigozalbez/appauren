import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const API_URL = "http://127.0.0.1:8080";

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


export default function DetallePlan() {
const [user] = useAuthState(auth);
const { plan } = useParams<{ plan: string }>()
  const [socio, setSocio] = useState<Socio | null>(null);
  const [catalogo, setCatalogo] = useState<CatalogoPlan | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const cargarDetalle = async () => {
    try {
      setCargando(true);
      setError("");
      console.log(socio)
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
 const resSocio = await fetch(
  `${API_URL}/api/mi-socio`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!resSocio.ok) {
        throw new Error("No se pudo obtener la información del socio");
      }

      const dataSocio = await resSocio.json();

      // 2. Verificar que tenga este plan
      const tienePlan = (dataSocio.planes || []).some(
        (p: PlanSocio) =>
          p.nombre === plan && p.estado === "activo"
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
  <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-[#FBF6EC] to-[#F5EAD2] px-4 py-6 sm:px-6">
    <div className="mx-auto max-w-3xl space-y-6">

      {/* Encabezado */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1E3D] via-[#152953] to-[#0A1429] shadow-xl">
        <div className="px-6 py-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9974A]">
            Tu cobertura
          </p>

          <h1 className="mt-2 text-2xl font-bold text-white">
            {plan}
          </h1>

          <p className="mt-1 text-sm text-white/60">
            Conocé todos los beneficios incluidos en tu plan
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">

        {cargando && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F1E3D]" />

            <p className="mt-4 text-sm font-medium text-slate-400">
              Cargando beneficios...
            </p>
          </div>
        )}

        {!cargando && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-600">
              {error}
            </p>
          </div>
        )}

        {!cargando && !error && catalogo && (
          <div>
            {/* Título sección */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0F1E3D]">
                  Beneficios incluidos
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Todo lo que tenés disponible con tu cobertura
                </p>
              </div>

              <span className="rounded-full bg-[#0F1E3D]/5 px-3 py-1 text-xs font-bold text-[#0F1E3D]">
                {catalogo.beneficios.length}
              </span>
            </div>

            {catalogo.beneficios.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm font-medium text-slate-400">
                  Este plan no tiene beneficios cargados.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {catalogo.beneficios.map((beneficio, index) => (
                  <div
                    key={beneficio.clave}
                    className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9974A]/40 hover:shadow-md"
                  >
                    <div className="flex gap-3">

                      {/* Número */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0F1E3D] text-xs font-bold text-white">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold leading-snug text-[#0F1E3D]">
                          {beneficio.titulo}
                        </h3>

                        {beneficio.descripciones.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            {beneficio.descripciones.map(
                              (descripcion, index) => (
                                <div
                                  key={index}
                                  className="flex gap-2 text-xs leading-relaxed text-slate-500"
                                >
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9974A]" />
                                  <p>{descripcion}</p>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
}