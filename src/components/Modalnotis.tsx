    // components/NotificationsModal.tsx
import { useEffect, useState } from "react";
import { X, Bell } from "lucide-react";
import { collection, query, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";
 import { db} from "../firebase";
const API_URL = import.meta.env.VITE_API_URL_LINK;

 interface Notificacion {
    id: string;
    titulo: string;
    mensaje: string;
    fecha: Timestamp;
 }

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReadStateChange?: (unreadCount: number) => void;
 }

const LEIDAS_KEY = "auren_notis_leidas";

function getLeidas(): string[] {
    try {
        const raw = localStorage.getItem(LEIDAS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
    }

    function marcarComoLeidas(ids: string[]) {
    const actuales = getLeidas();
    const nuevas = Array.from(new Set([...actuales, ...ids]));
    localStorage.setItem(LEIDAS_KEY, JSON.stringify(nuevas));
    }

export default function NotificationsModal({ isOpen, onClose, onReadStateChange }: NotificationsModalProps) {
const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

const [loading, setLoading] = useState(true);



    

useEffect(() => {
    if (!isOpen) return;

    const fetchNotificaciones = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/notificaciones`);
            if (!res.ok) throw new Error("Error al obtener notificaciones");

            const items: Notificacion[] = await res.json();
            setNotificaciones(items || []);

            // Marcamos todas como leídas al abrir el modal
            const ids = items.map((n) => n.id);
            marcarComoLeidas(ids);
            onReadStateChange?.(0);
        } catch (err) {
            console.error("Error cargando notificaciones:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchNotificaciones();
}, [isOpen]);

    if (!isOpen) return null;

const formatFecha = (fechaInput: any) => {
    if (!fechaInput) return "";

    // Si viene como string de Go (ej: "2026-04-06T...") o ya es un objeto Date
    const fecha = new Date(fechaInput);
    
    if (isNaN(fecha.getTime())) return "";

    return fecha.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#FDFBF7] via-[#FBF6EC] to-[#F5EAD2] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-8 pb-4 flex-shrink-0">
            <h2 className="text-[#0F1E3D] text-lg font-bold flex items-center gap-2">
            <Bell size={20} className="text-[#C9974A]" />
            Notificaciones
            </h2>
            <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm active:scale-95 transition"
            aria-label="Cerrar"
            >
            <X size={18} className="text-[#0F1E3D]" />
            </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-6 pb-10">
            {loading ? (
            <div className="flex items-center justify-center h-40">
                <div className="h-6 w-6 border-2 border-[#C9974A] border-t-transparent rounded-full animate-spin" />
            </div>
            ) : notificaciones.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-center gap-2">
                <Bell size={32} className="text-[#0F1E3D]" />
                <p className="text-[#0F1E3D] text-sm">No tenés notificaciones por el momento</p>
            </div>
                        ) : (
          <div className="space-y-3">
            {notificaciones.map((n) => (
              <div
                key={n.id}
                className="group bg-white border border-slate-100 shadow-sm hover:shadow-md rounded-2xl p-4 transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {/* Icono contextual */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9974A]/15 to-[#C9974A]/5">
                    <Bell size={16} className="text-[#C9974A]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#0F1E3D] font-bold text-sm leading-snug">{n.titulo}</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">{n.mensaje}</p>
                    <p className="text-slate-400 text-[10px] mt-2 font-medium uppercase tracking-wide">
                      {formatFecha(n.fecha)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
            </div>
            </div>
        );
    }

    // Helper exportado para que Home pueda calcular el badge sin abrir el modal
    export async function contarNoLeidas(): Promise<number> {
    try {
        const q = query(collection(db, "notificaciones"), orderBy("fecha", "desc"), limit(30));
        const snap = await getDocs(q);
        const leidas = getLeidas();
        return snap.docs.filter((d) => !leidas.includes(d.id)).length;
    } catch {
        return 0;
    }
    }