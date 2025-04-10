import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import { onMessageListener } from "./firebase"; // Import FCM listener
import "./App.css";

function App() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const unsubscribe = onMessageListener()
      .then((payload) => {
        console.log("📩 Notification Received:", payload);
        setNotification(payload);

        // Show browser notification if permission is granted
        if (Notification.permission === "granted") {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.nowimageurl || "/default-icon.png",
          });
        }
        reimage();
      })
      .catch((err) => console.error("Failed to receive message", err));

    return () => unsubscribe; // Cleanup function
  }, []); // Runs only once on mount

  // Effect to reload page 12 seconds after a notification is received
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
        window.location.reload();
      }, 1800000);

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [notification]); // Runs whenever `notification` changes

  
  const reimage = async () => {
    const imgTagId = 'reudyp'; // ID of the image tag
    const imgTag = document.getElementById(imgTagId); // Get the img element by ID
    
    if (!imgTag) {
      console.log('Image tag not found!');
      return;
    }
  
    // Get the current value of the 'src' attribute
    const currentSrc = imgTag.getAttribute('src');
    
    // Remove the 'src' attribute temporarily
    imgTag.removeAttribute('src');
    
    // Simulate some asynchronous operation (like waiting for some time or doing something else)
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay as an example
    
    // Reassign the 'src' value back to the img tag
    imgTag.setAttribute('src', currentSrc);
    
    console.log('Image src reassigned:', currentSrc);
  };
  
  


  return (
    <>
      {notification ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>

          <h2>{notification.notification.title}</h2>
          <p>{notification.notification.body}</p>
          {/* Image Comparison */}
          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <div style={{ width: "300px", height: "300px", overflow: "hidden" }}>
              <img
                src={`http://localhost:1337/images/${notification.data.imageUrl}`}
                alt="Identifier"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ width: "300px", height: "300px", overflow: "hidden" }}>
              <img id="reudyp"
                src={`http://localhost:1337/images/${notification.data.nowimageurl}`}
                alt="Fraud"
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

          {/* Identifier & Fraud Details */}
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", width: "80%" }}>
            <div style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "10px" }}>
              <h3>Identifier</h3>
              <p><strong>Name:</strong> {notification.data.username}</p>
              <p><strong>Phone:</strong> {notification.data.usermobile}</p>
              <p><strong>Email:</strong> {notification.data.useremail}</p>
              <p><strong>Business Name:</strong> {notification.data.userbusiness}</p>
            </div>

            <div style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "10px" }}>
              <h3>Fraud</h3>
              <p><strong>Name:</strong> {notification.data.fraudname}</p>
              <p><strong>Address:</strong> {notification.data.fraudadress}</p>
            </div>
          </div>
        </div>


      ) : (
        // Show the main app when there's no notification
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
