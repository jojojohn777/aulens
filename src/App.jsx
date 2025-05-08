import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import { onMessageListener } from "./firebase";
import "./App.css";
import "../src/assets/css/detected.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [notification, setNotification] = useState(null);
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check and request notification permission
  useEffect(() => {
    const checkPermission = async () => {
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        console.log("🔔 Notification permission:", permission);

        if (permission === "denied") {
          setShowPermissionBanner(true);
        } else if (permission === "granted") {
          setShowPermissionBanner(false);
        }
      } else if (Notification.permission === "denied") {
        setShowPermissionBanner(true);
      }
    };

    checkPermission();
  }, []);

  // Listen for incoming notifications
  useEffect(() => {
    let isMounted = true;

    onMessageListener()
      .then((payload) => {
        if (!isMounted) return;

        console.log("📩 Notification Received:", payload);
        setNotification(payload);
        console.log(`${BASE_URL}/images/${notification.data.imageUrl}`);
        console.log(`${BASE_URL}/images/${notification.data.nowimageurl}`);

        if (Notification.permission === "granted") {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.nowimageurl || "/default-icon.png",
          });
        }

        reimage();
      })
      .catch((err) => console.error("Failed to receive message", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Refresh image for comparison
  const reimage = async () => {
    const imgTag = document.getElementById("reudyp");
    if (!imgTag) return;
    const currentSrc = imgTag.getAttribute("src");
    imgTag.removeAttribute("src");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    imgTag.setAttribute("src", currentSrc);
    console.log("Image src reassigned:", currentSrc);
  };

  // Auto-hide notification after 30 minutes
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null); // instead of window reload
      }, 1800000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const isEdge = /Edg/.test(navigator.userAgent);

  return (
    <>
      {showPermissionBanner && (
        <div
          style={{
            background: "#ffdcdc",
            color: "#000",
            padding: "10px",
            textAlign: "center",
            borderBottom: "1px solid #ccc",
          }}
        >
          🔕 Notifications are disabled. Please enable them in your browser settings:
          <br />
          <strong>
            {isEdge
              ? "Edge: Settings > Cookies and site permissions > Notifications"
              : "Click the 🔒 icon in the address bar and allow notifications."}
          </strong>
        </div>
      )}

      {notification ? (
      //  <!-- Notification Component -->
       <div class="notification-comparison-container container">
         <div class="notification-header text-center">
           <h2 class="notification-title">Match found!</h2>
           <p class="notification-body">{notification.notification.body}</p>
           <p>Match percentage {notification.data.similarity}</p>
         </div>
         
         {/* <!-- Image Comparison Section --> */}
         <div class="notification-image-comparison">
           <div class="notification-image-box">
             <img
               src={`${BASE_URL}/images/${notification.data.imageUrl}`}
               alt="Identifier"
               class="notification-comparison-img"
             />
           </div>
           <div class="notification-image-box">
             <img
               id="reudyp"
               src={`${BASE_URL}/images/${notification.data.nowimageurl}`}
               alt="Fraud"
               loading="lazy"
               class="notification-comparison-img"
             />
           </div>
         </div>
         
         {/* <!-- Details Section --> */}
         <div class="notification-details-container">
           <div class="notification-detail-card verification-card">
             <h3 class="notification-detail-title">Identifier</h3>
             <div class="detail-grid">
               <strong>Name:</strong>
               <span>{notification.data.username}</span>
               
               <strong>Phone:</strong>
               <span>{notification.data.usermobile}</span>
               
               <strong>Email:</strong>
               <span>{notification.data.useremail}</span>
               
               <strong>Business Name:</strong>
               <span>{notification.data.userbusiness}</span>
             </div>
           </div>
           
           <div class="notification-detail-card verification-card">
             <h3 class="notification-detail-title">Fraud</h3>
             <div class="detail-grid">
               <strong>Name:</strong>
               <span>{notification.data.fraudname}</span>
               
               <strong>Address:</strong>
               <span>{notification.data.fraudadress}</span>
             </div>
           </div>
         </div>
         <p> Photo uploaded on {notification.data.formattedDate}</p>
       </div>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
