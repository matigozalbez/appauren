import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  FlaskConical,
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

const tiposEstudio = [
  "Laboratorio",
  "Radiografía",
  "Ecografía",
  "Tomografía",
  "Densitometría",
  "Otro",
];

export default function SolicitudTurno() {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState<"consulta" | "estudio">("consulta");
  const [especialidad, setEspecialidad] = useState("");
  const [tipoEstudio, setTipoEstudio] = useState("");
  const [otroEstudio, setOtroEstudio] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [motivo, setMotivo] = useState("");
  const [modo, setModo] = useState<"geolocalizado" | "profesional">("geolocalizado");
  const [nombreProfesionalSugerido, setNombreProfesionalSugerido] = useState("");
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [cupo, setCupo] = useState<{
    usado: number;
    mensual: number;
    habilitado: boolean;
    proximoMes?: string;
  } | null>(null);

  useEffect(() => {
    const cargarCupo = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const idToken = await user.getIdToken();
        const res = await fetch(
          `${API_URL}/api/mis-turnos/cupo?tipo=${tipo}`,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setCupo(data);
        }
      } catch (error) {
        console.error("Error consultando cupo de turnos:", error);
      }
    };
    cargarCupo();
  }, [tipo]);

  const sinCupo = cupo !== null && !cupo.habilitado;

  const especialidadFinal =
    tipo === "estudio"
      ? tipoEstudio === "Otro"
        ? otroEstudio.trim()
        : tipoEstudio
      : especialidad;

  const puedeSolicitar =
    !enviando &&
    !sinCupo &&
    !subiendoImagen &&
    ciudad &&
    (tipo === "consulta"
      ? especialidad &&
        (modo === "geolocalizado" ? direccion : nombreProfesionalSugerido)
      : especialidadFinal &&
        direccion &&
        imagenUrl);

  const manejarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivoImagen(file);
    setImagenUrl("");
    setImagenPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const subirImagen = async () => {
    if (!archivoImagen) return;
    const user = auth.currentUser;
    if (!user) {
      alert("Tenés que iniciar sesión");
      return;
    }
    setSubiendoImagen(true);
    try {
      const idToken = await user.getIdToken();
      const formData = new FormData();
      formData.append("file", archivoImagen);
      const res = await fetch(`${API_URL}/api/estudios/subir-imagen`, {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        let mensaje = "No se pudo subir la imagen";
        try {
          const parsed = JSON.parse(text);
          if (parsed.mensaje) mensaje = parsed.mensaje;
        } catch {
          if (text) mensaje = text;
        }
        alert(mensaje);
        return;
      }
      const data = await res.json();
      setImagenUrl(data.url);
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      alert("Error de conexión al subir la imagen");
    } finally {
      setSubiendoImagen(false);
    }
  };

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
      if ((tipo === "estudio" || modo === "geolocalizado") && direccion.trim()) {
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
            especialidad: especialidadFinal,
            ciudad,
            direccion,
            motivo,
            modo: tipo === "estudio" ? "geolocalizado" : modo,
            nombreProfesionalSugerido:
              tipo === "estudio" ? "" : nombreProfesionalSugerido,
            tipo,
            imagenUrl: tipo === "estudio" ? imagenUrl : "",
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        let mensaje = "No se pudo enviar la solicitud";
        try {
          const parsed = JSON.parse(text);
          if (parsed && parsed.codigo === "TURNO_MES_AGOTADO") {
            mensaje = parsed.mensaje || mensaje;
            setCupo({ usado: 1, mensual: 1, habilitado: false });
          }
        } catch {
          // no es JSON, usamos el texto tal cual
          if (text) mensaje = text;
        }
        console.error("Error creando turno:", response.status, text);
        alert(mensaje);
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

        {/* Toggle: turno médico vs estudio */}
        <section className="mt-4 mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-[#C9974A]/25 bg-white p-2 shadow-sm">
          <button
            type="button"
            onClick={() => setTipo("consulta")}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 transition ${
              tipo === "consulta"
                ? "bg-[#0F1E3D] text-white"
                : "text-slate-500"
            }`}
          >
            <Stethoscope size={16} />
            <span className="text-xs font-bold">Turno médico</span>
          </button>
          <button
            type="button"
            onClick={() => setTipo("estudio")}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 transition ${
              tipo === "estudio"
                ? "bg-[#0F1E3D] text-white"
                : "text-slate-500"
            }`}
          >
            <FlaskConical size={16} />
            <span className="text-xs font-bold">Turno para estudio</span>
          </button>
        </section>

        {sinCupo && (
          <section className="mb-6 rounded-2xl border border-[#C9974A]/40 bg-[#FDF5E4] px-4 py-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Stethoscope size={16} className="text-[#A87B32]" />
              <p className="text-xs font-bold text-[#0F1E3D]">
                Ya usaste tu {tipo === "estudio" ? "estudio" : "turno"} de este mes
              </p>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              Tu plan incluye 1 {tipo === "estudio" ? "estudio" : "turno"} por mes.
              Volvé a tener disponibilidad el{" "}
              {cupo?.proximoMes ? `día ${cupo.proximoMes}` : "primer día del próximo mes"}.
            </p>
          </section>
        )}

        {tipo === "consulta" ? (
          <>
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
          </>
        ) : (
          <>
            {/* Estudio */}
            <section>
              <div className="mb-2 flex items-center gap-2">
                <FlaskConical size={15} className="text-[#C9974A]" />
                <label className="text-xs font-bold text-[#0F1E3D]">
                  Tipo de estudio
                </label>
              </div>

              <div className="relative">
                <select
                  value={tipoEstudio}
                  onChange={(e) => setTipoEstudio(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-[#C9974A]/30 bg-white px-4 py-3.5 pr-10 text-sm text-slate-700 shadow-sm outline-none focus:border-[#C9974A]"
                >
                  <option value="">Seleccioná el estudio</option>
                  {tiposEstudio.map((item) => (
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

              {tipoEstudio === "Otro" && (
                <input
                  type="text"
                  value={otroEstudio}
                  onChange={(e) => setOtroEstudio(e.target.value)}
                  placeholder="Escribí qué estudio necesitás"
                  className="mt-3 w-full rounded-2xl border border-[#C9974A]/30 bg-white px-4 py-3.5 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#C9974A]"
                />
              )}
            </section>
          </>
        )}

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

        {tipo === "consulta" && (
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
        )}

        {tipo === "consulta" && modo === "profesional" ? (
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
        ) : (
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
              {tipo === "estudio"
                ? "Usaremos esta dirección para derivarte a una clínica cercana."
                : "Usaremos esta dirección para buscar un profesional cercano y asignarte el turno."}
            </p>
          </section>
        )}

        {tipo === "estudio" && (
          <section className="mt-6">
            <label className="mb-2 block text-xs font-bold text-[#0F1E3D]">
              Foto del estudio
            </label>

            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#C9974A]/40 bg-white px-4 py-6 text-center transition active:scale-[0.98]">
              <Camera size={22} className="text-[#A87B32]" />
              <span className="text-xs font-bold text-[#0F1E3D]">
                Sacá una foto con tu cámara
              </span>
              <span className="text-[10px] leading-tight text-slate-400">
                Orden del estudio, receta o indicación médica (PNG, JPG o WebP · máx. 5 MB)
              </span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={manejarArchivo}
                className="hidden"
              />
            </label>

            {imagenPreview && (
              <img
                src={imagenPreview}
                alt="Foto del estudio"
                className="mt-3 max-h-56 w-full rounded-2xl border border-[#C9974A]/25 object-cover"
              />
            )}

            {imagenUrl && (
              <p className="mt-2 text-[11px] font-bold text-emerald-600">
                Foto subida correctamente ✓
              </p>
            )}

            <button
              type="button"
              disabled={!archivoImagen || subiendoImagen || !!imagenUrl}
              onClick={subirImagen}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#0F1E3D] bg-white py-3 text-xs font-semibold uppercase tracking-widest text-[#0F1E3D] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Camera size={15} />
              {subiendoImagen ? "Subiendo..." : imagenUrl ? "Foto subida" : "Subir foto"}
            </button>
          </section>
        )}

        {/* Motivo */}
        <section className="mt-6">
          <label className="mb-2 block text-xs font-bold text-[#0F1E3D]">
            {tipo === "estudio" ? "Observaciones" : "Motivo de la consulta"}{" "}
            <span className="font-normal text-slate-400">(opcional)</span>
          </label>

          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={
              tipo === "estudio"
                ? "Contanos cualquier dato del estudio que quieras compartir..."
                : "Contanos brevemente qué necesitás..."
            }
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
          {sinCupo
            ? "Cupo del mes agotado"
            : enviando
              ? "Enviando solicitud..."
              : tipo === "estudio"
                ? "Solicitar estudio"
                : "Solicitar turno"}
        </button>

        <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-400">
          Tu solicitud será revisada por nuestro equipo.
          <br />
          Nosotros nos encargaremos de asignarte
          {tipo === "estudio" ? " la clínica" : " el profesional, día y horario"}.
        </p>

      </main>

    </div>
  );
}