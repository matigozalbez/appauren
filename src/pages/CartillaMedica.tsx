import { useEffect, useMemo, useState } from "react";
import { auth } from "../firebase";
import {
  ArrowLeft,
  Search,
  MapPin,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Profesional {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  dni: string;
  provincia: string;
  ciudad: string;
  direccion: string;
  imagen: string;
}

export default function CartillaMedica() {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [cargando, setCargando] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL_LINK;

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const user = auth.currentUser;

        if (!user) return;

        const idToken = await user.getIdToken();

        const response = await fetch(`${API_URL}/api/listar-medicos`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();

        setProfesionales(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando cartilla médica:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchMedicos();
  }, []);

  const resultados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return profesionales;

    return profesionales.filter((profesional) => {
      const contenido = `
        ${profesional.nombre}
        ${profesional.apellido}
        ${profesional.especialidad}
        ${profesional.dni}
      `.toLowerCase();

      return contenido.includes(texto);
    });
  }, [busqueda, profesionales]);

  return (
    <div className="min-h-screen bg-[#F8F5EF] pb-10">

      {/* Header */}
      <header className="bg-gradient-to-br from-[#0F1E3D] via-[#152953] to-[#0A1429] px-6 pb-9 pt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-white">
              Cartilla médica
            </h1>

            <p className="text-[11px] text-slate-300">
              Encontrá un profesional
            </p>
          </div>
        </div>
      </header>

      <main className="px-6">

        {/* Buscador - Margen corregido para que no quede pegado */}
        <div className="-mt-4 relative z-10">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 shadow-md ring-1 ring-slate-900/[0.04]">
            <Search
              size={19}
              className="shrink-0 text-[#C9974A]"
            />

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre, especialidad o DNI"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Resultados */}
        <div className="mt-7">

          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#C9974A]">
                Profesionales
              </p>

              <h2 className="mt-1 text-lg font-bold text-[#0F1E3D]">
                {busqueda
                  ? "Resultados"
                  : "Profesionales disponibles"}
              </h2>
            </div>

            {!cargando && (
              <span className="text-[11px] font-medium text-slate-400">
                {resultados.length} resultados
              </span>
            )}
          </div>

          {/* Cargando */}
          {cargando ? (
            <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-sm text-slate-400">
                Cargando profesionales...
              </p>
            </div>

          ) : resultados.length === 0 ? (

            /* Sin resultados */
            <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0F1E3D]/5">
                <Search
                  size={20}
                  className="text-[#C9974A]"
                />
              </div>

              <h3 className="mt-4 text-sm font-bold text-[#0F1E3D]">
                No encontramos profesionales
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Probá buscando por nombre o especialidad.
              </p>
            </div>

          ) : (

            /* Cards */
            <div className="space-y-3">
              {resultados.map((profesional) => (

                <div
                  key={profesional.id}
                  className="group w-full overflow-hidden rounded-3xl bg-white text-left shadow-sm ring-1 ring-slate-900/[0.03] transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-4 p-4">

                    {/* Foto con efecto de luz sutil */}
                    <div 
                      className="relative shrink-0 h-[72px] w-[72px] rounded-2xl overflow-hidden shadow-inner"
                      style={{ 
                        backgroundImage: `
                          radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.35) 0%, transparent 60%),
                          linear-gradient(180deg, rgba(15, 30, 61, 0.05) 0%, rgba(15, 30, 61, 0.3) 100%),
                          url("${profesional.imagen}")
                        `,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    >
                      <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 shadow-sm" />
                    </div>

                    {/* Información */}
                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-base font-bold text-[#0F1E3D]">
                        {profesional.nombre}{" "}
                        {profesional.apellido}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5">
                        <Stethoscope
                          size={13}
                          className="text-[#C9974A]"
                        />

                        <span className="text-xs font-semibold text-slate-600">
                          {profesional.especialidad}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                        <span>
                          DNI {profesional.dni}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {profesional.ciudad}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Barra inferior */}
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5">

                    <span className="text-[10px] font-bold text-[#0F1E3D] transition group-hover:text-[#C9974A]">
                      Ver profesional →
                    </span>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${profesional.direccion}, ${profesional.ciudad}, ${profesional.provincia}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-[#0F1E3D] transition hover:text-[#C9974A]"
                    >
                      <MapPin size={12} />
                      Cómo llegar
                    </a>

                  </div>
                </div>

              ))}
            </div>

          )}

        </div>
      </main>
    </div>
  );
}