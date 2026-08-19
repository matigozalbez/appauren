importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCVUZaRCgP_6CxqirvkSccAOoFR1DTNOG8",
  authDomain: "uberblog-bb8eb.firebaseapp.com",
  projectId: "uberblog-bb8eb",
  storageBucket: "uberblog-bb8eb.firebasestorage.app",
  messagingSenderId: "335604735631",
  appId: "1:335604735631:web:b3e04bdda6305fdbf11afa"
});


const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje en segundo plano:', payload);
  
  const notificationTitle = payload.notification?.title || 'Nueva notificación';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/logoazulsolo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});