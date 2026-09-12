import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  ChevronDown,
  FlaskConical,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import DireccionAutocomplete from "../components/DireccionAutocomplete";
import CiudadAutocomplete from "../components/CiudadAutocomplete";
import SolicitudEnviadaModal from "../components/SolicitudEnviadaModal";
const API_URL = import.meta.env.VITE_API_URL_LINK;

const tiposEstudio = [
  "Laboratorio",
  "Radiografía",
  "Ecografía",
  "Tomografía",
  "Densitometría",
  "Otro",
];

export default function SolicitudEstudio() {
  const navigate = useNavigate();

  const [tipoEstudio, setTipoEstudio] = useState("");
  const [otroEstudio, setOtroEstudio] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [motivo, setMotivo] = useState("");
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [modalExito, setModalExito] = useState(false);
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
          `${API_URL}/api/mis-turnos/cupo?tipo=estudio`,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setCupo(data);
        } else {
          setCupo({ usado: 0, mensual: 1, habilitado: true });
        }
      } catch (error) {
        console.error("Error consultando cupo de estudios:", error);
        setCupo({ usado: 0, mensual: 1, habilitado: true });
      }
    };
    cargarCupo();
  }, []);

  const sinCupo = cupo !== null && !cupo.habilitado;

  const especialidadFinal =
    tipoEstudio === "Otro" ? otroEstudio.trim() : tipoEstudio;

  const puedeSolicitar =
    !enviando &&
    !sinCupo &&
    !subiendoImagen &&
    ciudad &&
    especialidadFinal &&
    direccion &&
    imagenUrl;

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

  const solicitarEstudio = async () => {
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
      if (direccion.trim()) {
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

      const response = await fetch(`${API_URL}/api/crear-turno`, {
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
          modo: "geolocalizado",
          nombreProfesionalSugerido: "",
          tipo: "estudio",
          imagenUrl,
        }),
      });

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
        console.error("Error creando estudio:", response.status, text);
        alert(mensaje);
        return;
      }

      const data = await response.json();
      console.log("Estudio creado:", data);
      setModalExito(true);
    } catch (error) {
      console.error("Error solicitando estudio:", error);
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
              Solicitud de estudio
            </h1>
          </div>
        </div>

        <p className="relative z-10 mt-3 text-xs font-light leading-relaxed text-slate-500">
          Contanos qué estudio necesitás.
        </p>
      </section>

      <main className="px-5 -mt-4">

        {cupo === null ? (
          <section className="mb-6 mt-4 space-y-3">
            <div className="h-14 animate-pulse rounded-2xl bg-[#0F1E3D]/5" />
            <div className="h-14 animate-pulse rounded-2xl bg-[#0F1E3D]/5" />
            <div className="h-28 animate-pulse rounded-2xl bg-[#0F1E3D]/5" />
          </section>
        ) : sinCupo ? (
          <div className="mt-10">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600" />
              <p className="text-sm font-bold text-red-700">
                Ya usaste tu estudio de este mes
              </p>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-red-600">
              Tu plan incluye 1 estudio por mes. Volvé a tener disponibilidad el{" "}
              {cupo?.proximoMes ? `día ${cupo.proximoMes}` : "primer día del próximo mes"}.
            </p>
            <button
              type="button"
              onClick={() => navigate("/home", { replace: true })}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-[#BB1E1E] bg-white py-3 text-xs font-semibold uppercase tracking-widest text-[#BB1E1E] transition active:scale-[0.98]"
            >
              Volver al inicio
            </button>
          </div>
        ) : null}

        {cupo !== null && !sinCupo && (
          <>

        {/* Tipo de estudio */}
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

        {/* Dirección */}
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
            Usaremos esta dirección para derivarte a una clínica cercana.
          </p>
        </section>

        {/* Foto del estudio */}
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

        {/* Observaciones */}
        <section className="mt-6">
          <label className="mb-2 block text-xs font-bold text-[#0F1E3D]">
            Observaciones <span className="font-normal text-slate-400">(opcional)</span>
          </label>

          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Contanos cualquier dato del estudio que quieras compartir..."
            rows={4}
            className="w-full resize-none rounded-2xl border border-[#C9974A]/30 bg-white px-4 py-3.5 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#C9974A]"
          />
        </section>

        {/* Botón */}
        <button
          type="button"
          disabled={!puedeSolicitar}
          onClick={solicitarEstudio}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F1E3D] py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_10px_24px_rgba(15,30,61,0.25)] transition hover:bg-[#152953] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sinCupo
            ? "Cupo del mes agotado"
            : enviando
              ? "Enviando solicitud..."
              : "Solicitar estudio"}
        </button>

        <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-400">
          Tu solicitud será revisada por nuestro equipo.
          <br />
          Nosotros nos encargaremos de asignarte la clínica.
        </p>

          </>
        )}

      </main>

      <SolicitudEnviadaModal
        isOpen={modalExito}
        tipo="estudio"
        onClose={() => setModalExito(false)}
      />

    </div>
  );
}