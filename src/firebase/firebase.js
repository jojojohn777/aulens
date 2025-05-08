
  import { initializeApp } from "firebase/app";
  import { getMessaging, getToken, onMessage,deleteToken  } from "firebase/messaging";
  
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
  const messaging = getMessaging(app);
  
  // Request FCM token
  export const requestFCMToken = async () => {
    try {
      const token = await getToken(messaging, { vapidKey: "BC4LaM2nrytphjhYg_On_QaxfzWWbinzOEJ0ryWJkqHUJ9cH_ftUJ1KB0FUIFq0He2vHxDHSRemunDgcMruT0Iw" });
      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  };
  
  // // Listen for incoming messages
  // export const onMessageListener = () => {
  //   return new Promise((resolve) => {
  //     onMessage(messaging, (payload) => {
  //       resolve(payload);
  //     });
  //   });
  // };

  export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

  // Delete FCM token
export const deleteFCMToken = async () => {
  try {
    console.log('qwaesr');
    const deleted = await deleteToken(messaging);
    console.log("🔕 FCM token deleted:", deleted);
    return deleted;
  } catch (error) {
    console.error("❌ Error deleting FCM token:", error);
    return false;
  }
};