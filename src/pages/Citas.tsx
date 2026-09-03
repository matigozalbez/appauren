import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, MapPin, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL_LINK;

interface Cita {
  id: string;
  uid: string;

  socioDni: string;
  solicitadoPor: string;

  esParaAdherente: boolean;

  beneficiarioDni: string;
  beneficiarioNombre: string;

  especialidad: string;
  ciudad: string;
  direccion: string;
  motivo: string;

  estado: string;

  medicoId?: string;
  medicoNombre?: string;
  medicoApellido?: string;
  medicoDireccion?: string;

  fecha?: string;
  hora?: string;
}

export default function Citas() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);

  const [cargando, setCargando] = useState(true);
  const direction = sessionStorage.getItem("nav_direction") || "right";
  const animationClass = direction === "right" ? "animate-slide-right" : "animate-slide-left";

  const [error, setError] = useState("");

  const cargarCitas = async () => {

    try {

      setCargando(true);
      setError("");

      const user = auth.currentUser;

      if (!user) {
        setError("No hay una sesión iniciada.");
        return;
      }

      const idToken = await user.getIdToken();

      const response = await fetch(
        `${API_URL}/api/mis-turnos`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {

        const texto = await response.text();

        console.error(
          "Error cargando citas:",
          response.status,
          texto
        );

        setError(
          "No pudimos cargar tus turnos."
        );

        return;
      }

      const data = await response.json();

      console.log("MIS TURNOS:", data);

      setCitas(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Error cargando citas:",
        error
      );

      setError(
        "Error de conexión."
      );

    } finally {

      setCargando(false);

    }
  };

  useEffect(() => {

    cargarCitas();

  }, []);

  const abrirGoogleMaps = (cita: Cita) => {

  const direccion = cita.medicoDireccion || cita.direccion;

  if (!direccion) {
    return;
  }

  const destino = encodeURIComponent(
    `${direccion}, ${cita.ciudad}`
  );

  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${destino}`,
    "_blank"
  );
};

  return (

    <div className={`min-h-screen bg-[#FBF6EC] text-slate-800 ${animationClass}`}>

      {/* Header: banner elegante */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFBF3] via-[#FDF5E4] to-[#F8ECD3] px-5 pb-9 pt-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B38033] via-[#DDB268] to-[#B38033]" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#C9974A]/10 blur-2xl" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/home", { replace: true })}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#0F1E3D] shadow-sm ring-1 ring-[#0F1E3D]/5 backdrop-blur transition active:scale-95"
              style={{ touchAction: "manipulation" }}
            >
              <ArrowLeft size={17} />
            </button>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A87B32]">
                Salud
              </span>
              <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-[#0F1E3D]">
                Mis citas
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={cargarCitas}
            disabled={cargando}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#0F1E3D] shadow-sm ring-1 ring-[#0F1E3D]/5 backdrop-blur transition active:scale-95 disabled:opacity-50"
            style={{ touchAction: "manipulation" }}
          >
            <RefreshCw size={16} className={cargando ? "animate-spin" : ""} />
          </button>
        </div>

        <p className="relative z-10 mt-3 max-w-[280px] text-xs font-light leading-relaxed text-slate-500">
          Acá vas a encontrar tus turnos y solicitudes.
        </p>
      </section>

      <main className="px-5 -mt-4">


      {/* Loading */}
      {cargando && (
        <section>
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-[#0F1E3D]/5" />
            ))}
          </div>
        </section>
      )}

      {/* Error */}
      {!cargando && error && (
        <section>
          <div className="py-12 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <button
              type="button"
              onClick={cargarCitas}
              className="mt-4 rounded-full bg-[#0F1E3D] px-6 py-3 text-xs font-bold text-white shadow-md"
            >
              Reintentar
            </button>
          </div>
        </section>
      )}

      {/* Sin citas */}
      {!cargando && !error && citas.length === 0 && (
        <section>
          <div className="py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0F1E3D]">
              <CalendarDays size={26} className="text-[#C9974A]" />
            </div>
            <h2 className="mt-5 text-lg font-bold text-[#0F1E3D]">No tenés turnos</h2>
            <p className="mt-1.5 text-xs text-slate-400">Cuando solicites un turno, aparecerá acá.</p>
          </div>
        </section>
      )}

      {/* Citas */}
      {!cargando && !error && citas.length > 0 && (
        <section>
          <div className="mb-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#A87B32]">
              Tus citas
            </p>
            <h2 className="mt-1 text-lg font-bold text-[#0F1E3D]">
              {citas.length} {citas.length === 1 ? "turno" : "turnos"}
            </h2>
          </div>

          <div className="divide-y divide-[#C9974A]/25">
            {citas.map((cita) => {
              const asignada = cita.estado === "asignado";

              return (
                <div key={cita.id} className="flex items-start gap-3 py-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0F1E3D]">
                    <CalendarDays size={18} className="text-[#C9974A]" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#0F1E3D]">
                        {cita.especialidad}
                      </p>
                      <span
                        className={
                          asignada
                            ? "shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600"
                            : "shrink-0 rounded-full bg-[#C9974A]/15 px-2.5 py-1 text-[10px] font-bold text-[#A87B32]"
                        }
                      >
                        {asignada ? "Asignado" : "Pendiente"}
                      </span>
                    </div>

                    {asignada && (
                      <div className="mt-2.5 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-[#C9974A]" />
                          <p className="text-xs text-slate-600">
                            Dr. {cita.medicoNombre} {cita.medicoApellido}
                          </p>
                        </div>
                        {(cita.fecha || cita.hora) && (
                          <div className="flex items-center gap-2">
                            <CalendarDays size={12} className="shrink-0 text-[#C9974A]" />
                            <p className="text-xs text-slate-500">
                              {cita.fecha} {cita.hora && `- ${cita.hora}`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {!asignada && cita.motivo && (
                      <p className="mt-2 text-xs text-slate-500">{cita.motivo}</p>
                    )}

                    {asignada && (
                      <button
                        type="button"
                        onClick={() => abrirGoogleMaps(cita)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#C9974A]/50 px-3.5 py-1.5 text-[10px] font-semibold text-[#0F1E3D] transition active:scale-95"
                      >
                        <MapPin size={12} className="text-[#C9974A]" />
                        Cómo llegar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      </main>
    </div>

  );
}