import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { getToken } from "firebase/messaging";
import { messaging, db } from "../firebase";

export const VAPID_KEY = "BCB0-_Qu_aFcJ5x3_SJEvCFDkphk1RizC0ZEpHTRbcf1TkC3aoFn8cZ4qYYJt_fMTihbbMI0lL3zo_5guUGoNc4";

export const CLAVE_AVISO = "auren_push_aviso";
export const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export function leerAvisoPush(): { visto: number; resultado: string } | null {
    try {
        const raw = localStorage.getItem(CLAVE_AVISO);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function marcarAvisoPush(resultado: string) {
    try {
        localStorage.setItem(CLAVE_AVISO, JSON.stringify({ visto: Date.now(), resultado }));
    } catch {
        // Sin acceso a localStorage: no cortamos el flujo
    }
}

export async function guardarTokenSocio(uid: string, token: string) {
    let planesSocio: string[] = [];

    // Buscamos en "socios" el documento con el uid coincidente para adjuntar sus planes
    const querySnapshot = await getDocs(query(collection(db, "socios"), where("uid", "==", uid)));
    if (!querySnapshot.empty) {
        const dataSocio = querySnapshot.docs[0].data();
        if (dataSocio.planes && Array.isArray(dataSocio.planes)) {
            planesSocio = dataSocio.planes;
        }
    }

    await setDoc(doc(db, "push_tokens", uid), {
        token,
        user_id: uid,
        planes: planesSocio,
        updatedAt: new Date(),
    }, { merge: true });
}

export async function obtenerTokenYGuardar(uid: string) {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
    });

    if (token) {
        await guardarTokenSocio(uid, token);
        return token;
    }
    return null;
}