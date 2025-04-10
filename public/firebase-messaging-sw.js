// Service worker file for handling background notifications
// This must be in the public folder at the root level
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Initialize Firebase App
firebase.initializeApp({
    apiKey: "AIzaSyD1pgX6RuXoFk7mmGqViCcJlBBwhjxwykE",
    authDomain: "aulens.firebaseapp.com",
    projectId: "aulens",
    storageBucket: "aulens.firebasestorage.app",
    messagingSenderId: "796119288730",
    appId: "1:796119288730:web:4c55bffa984922f34cc823",
    measurementId: "G-1FX1DKFYFD"
});

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
    console.log("📢 Background message received:", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/Images/imagesNoti.png",
    });
});
