/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

const firebaseConfig = {
  apiKey: "AIzaSyCVUZaRCgP_6CxqirvkSccAOoFR1DTNOG8",
  authDomain: "uberblog-bb8eb.firebaseapp.com",
  projectId: "uberblog-bb8eb",
  storageBucket: "uberblog-bb8eb.firebasestorage.app",
  messagingSenderId: "335604735631",
  appId: "1:335604735631:web:b3e04bdda6305fdbf11afa"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log('[Auren SW] Mensaje en segundo plano:', payload);
});