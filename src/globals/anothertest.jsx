import React, { useState, useEffect, useContext } from "react";
import Mainpage from "../pages/Mainpage";
import ForgotPassword from "./ForgotPassword";
import { requestFCMToken, deleteFCMToken } from "../firebase/firebase";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";
import "../assets/css/login.css";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userid");
    const storedRoleId = localStorage.getItem("roleid");
    const loginTime = localStorage.getItem("loginTime");

    console.log("haiiiii 111111");
    console.log(storedUserId);
    console.log(storedRoleId);
    console.log(loginTime);
    // req.id =storedUserId

    if (storedUserId && loginTime) {
      const elapsedTime = Date.now() - parseInt(loginTime, 10);
      const maxSessionTime = 8 * 60 * 60 * 1000; // 8 hours
      console.log(elapsedTime);
      if (elapsedTime < maxSessionTime) {
        setRoleId(storedRoleId);
        setLoginSuccess(true);
        setTimeout(handleLogout, maxSessionTime - elapsedTime);
      } else {
        handleLogout();
      }
    }
  }, [loginSuccess]);

  const handleLogin = async () => {
    console.log("Login button clicked");
    try {
      console.log("haii");

      let fcmToken = null;
      try {
        fcmToken = await requestFCMToken();
        console.log("✅ FCM Token:", fcmToken);
      } catch (fcmError) {
        console.error("❌ FCM error:", fcmError);
      }
      // fcmToken = "asdfasdfa;lkjasdf";
      console.log(BASE_URL);

      const response = await axios.post(
        `${BASE_URL}/login`,
        {
          username,
          password,
          fcmToken,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log('login api called above');
      

      const data = response.data;

      if (data.user) {
        console.log(data);
        
        setRoleId(data.user.roleid);
        localStorage.setItem("userid", data.user.userid);
        localStorage.setItem("roleid", data.user.roleid);
        localStorage.setItem("loginTime", Date.now().toString());
        setLoginSuccess(true);
        setTimeout(handleLogout, 8 * 60 * 60 * 1000);
      } else {
        alert("Invalid login");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert("An error occurred. Please try again.");
    }
  };

  const handleLogout = async () => {
    console.log("logging out");

    localStorage.removeItem("userid");
    localStorage.removeItem("roleid");
    localStorage.removeItem("loginTime");
    setLoginSuccess(false);
    console.log("Logged out");
  };

  if (loginSuccess) {
    return <Mainpage roleId={roleId} onLogout={handleLogout} />;
  }

  return (
    <div className="au-login d-flex justify-content-center gap-4  f-w-w">
      <div className="login-text">
        {showForgotPassword ? (
          // <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
          ""
        ) : (
          <>
            <div>
              <div className="logologin">
                ALPHA helps you identify people who try to pledge fake or stolen
                gold. Gold lenders who’ve been cheated upload photos of those
                offenders to a shared database. Simply take a photo of every new
                or suspicious customer — ALPHA will do the rest using its A.I
                based facial recognition system. You can also verify Aadhaar,
                PAN, Driving License, and Voter ID instantly using built-in
                eKYC. The more gold lenders who use ALPHA, the harder it becomes
                for fraudsters to cheat anyone in the network. ALPHA unites
                gold-based money lenders to prevent the pledging of fake gold
                ornaments.
              </div>
            </div>
          </>
        )}
      </div>
      <div className="login-container ">
        {showForgotPassword ? (
          <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
        ) : (
          <>
            <div>
              <div className="logologin">
                <img
                  src="https://ik.imagekit.io/rch00fvdg/aulens/logo.png?updatedAt=1746009113939"
                  alt="Aulens Logo"
                />
              </div>
              <h2>Log in</h2>
              <form
                className="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <div className="inputBox">
                  <i className="fa fa-user"></i>
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="inputBox">
                  <i className="fa fa-lock"></i>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="inputBox">
                  <input type="submit" value="Log in" onClick={handleLogin} />
                </div>
                <div className="links">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForgotPassword(true);
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
