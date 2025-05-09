import React, { useState, useEffect, useContext } from "react";
import Mainpage from "../pages/Mainpage";
import ForgotPassword from "./ForgotPassword";
import { requestFCMToken, deleteFCMToken } from "../firebase/firebase";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";
// remember the assets i imported \:d
import logo from "../assets/images/logo.png";
import gif1 from "../assets/images/1.gif";
import png2 from "../assets/images/2.png";
import png3 from "../assets/images/3.png";
import png4 from "../assets/images/4.png";
import adhaar from "../assets/images/adhaar.png";
import pan from "../assets/images/pancard.jfif";
import card3 from "../assets/images/card3.jpg";
import drivingLicense from "../assets/images/drivingLicense.png";
import edited5 from "../assets/images/edited5.gif";
import mainContent from "../assets/images/mainContent.png";
import pancard from "../assets/images/pancard.jfif";
import pricing from "../assets/images/pricing.jpg";
import voter from "../assets/images/voter.jpg";
import z from "../assets/images/z.png";




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
    const setSession = async () => {
        try {
    
          const response = await axios.post(`${BASE_URL}/user/set-session`, {
    
            withCredentials: true,
    
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userid: localStorage.getItem("userid"),
              roleid: localStorage.getItem("roleid")
            })
          });
    
          return response.data;
    
        } catch (error) {
    
          console.error("Error fetching data:", error);
        }
      };
    
      console.log(setSession());
    

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
      {/* <div className="login-text"> */}
      {showForgotPassword ? (
        // <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
        ""
      ) : (
        <></>
      )}
      {/* </div> */}
      <div className=" ">
        {showForgotPassword ? (
          <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
        ) : (
          <>
            <div className="main-login">
              <section className="main-section">
                <div className="container sec ">
                  <div className="main-section-hero mar-sec  logwithcont">
                  <div>
                    <p className="mal" lang="ml">
                      <span className="green-text">ALPHA </span>     ഒരു AI-ആധാരിതമായ മുഖം തിരിച്ചറിയുന്ന പ്ലാറ്റ്ഫോമാണ്,
                      അത് ഇന്ത്യയാകമാനമുള്ള gold-based lenders നെ
                      ബന്ധിപ്പിക്കുന്നു. വ്യാജമോ മോഷണത്തിലൂടെ ലഭിച്ചോ ആയ
                      സ്വർണ്ണാഭരണങ്ങൾ പണയംവയ്ക്കാൻ ശ്രമിച്ചവരുടെ ഒരു ദേശീയ
                      ഡാറ്റാബേസ് സൃഷ്ടിക്കുകയാണ് ഈ പദ്ധതിയുടെ ഉദ്ദേശം.
                    </p>
                    <br />
                    <p className="mal" lang="ml">
                      <span className="green-text">ALPHA </span>     ഉപയോഗിക്കുന്ന ഓരോ gold-based lender-ക്കും
                      ഉപഭോക്താവിന്റെ ഫോട്ടോ എടുക്കാനും, ആ ചിത്രം <span className="green-text">ALPHA </span>    -യുടെ
                      പങ്കിട്ട ഡാറ്റാബേസിൽ പരിശോധിച്ച് മാച്ച് ഉണ്ടോ എന്ന്
                      നോക്കാനും സാധിക്കും. ഇതിലൂടെ ആവർത്തിച്ച് തട്ടിപ്പ് ചെയ്യാൻ
                      ശ്രമിക്കുന്നവരെ gold-based lender-ക്ക് തിരിച്ചറിയാനാകും.
                    </p>
                    <br />
                   
                  </div>
                  
                  <div>
                    <div className="login-container">
                      <div className="logologin">
                        <img src={logo} alt="Aulens Logo" />
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
                          <input
                            type="submit"
                            value="Log in"
                            onClick={handleLogin}
                          />
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
                  </div>
                  
                  </div>
                  <p className="green-text bottom-greenIn mal " lang="ml">
                      <b>
                        <span className="green-text">ALPHA </span>     ഉപയോഗിക്കുന്ന വിധം – സുരക്ഷിതമായ ലെൻഡിങ്ങിന്
                        എളുപ്പവും സുരക്ഷിതവുമായ മാർഗ്ഗനിർദ്ദേശം
                      </b>
                    </p>
                </div>
               
              </section>

              <section
                className=" fruad-section"
                id="scan-photo"
              >
                <div className="container  sec">
                  <div className="main-section-hero top-section ">
                  <div>
                    <img className="img-drops" src={gif1} alt="" />
                  </div>
                  <div className="scan-photo-mob">
                    <h1 className="mal primary-headings">
                      തട്ടിപ്പുകാരുടെ ഡാറ്റാബേസ്{" "}
                    </h1>
              
                    <p className="mal">
                      നിങ്ങൾ വ്യാജമോ മോഷ്ടിച്ചതോ ആയ സ്വർണ്ണം പണയംവയ്ക്കാൻ
                      ശ്രമിച്ചവരുടെ ഫോട്ടോകൾ <span className="green-text">ALPHA </span>    -യിലേക്ക് അപ്‌ലോഡ് ചെയ്യുക.
                      ശേഷം ഏതു സമയത്തും—വർഷങ്ങൾ കഴിഞ്ഞാലും—മറ്റൊരു gold-based
                      lender <span className="green-text">ALPHA </span>     ഉപയോഗിച്ച് ആ ആളിനെ തിരിച്ചറിയുകയാണെങ്കിൽ,
                      <span className="green-text">ALPHA </span>     നിങ്ങളെ അതിനെക്കുറിച്ച് അപ്പോള്‍ത്തന്നെ അറിയിക്കും.
                      തിരിച്ചറിയുന്ന lender-നെ ബന്ധപ്പെടാൻ കഴിയുന്നതിനായി <span className="green-text">ALPHA </span>     
                          നിങ്ങളുടെ കോൺടാക്റ്റ് വിവരങ്ങൾ അവർക്കും പങ്കുവെക്കും.
                      അതുപോലെ തന്നെ, നിങ്ങളും തിരിച്ചറിയുന്ന ആളുടെ കോൺടാക്റ്റ്
                      വിവരങ്ങൾ ലഭിക്കും.
                    </p>

              
                   
                  </div>

                  
                  </div>
                  <p className="mal green-text bottom-greenIn">
                      <b>
                        കൂടുതൽ money lenders <span className="green-text">ALPHA </span>     യിലേക്ക് ചേരുകയും,
                        പങ്കുവെക്കുന്ന ഡാറ്റാബേസ് വലുതാകുകയും ചെയ്യുമ്പോൾ,
                        ആവർത്തിച്ച് തട്ടിപ്പ് ചെയ്യാൻ ശ്രമിക്കുന്നവരിൽ നിന്ന്
                        നിങ്ങളുടെ സുരക്ഷ ശക്തമാകുന്നു തട്ടിപ്പുകളിൽ നിന്ന്
                        നിങ്ങൾക്ക് പ്രതിരോധശക്തിയുണ്ടാകുന്നു.
                      </b>
                    </p>
                </div>
              </section>

              <section className="scan-photo-section" id="scan-photo">
                <div className="container   sec">
                  <div className="main-section-hero ">
                  <div className="scan-photo-mob">
                    <h1 className="mal primary-headings">
                      ലെൻഡിംഗ് പ്രക്രിയയ്ക്കിടെ
                    </h1>

                    <p className="mal">
                      ഫോട്ടോ എടുക്കുക – പുതിയതോ സംശയം ഉളവാക്കുന്ന കസ്റ്റമർമാരുടെ
                      ഫോട്ടോ <span className="green-text">ALPHA </span>     ഇന്റർഫേസിലൂടെ എടുക്കുക. ആവശ്യമുണ്ടെങ്കിൽ,
                      നിലവിലുള്ള ഒരു ചിത്രം അപ്‌ലോഡ് ചെയ്യാനും കഴിയും.
                    </p>
               
                    <p className="mal">
                      <span className="green-text">ALPHA </span>     യുടെ AI മുഖം തിരിച്ചറിയൽ സാങ്കേതികത ഉപയോഗിച്ച്,
                      കമ്മ്യൂണിറ്റിയിൽ നിന്നുള്ള തട്ടിപ്പുകാരുടെ ഡാറ്റാബേസിൽ
                      ചിത്രം തത്സമയം പരിശോധിക്കും.
                    </p>
            
                    <p className="mal">
                      മാച്ച് ലഭിച്ചാൽ, നിങ്ങൾക്കും ആ ചിത്രം ആദ്യം അപ്‌ലോഡ് ചെയ്ത
                      വ്യക്തിക്കും ഉടൻ അറിയിപ്പ് ലഭിക്കും. ബന്ധപ്പെടാൻ ആവശ്യമായ
                      കോൺടാക്റ്റ് വിവരങ്ങളും ഷെയർ ചെയ്യപ്പെടും
                    </p>
           
                    <p className="mal">
                      e-KYC – ആധാർ, പാൻ, വോട്ടർ ഐഡി, ഡ്രൈവിംഗ് ലൈസൻസ് എന്നിവ
                      പോലുള്ള തിരിച്ചറിയൽ രേഖകൾ ഉടൻ സ്ഥിരീകരിക്കാൻ കഴിയും.
                    </p>
             
                  </div>
                  <div>
                    <img className="img-drops" src={png2} alt="" />
                  </div>
                  
                </div>
                <p className="mal green-text lending bottom-greenIn">
                      <b>
                        <span className="green-text">ALPHA </span>     സിസ്റ്റം കമ്പ്യൂട്ടറും മൊബൈലും ഉപയോഗിച്ച്
                        പ്രവർത്തിക്കാൻ അനുയോജ്യമാണ്.
                      </b>
                    </p>
                
                </div>
              </section>

              <section className="" id="scan-photo">
                <div className="container   sec">
                  <div className="main-section-hero">
                  <div>
                    <img className="img-drops" src={png3} alt="" />
                  </div>

                  <div className="scan-photo-mob">
                    <h1 className="mal primary-headings">
                      <span className="green-text">ALPHA </span>     ഉപയോഗിക്കേണ്ടത് എന്തിന്?
                    </h1>
                    <h2 className="mal primary-headings">
                      സൗകര്യപ്രദവും സുരക്ഷിതവുമായ സ്മാർട്ട് സംരക്ഷണം
                    </h2>
                    <ul>
                      <li>
                        അത്യാധുനിക മുഖം തിരിച്ചറിയൽ സാങ്കേതികത ഉപയോഗിച്ച്
                        തട്ടിപ്പുകാരെ കണ്ടെത്തുക
                      </li>
                      <li>
                        gold-based lenders നിർമ്മിച്ച വിശ്വസനീയമായ
                        തട്ടിപ്പുകാരുടെ ഡാറ്റാബേസ് ഉപയോഗിക്കുക
                      </li>
                      <li>
                        മുഖങ്ങൾ ഓർത്ത് വെക്കേണ്ടതുമില്ല, WhatsApp ഗ്രൂപ്പുകളിലെ
                        ഫോട്ടോകൾ ഓർത്ത് തിരിച്ചറിയേണ്ടതുമില്ല. നിങ്ങൾ
                        ഉപയോഗിക്കുന്നത് ഒരു ദേശീയ ഡാറ്റാബേസായ <span className="green-text">ALPHA </span>     ആണ്
                      </li>
                    
                    
                    </ul>
                  </div>
                  
                </div>
                <div>
                  <ul>
                  <li>
                        അപ്‌ലോഡ് ചെയ്ത ഫോട്ടോകളുടെ സ്വകാര്യത ഉറപ്പാക്കുന്നു —
                        ചിത്രം അപ്‌ലോഡ് ചെയ്ത വ്യക്തിക്കും തിരിച്ചറിയുന്ന
                        വ്യക്തിക്കും മാത്രമേ അത് കാണാൻ കഴിയൂ
                      </li>
                      <li>
                        Aadhaar, PAN, Voter ID, Driving License എന്നിവയ്ക്കുള്ള
                        ഉടനടി eKYC തിരിച്ചറിയൽ സംവിധാനവും ഉൾപ്പെടുത്തിയിട്ടുണ്ട്
                      </li>
                      <li>കമ്പ്യൂട്ടറിലും മൊബൈലിലും എളുപ്പത്തിൽ ഉപയോഗിക്കാം</li>
                      <li>
                        സ്വകാര്യതയും സുരക്ഷയും ഉറപ്പുള്ള സിസ്റ്റം — ഉപയോഗിക്കാൻ
                        വളരെ എളുപ്പം
                      </li>
                      <li>
                        ചെലവ് കുറഞ്ഞത് — ഒരു ഫോട്ടോ ഡാറ്റാബേസുമായുള്ള
                        താരതമ്യത്തിന് വെറും 75 പൈസ മുതൽ 1.5 രൂപ വരെ മാത്രം.
                      </li>
                      <li>
                        തട്ടിപ്പുകാരുടെ ഫോട്ടോകൾ അനിയന്ത്രിതമായി സൗജന്യമായി
                        അപ്‌ലോഡ് ചെയ്യാം
                      </li>
                      <li>
                        നിങ്ങളുടെ സബ്സ്ക്രിപ്ഷൻ അവസാനിച്ചതിനുശേഷവും 2
                        വർഷത്തേക്ക് നിങ്ങൾ അപ്‌ലോഡ് ചെയ്ത ഫോട്ടോകൾക്ക് മാച്ച്
                        കിട്ടിയാൽ, നിങ്ങള്‍ക്ക് അറിയിപ്പുകള്‍ ലഭിക്കും.
                      </li>
                      <br />
                      <li className="green-text bottom-greenIn">
                        <b>
                          വളരുന്ന ദേശീയ നെറ്റ്‌വർക്കിന്റെ ഭാഗമാകൂ — നമ്മെ
                          വഞ്ചിക്കുന്ന തട്ടിപ്പുകാരെതിരെ ഒരുമിച്ചുള്ള പ്രതിരോധം
                          നിർമ്മിക്കാം.
                        </b>{" "}
                      </li>
                  </ul>
                </div>
                </div>
              </section>

              <section className="scan-photo-section" id="scan-photo">
                <div className="container sec ">
                  <div className="yearly-sub last-sec sec">
                    <div className="scan-photo-mob">
                      <h1 className="mal primary-headings green-text">
                        വാർഷിക സബ്സ്ക്രിപ്ഷൻ
                      </h1>
                      <p className="mal">
                        എല്ലാ gold-based lenders-നും അനുയോജ്യമായതും വിലകുറഞ്ഞതും
                      </p>
                      <br />
                      <h2 className="mal primary-headings green-text">
                        ആദ്യ 3 മാസങ്ങൾ – സൗജന്യ ട്രയൽ
                      </h2>
                      <ul style={{ marginLeft: "20px" }}>
                        <li>
                          തട്ടിപ്പുകാരുടെ ഫോട്ടോകളുടെ പരിധിയില്ലാത്ത അപ്‌ലോഡ്
                        </li>
                        <li>
                          75 ഉപഭോക്താക്കളുടെ ഫോട്ടോകൾ വരെ താരതമ്യം ചെയ്യാം
                        </li>
                        <li>20 പേരുടെ eKYC പരിശോധിക്കാം</li>
                      </ul>
                    </div>

                    <div>
                      <img
                        className="img-drops"
                        src={pricing}
                        alt=""
                      />
                    </div>
                  </div>
                  <h2 className="plan-head">ട്രയലിന് ശേഷമുള്ള പ്ലാനുകൾ:</h2>
                  <section className="sub-cards">
                    <div className="plan-card basic">
                      <img
                        src={png4}
                        alt="ബേസിക് പ്ലാൻ"
                        className="plan-img"
                      />
                      <br />
                      <h3>ബേസിക് പ്ലാൻ – ₹600/വർഷം</h3>
                      <ul>
                        <li>ഓരോ ഫോട്ടോ താരതമ്യത്തിനും ₹1.5</li>
                        <li>ഓരോ eKYC സ്ഥിരീകരണത്തിനും ₹2.5</li>
                      </ul>
                    </div>

                    <div className="plan-card pro">
                      <img
                        src={edited5}
                        alt="പ്രോ പ്ലാൻ"
                        className="plan-img"
                      />
                      <br />
                      <h3>പ്രോ പ്ലാൻ – ₹1200/വർഷം</h3>
                      <ul>
                        <li>ഓരോ ഫോട്ടോ താരതമ്യത്തിനും ₹1</li>
                        <li>ഓരോ eKYC സ്ഥിരീകരണത്തിനും ₹2</li>
                        <li>2 ബ്രാഞ്ചുകൾക്ക് വരെ ലൈസൻസ് ഉൾപ്പെടുന്നു</li>
                      </ul>
                    </div>

                    <div className="plan-card gold">
                      <img
                        src={card3}
                        alt="ഗോൾഡ് പ്ലാൻ"
                        className="plan-img"
                      />
                      <br />
                      <h3>ഗോൾഡ് പ്ലാൻ – ₹2000/വർഷം</h3>
                      <ul>
                        <li>ഓരോ ഫോട്ടോ താരതമ്യത്തിനും ₹0.80 (80 പൈസ)</li>
                        <li>ഓരോ eKYC പരിശോധനയ്ക്കും ₹1.75</li>
                        <li>5 ബ്രാഞ്ചുകൾക്ക് വരെ ലൈസൻസ് ഉൾപ്പെടുന്നു</li>
                      </ul>
                    </div>
                  </section>
                  <br />
                  <p className="mal last-text">
                    ചെലവുകൾ നിങ്ങൾ മുൻകൂട്ടി അടച്ച ബാലൻസിൽ നിന്നു സ്വാഭാവികമായി
                    കണക്കാക്കിയെടുക്കപ്പെടും.
                  </p>{" "}
                  <br /> <br />
                  <p className="mal last-text">
                    ശ്രദ്ധിക്കുക: തട്ടിപ്പുകാരുടെ ഫോട്ടോകൾ അപ്‌ലോഡ് ചെയ്യുന്നത്
                    എന്നും സൗജന്യവും പരിധിയില്ലാത്തതുമാണ്. നിങ്ങള്‍
                    സബ്സ്ക്രിപ്ഷന്‍ റദ്ദാക്കിയാലും, ശേഷം രണ്ട് വർഷത്തേക്ക്
                    ഫോട്ടോയ്ക്ക് മാച്ച് ഉണ്ടായാൽ നിങ്ങൾക്ക് അറിയിപ്പ്
                    ലഭിക്കുന്നതാണ്.
                  </p>
                  <br />
                  <p className="mal green-text last-text">
                    <b>
                      ഒരു തട്ടിപ്പിനാൽ നിങ്ങൾക്ക് നഷ്ടമാകാവുന്ന തുകയുമായി
                      താരതമ്യപ്പെടുത്തിയാൽ, <span className="green-text">ALPHA </span>    -യുടെ ചെലവ് വളരെ വളരെ
                      ചെറിയതായിരിക്കും.
                    </b>
                  </p>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
