import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  MapPin,
  Stethoscope,
  UserSearch,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import DireccionAutocomplete from "../components/DireccionAutocomplete";
import CiudadAutocomplete from "../components/CiudadAutocomplete";
const API_URL = import.meta.env.VITE_API_URL_LINK;

const especialidades = [
  "Clínica Médica",
  "Cardiología",
  "Dermatología",
  "Ginecología",
  "Pediatría",
  "Traumatología",
  "Oftalmología",
  "Urología",
  "Neurología",
  "Nutrición",
  "Odontología",
  "Otorrinolaringología",
];

export default function SolicitudTurno() {
  const navigate = useNavigate();

  const [especialidad, setEspecialidad] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [motivo, setMotivo] = useState("");
  const [modo, setModo] = useState<"geolocalizado" | "profesional">("geolocalizado");
  const [nombreProfesionalSugerido, setNombreProfesionalSugerido] = useState("");
  const [enviando, setEnviando] = useState(false);

  const puedeSolicitar =
    especialidad &&
    ciudad &&
    !enviando &&
    (modo === "geolocalizado" ? direccion : nombreProfesionalSugerido);

  const solicitarTurno = async () => {
    if (!puedeSolicitar) return;

    try {
      setEnviando(true);

      const user = auth.currentUser;

      if (!user) {
        alert("Tenés que iniciar sesión");
        return;
      }

      const idToken = await user.getIdToken();

      // GUARDAMOS LA DIRECCION SOLO AL ENVIAR (1 write intencional, no al buscar).
      if (modo === "geolocalizado" && direccion.trim()) {
        try {
          await fetch(`${API_URL}/api/direcciones/guardar`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ direccion, ciudad }),
          });
        } catch (error) {
          console.error("No se pudo guardar la dirección:", error);
        }
      }

      const response = await fetch(
        `${API_URL}/api/crear-turno`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            especialidad,
            ciudad,
            direccion,
            motivo,
            modo,
            nombreProfesionalSugerido,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("Error creando turno:", response.status, error);
        alert("No se pudo enviar la solicitud");
        return;
      }

      const data = await response.json();
      console.log("Turno creado:", data);



  
    } catch (error) {
      console.error("Error solicitando turno:", error);
      alert("Error de conexión");
    } finally {
      setEnviando(false);
    }
  };

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
              Salud
            </span>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-[#0F1E3D]">
              Solicitud de turno
            </h1>
          </div>
        </div>

        <p className="relative z-10 mt-3 text-xs font-light leading-relaxed text-slate-500">
          Contanos qué atención necesitás.
        </p>
      </section>

      <main className="px-5 -mt-4">

        {/* Especialidad */}
        <section>
          <div className="mb-2 flex items-center gap-2">
            <Stethoscope size={15} className="text-[#C9974A]" />
            <label className="text-xs font-bold text-[#0F1E3D]">
              Especialidad
            </label>
          </div>

          <div className="relative">
            <select
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-[#C9974A]/30 bg-white px-4 py-3.5 pr-10 text-sm text-slate-700 shadow-sm outline-none focus:border-[#C9974A]"
            >
              <option value="">Seleccioná una especialidad</option>
              {especialidades.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A87B32]"
            />
          </div>
        </section>

        {/* Ciudad */}
        <section className="mt-6">
          <div className="mb-2 flex items-center gap-2">
            <MapPin size={15} className="text-[#C9974A]" />
            <label className="text-xs font-bold text-[#0F1E3D]">
              Ciudad
            </label>
          </div>

          <CiudadAutocomplete
            value={ciudad}
            onChange={setCiudad}
            placeholder="Ej. Santa Fe"
          />
        </section>

        {/* Modo: geolocalizado vs profesional */}
        <section className="mt-6">
          <label className="mb-2 block text-xs font-bold text-[#0F1E3D]">
            ¿Cómo querés que busquemos tu turno?
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setModo("geolocalizado")}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-3.5 text-center transition ${
                modo === "geolocalizado"
                  ? "border-[#0F1E3D] bg-[#0F1E3D]/5"
                  : "border-[#C9974A]/20 bg-white"
              }`}
            >
              <Navigation
                size={18}
                className={modo === "geolocalizado" ? "text-[#0F1E3D]" : "text-slate-400"}
              />
              <span className="text-xs font-bold text-[#0F1E3D]">
                Cerca mío
              </span>
              <span className="text-[10px] leading-tight text-slate-400">
                Te asignamos el más cercano
              </span>
            </button>

            <button
              type="button"
              onClick={() => setModo("profesional")}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-3.5 text-center transition ${
                modo === "profesional"
                  ? "border-[#0F1E3D] bg-[#0F1E3D]/5"
                  : "border-[#C9974A]/20 bg-white"
              }`}
            >
              <UserSearch
                size={18}
                className={modo === "profesional" ? "text-[#0F1E3D]" : "text-slate-400"}
              />
              <span className="text-xs font-bold text-[#0F1E3D]">
                Profesional puntual
              </span>
              <span className="text-[10px] leading-tight text-slate-400">
                Ya sé con quién quiero ir
              </span>
            </button>
          </div>
        </section>

        {/* Campo condicional: dirección o nombre del profesional */}
        {modo === "geolocalizado" ? (
          <section className="mt-6">
            <label className="mb-2 block text-xs font-bold text-[#0F1E3D]">
              Dirección donde te encontrás
            </label>

            <DireccionAutocomplete
              value={direccion}
              onChange={setDireccion}
              placeholder="Ej. San Martín 1234"
              ciudad={ciudad}
            />

            <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
              Usaremos esta dirección para buscar un profesional
              cercano y asignarte el turno.
            </p>
          </section>
        ) : (
          <section className="mt-6">
            <label className="mb-2 block text-xs font-bold text-[#0F1E3D]">
              Nombre del profesional
            </label>

            <input
              type="text"
              value={nombreProfesionalSugerido}
              onChange={(e) => setNombreProfesionalSugerido(e.target.value)}
              placeholder="Ej. Dr. Gómez"
              className="w-full rounded-2xl border border-[#C9974A]/30 bg-white px-4 py-3.5 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#C9974A]"
            />

            <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
              Vamos a confirmar disponibilidad con este profesional.
            </p>
          </section>
        )}

        {/* Motivo */}
        <section className="mt-6">
          <label className="mb-2 block text-xs font-bold text-[#0F1E3D]">
            Motivo de la consulta{" "}
            <span className="font-normal text-slate-400">(opcional)</span>
          </label>

          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Contanos brevemente qué necesitás..."
            rows={4}
            className="w-full resize-none rounded-2xl border border-[#C9974A]/30 bg-white px-4 py-3.5 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#C9974A]"
          />
        </section>

        {/* Botón */}
        <button
          type="button"
          disabled={!puedeSolicitar}
          onClick={solicitarTurno}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F1E3D] py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_10px_24px_rgba(15,30,61,0.25)] transition hover:bg-[#152953] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {enviando ? "Enviando solicitud..." : "Solicitar turno"}
        </button>

        <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-400">
          Tu solicitud será revisada por nuestro equipo.
          <br />
          Nosotros nos encargaremos de asignarte
          el profesional, día y horario.
        </p>

      </main>

    </div>
  );
}