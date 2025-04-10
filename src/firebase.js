
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1pgX6RuXoFk7mmGqViCcJlBBwhjxwykE",
    authDomain: "aulens.firebaseapp.com",
    projectId: "aulens",
    storageBucket: "aulens.firebasestorage.app",
    messagingSenderId: "796119288730",
    appId: "1:796119288730:web:4c55bffa984922f34cc823",
    measurementId: "G-1FX1DKFYFD"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firebase Cloud Messaging
export const messaging = getMessaging(app);

// Function to get FCM token
export const getFCMToken = async (vapidKey) => {
  try {
    // Check if notification permission is granted
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }
    }
    
    // Get token
    const currentToken = await getToken(messaging, { vapidKey });
    
    if (currentToken) {
      console.log('FCM token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
};

// Handle foreground messages
export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      resolve(payload);
    });
  });
};

export default app;