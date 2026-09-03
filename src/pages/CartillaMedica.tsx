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
    <div className="min-h-screen bg-[#FBF6EC] text-slate-800">

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

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A87B32]">
              Cartilla
            </span>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-[#0F1E3D]">
              Cartilla médica
            </h1>
          </div>
        </div>

        <p className="relative z-10 mt-3 text-xs font-light leading-relaxed text-slate-500">
          Encontrá un profesional o especialista adherido.
        </p>
      </section>

      <main className="px-5 -mt-4">

        {/* Buscador */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 rounded-full border border-[#C9974A]/30 bg-white px-4 py-3 shadow-sm">
            <Search size={18} className="shrink-0 text-[#C9974A]" />

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
        <div className="mt-6">

          <div className="mb-2 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#A87B32]">
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
                {resultados.length}
              </span>
            )}
          </div>

          {/* Cargando */}
          {cargando ? (
            <div className="mt-2 space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-[#0F1E3D]/5" />
              ))}
            </div>

          ) : resultados.length === 0 ? (

            /* Sin resultados */
            <div className="py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0F1E3D]">
                <Search size={24} className="text-[#C9974A]" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#0F1E3D]">
                No encontramos profesionales
              </h3>

              <p className="mt-1.5 text-xs text-slate-400">
                Probá buscando por nombre o especialidad.
              </p>
            </div>

          ) : (

            /* Lista de profesionales */
            <div className="divide-y divide-[#C9974A]/25">
              {resultados.map((profesional) => (
                <div key={profesional.id} className="flex items-center gap-3 py-4">
                  <div
                    className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl shadow-inner"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.35) 0%, transparent 60%),
                        linear-gradient(180deg, rgba(15, 30, 61, 0.05) 0%, rgba(15, 30, 61, 0.3) 100%),
                        url("${profesional.imagen}")
                      `,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-[#0F1E3D]">
                        {profesional.nombre} {profesional.apellido}
                      </h3>
                    </div>

                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Stethoscope size={11} className="shrink-0 text-[#C9974A]" />
                      <span className="truncate text-xs font-medium text-slate-600">
                        {profesional.especialidad}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-400">
                      <span>DNI {profesional.dni}</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={10} className="text-[#C9974A]" />
                        {profesional.ciudad}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${profesional.direccion}, ${profesional.ciudad}, ${profesional.provincia}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[10px] font-bold text-[#A87B32] transition hover:text-[#C9974A]"
                  >
                    Cómo llegar
                  </a>
                </div>
              ))}
            </div>

          )}

        </div>
      </main>
    </div>
  );
}