import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
// ajustá el path a donde tengas tu init

const CACHE_KEY = "auren_medicamentos_descuento";

export interface MedicamentoDescuento {
  codigo: string; // troquel/código CNPM, es la clave para cruzar con la API del gobierno
  nombre: string;
  porcentaje: number;
  laboratorio?: string;
}

interface CacheShape {
  data: MedicamentoDescuento[];
  cachedAt: number;
}

export function useMedicamentosDescuento() {
  const [descuentos, setDescuentos] = useState<MedicamentoDescuento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al deslogueare, limpiamos el caché — así vuelve a mostrarse "borroso"
    // la próxima vez que entre, igual que viste en Brubank
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        sessionStorage.removeItem(CACHE_KEY);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed: CacheShape = JSON.parse(cached);
        setDescuentos(parsed.data);
        setLoading(false); // ya tenemos algo para mostrar, aunque sea viejo
      } catch {
        sessionStorage.removeItem(CACHE_KEY);
      }
    }

    // Igual siempre refrescamos contra Firestore en segundo plano,
    // para que el admin pueda activar/desactivar descuentos sin que
    // el usuario tenga que desloguearse
    getDocs(collection(db, "medicamentosDescuento"))
      .then((snap) => {
        const fresh: MedicamentoDescuento[] = snap.docs.map((d) => ({
          codigo: d.id,
          ...(d.data() as Omit<MedicamentoDescuento, "codigo">),
        }));
        setDescuentos(fresh);
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: fresh, cachedAt: Date.now() } as CacheShape)
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return { descuentos, loadingDescuentos: loading };
}