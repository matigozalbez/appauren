import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  RefreshCw,
  Stethoscope,
} from "lucide-react";
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

    <div className={`min-h-screen bg-[#F8F5EF] p-6 text-slate-800 ${animationClass}`}>

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() => navigate("/home", { replace: true })}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0F1E3D] shadow-sm ring-1 ring-slate-900/[0.04]"
            style={{ touchAction: "manipulation" }}
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9974A]">
              Salud
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#0F1E3D]">
              Mis citas
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Acá vas a encontrar tus turnos y solicitudes.
            </p>
          </div>

          <button
            type="button"
            onClick={cargarCitas}
            disabled={cargando}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0F1E3D] shadow-sm ring-1 ring-slate-900/[0.04] disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                cargando
                  ? "animate-spin"
                  : ""
              }
            />
          </button>

        </div>

      </div>


      {/* Loading */}

      {cargando && (

        <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm">

          <RefreshCw
            size={22}
            className="mx-auto animate-spin text-[#C9974A]"
          />

          <p className="mt-4 text-sm text-slate-400">
            Cargando tus turnos...
          </p>

        </div>

      )}


      {/* Error */}

      {!cargando && error && (

        <div className="rounded-3xl bg-white px-6 py-10 text-center shadow-sm">

          <p className="text-sm font-semibold text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={cargarCitas}
            className="mt-4 rounded-2xl bg-[#0F1E3D] px-5 py-3 text-xs font-bold text-white"
          >
            Reintentar
          </button>

        </div>

      )}


      {/* Sin citas */}

      {!cargando &&
        !error &&
        citas.length === 0 && (

          <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0F1E3D]/5">

              <CalendarDays
                size={23}
                className="text-[#C9974A]"
              />

            </div>

            <h2 className="mt-4 text-base font-bold text-[#0F1E3D]">
              No tenés turnos
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Cuando solicites un turno,
              aparecerá acá.
            </p>

          </div>

        )}


      {/* Citas */}

      {!cargando &&
        !error &&
        citas.length > 0 && (

          <div className="space-y-5">

            {citas.map((cita) => {

              const asignada =
                cita.estado === "asignado";

              return (

                <div
                  key={cita.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/[0.03]"
                >

                  {/* Estado */}

                  <div className="border-b border-slate-100 p-5">

                    <div className="flex items-center justify-between gap-3">

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C9974A]">
                          {asignada
                            ? "Turno asignado"
                            : "Solicitud"}
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-[#0F1E3D]">
                          {cita.especialidad}
                        </h2>

                      </div>

                      <span
                        className={
                          asignada
                            ? "rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-bold text-green-600"
                            : "rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-600"
                        }
                      >
                        {asignada
                          ? "Asignado"
                          : "Pendiente"}
                      </span>

                    </div>

                  </div>


                  {/* Datos del turno */}

                  <div className="p-5">

                    {/* Médico */}

                    {asignada && (

                      <div className="rounded-2xl bg-[#0F1E3D]/5 p-4">

                        <div className="flex items-start gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">

                            <Stethoscope
                              size={18}
                              className="text-[#C9974A]"
                            />

                          </div>

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Profesional
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#0F1E3D]">

                              {cita.medicoNombre}{" "}

                              {cita.medicoApellido}

                            </p>

                          </div>

                        </div>

                      </div>

                    )}


                    {/* Fecha y hora */}

                    {asignada && (

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <div className="rounded-2xl bg-slate-50 p-4">

                          <CalendarDays
                            size={17}
                            className="text-[#C9974A]"
                          />

                          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Fecha
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#0F1E3D]">
                            {cita.fecha || "—"}
                          </p>

                        </div>


                        <div className="rounded-2xl bg-slate-50 p-4">

                          <Clock3
                            size={17}
                            className="text-[#C9974A]"
                          />

                          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Hora
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#0F1E3D]">
                            {cita.hora || "—"}
                          </p>

                        </div>

                      </div>

                    )}


                    {/* Dirección */}
{/* Dirección */}

<div className="mt-4 flex items-start gap-3">

  <MapPin
    size={17}
    className="mt-0.5 shrink-0 text-[#C9974A]"
  />

  <div className="min-w-0">

    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
      Dirección
    </p>

    <p className="mt-1 text-sm font-semibold text-slate-700">
      {asignada
        ? cita.medicoDireccion
        : cita.direccion}
    </p>

    <p className="text-xs text-slate-400">
      {cita.ciudad}
    </p>

    {asignada && (
      <button
        type="button"
        onClick={() => abrirGoogleMaps(cita)}
        className="mt-3 inline-flex items-center rounded-xl bg-[#0F1E3D] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-[0.98]"
      >
        Cómo llegar
      </button>
    )}

  </div>

</div>


                    {/* Motivo */}

                    {cita.motivo && (

                      <div className="mt-4 rounded-2xl bg-slate-50 p-3">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Motivo
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-slate-600">
                          {cita.motivo}
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              );

            })}

          </div>

        )}

    </div>

  );
}