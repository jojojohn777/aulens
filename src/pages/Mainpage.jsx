import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import UploadFraud from "./UploadFraud";
import FraudCustomerList from "./FraudCustomerList";
// import Aadhar from './Aadhar';
// import VoterID from './VoterId';
import SingleCheck from "./SingleCheck";
// import DrivingLicense from './DrivingLicense';
// import Passport from './Passport';
import Validation from "./Validation";
import MyAccount from "./MyAccount";
import ActivityList from "./ActivityList";
import AddPendingOfficer from "./AddPendingOfficer";
import SuperAdmin from "./SuperAdmin";
// import "./Mainpage.css";
import "bootstrap/dist/css/bootstrap.min.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";
import TermCond from "./TermCond";

import Index from "./Index";
import HomePage from "../components/HomePage";
import HeaderComponent from "../components/layouts/Header";
import TakePicture from "../components/layouts/TakePicture";

const Mainpage = ({ roleId, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [validationMenuOpen, setValidationMenuOpen] = useState(false);
  const [isDiv1Visible, setIsDiv1Visible] = useState(true);
  const [showSingleCheck, setShowSingleCheck] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [Fraud, setFraud] = useState(null);
  const [uploader, setUploader] = useState(null);
  const [identifier, setIdentifier] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [showFraudCustomerList, setShowFraudCustomerList] = useState(false);
  const [showAddToDatabase, setShowAddToDatabase] = useState(false);
  const [Addpending, setAddPending] = useState(false);
  const [AddGroup, setAddGroup] = useState(false);
  const [showMyActivity, setshowMyActivity] = useState(false);
  const [showMyAccount, setShowMyAccount] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(false);
  const [result, setResult] = useState("");
  const [Message, setMessage] = useState("");
  const webcamRef = useRef(null);
  const userid = localStorage.getItem("userid");
  const [isTermAccepted, setAccepted] = useState(false);
  const [data, setData] = useState([]); // ✅ this is where data is defined
  const [isScanActive, setScanActive] = useState(false);
  const openNav = () => setMenuOpen(true);
  const [percentage, setPercentage] = useState(0);
  const [uploadDateTime, setUploadDateTime] = useState(null);
  const closeNav = () => {
    setMenuOpen(false);
    setValidationMenuOpen(false);
  };

  //setting session
  // fetch('/user/set-session', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     userid: localStorage.getItem("userid"),
  //     roleid: localStorage.getItem("roleid")
  //   })
  // });





  // const openValidationNav = () => setValidationMenuOpen(true);
  const fetchData = async () => {

    try {

      const response = await axios.get(`${BASE_URL}/user/findOne/${userid}`, {

        withCredentials: true,

        headers: {
          "Content-Type": "application/json",
        },

      });

      return response.data;

    } catch (error) {

      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      const result = await fetchData();
      setData(result); // ✅ this updates data
      if (result.TermCond === true) {
        setAccepted(true); // ✅ use result directly
      }
    };

    fetchAndSetData();
  }, []);

  const sendFraudAlert = async (
    userid,
    ImagePath,
    similarity,
    filePath,
    customer,
    userData,
    formattedDate
  ) => {
    try {
      // Capture the screenshot using html2canvas
      // const canvas = await html2canvas(document.body);  // Use await to capture the screenshot
      // const AlertimageSrc = canvas.toDataURL('image/png');  // Convert canvas to base64 image string
      // const base64AlertImage = AlertimageSrc.split(",")[1];  // Extract the base64 data part
      // console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

      console.log("Send the fraud alert");
      if (similarity === 0) {
        similarity = 99;
      }
      setPercentage(similarity)
      // setUploadDateTime
      console.log(userid, ImagePath, similarity, filePath, customer, userData);

      const response = await axios.post(
        `${BASE_URL}/fraud-customer/fraud-alert`,
        {
          userid,
          image: ImagePath,
          similarity,
          filePath,
          customer,
          userData,
          formattedDate
        },
        {
          withCredentials: true, // to include cookies/session info
          headers: {
            "Content-Type": "application/json", // optional, Axios sets this by default
          },
        }
      );

      // Handle the response from the API
      const data = response.data;
      if (response.status === 200) {
        console.log("✅ Fraud alert sent successfully:", data);
        console.log(Notification.permission);
      } else {
        console.error("❌ Failed to send fraud alert:", data);
      }
    } catch (error) {
      console.error("🔥 Error calling fraud alert API:", error);
    }
  };

  const handleCapture = async () => {
    setResult(`Processing....`);
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);

      const base64Image = imageSrc.split(",")[1];
      // console.log(base64Image);


      try {
        const response = await axios.post(
          `${BASE_URL}/fraud-customer/findOne`,
          { image: base64Image },
          {
            withCredentials: true, // to include cookies/session info
            headers: {
              "Content-Type": "application/json", // optional, Axios sets this by default
            },
          }
        );

        const responseData = response.data;
        console.log("api response ", responseData);

        if (response.status === 403) {
          alert("🚨 API limit exceeded!"); // ✅ Proper alert message
          return; // ✅ Stops further execution
        }

        if (responseData?.customer && responseData.rekognAWS?.matched) {
          const { name, phone, Date_Time, ImagePath, message } =
            responseData.customer;
          const similarity = responseData.rekognAWS.similarity.toFixed(2);
          const formattedDate = new Date(Date_Time).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
          console.log(formattedDate);
          const filePath = responseData.filePath;
          setResult(
            `Photo uploaded on ${formattedDate}`
          );
          setMessage(`🛑 CRIME: ${message}`);
          setBackendImage(ImagePath);
          setUploader(responseData.user);
          setFraud(responseData.customer);
          setIdentifier(responseData.UserIdentified);
          setIsDiv1Visible(false);
          console.log(
            userid,
            ImagePath,
            similarity,
            filePath,
            responseData.customer,
            responseData.user
          );
          sendFraudAlert(
            userid,
            ImagePath,
            similarity,
            filePath,
            responseData.customer,
            responseData.user,
            formattedDate
          );
        } else {
          setResult("Face not found!");
          setIsDiv1Visible(true);
        }
      } catch (error) {
        console.error(error);
        setResult("Error: Something went wrong.");
        setIsDiv1Visible(true);
      }
    }
  };

  const handleCheck = async (file) => {
    console.log("Checked file:", file.name);

    setResult(`Processing....`);

    // Convert file to Base64
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]); // Get Base64 without metadata
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      let base64Image = await convertToBase64(file); // ✅ Await the base64 conversion

      const response = await axios.post(
        `${BASE_URL}/fraud-customer/findOne`,
        { image: base64Image },
        {
          withCredentials: true, // to include cookies/session info
          headers: {
            "Content-Type": "application/json", // optional, Axios sets this by default
          },
        }
      );

      const responseData = response.data;

      if (response.status === 403) {
        alert("🚨 API limit exceeded!");
        return;
      }

      if (responseData?.customer && responseData.rekognAWS?.matched) {
        const { name, phone, Date_Time, ImagePath, message } =
          responseData.customer;
        const similarity = responseData.rekognAWS.similarity.toFixed(2);
        const formattedDate = new Date(Date_Time).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
        console.log(formattedDate);
        const filePath = responseData.filePath;
        setResult(
          // `Match Found: ${name} - ${phone} - ${formattedDate} - Match Percentage: ${similarity}%`
          `Photo uploaded on ${formattedDate}`

        );
        setMessage(`🛑 CRIME: ${message}`);
        setBackendImage(ImagePath);
        setCapturedImage(URL.createObjectURL(file));
        setUploader(responseData.user);
        setFraud(responseData.customer);
        setIdentifier(responseData.UserIdentified);
        setIsDiv1Visible(false);
        setShowSingleCheck(false);
        console.log(
          userid,
          ImagePath,
          similarity,
          filePath,
          responseData.customer,
          responseData.user
        );
        // sendFraudAlert(userid, ImagePath, similarity, filePath, responseData.customer, responseData.user);
      } else {
        setResult("Match not found!");
        // setShowSingleCheck(false);
        setIsDiv1Visible(true);
      }
    } catch (error) {
      console.error(error);
      setResult("Error: Something went wrong.");
      setIsDiv1Visible(true);
    }
  };

  const handleHomeButton = () => {
    setShowAddToDatabase(false);
    setShowFraudCustomerList(false);
    setShowMyAccount(false);
    setShowSingleCheck(false);
    setSelectedVerification(null);
    setAddPending(false);
    setAddGroup(false);
    setIsDiv1Visible(true);
    setCapturedImage(null);
    setBackendImage(null);
    setResult("");
    setMessage("");
    setFraud(null);
    setUploader(null);
    setIdentifier(null);
    setshowMyActivity(false);
  };

  const handleActivityAudit = () => {
    setshowMyActivity(true);
    setShowMyAccount(false);
    setShowSingleCheck(false);
    setShowAddToDatabase(false);
    setShowFraudCustomerList(false);
    setSelectedVerification(null);
    setIsDiv1Visible(false);
    setAddPending(false);
    setAddGroup(false);
    setFraud(null);
    setUploader(null);
    setIdentifier(null);
  };

  const handleAccountButton = () => {
    setShowMyAccount(true);
    setShowSingleCheck(false);
    setShowAddToDatabase(false);
    setShowFraudCustomerList(false);
    setSelectedVerification(null);
    setIsDiv1Visible(false);
    setAddPending(false);
    setAddGroup(false);
    setFraud(null);
    setUploader(null);
    setIdentifier(null);
    setshowMyActivity(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${BASE_URL}/register?ref=superadmin`);
    alert("Registration link copied!");
  };

  const handleShowAddToDatabase = () => {
    handleHomeButton();
    setShowAddToDatabase(true);
  };

  const handleShowFraudCustomerList = () => {
    handleHomeButton();
    setShowFraudCustomerList(true);
  };

  const handleSingleCheck = () => {
    handleHomeButton();
    setShowSingleCheck(true);
  };
  const handleValidation = () => {
    handleHomeButton();
    setSelectedVerification(true);
  };

  const handleAddPending = () => {
    handleHomeButton();
    setAddPending(true);
  };

  const handleAddGroup = () => {
    handleHomeButton();
    setAddGroup(true);
  };

  // const handleVerificationClick = (type) => {
  //   handleHomeButton();
  //   setSelectedVerification(type);

  // };

  // ✅ `data` is defined here through useState
  // if (!data.TermCond) {
  //   return (
  //     <div>
  //       {data ? (
  //         <TermCond value={data} onLogout={onLogout} />
  //       ) : (
  //         <p>Loading...</p>
  //       )}
  //     </div>
  //   );
  // }
  const head = () => {
    return (
      <HeaderComponent
        onLogout={onLogout}
        handleShowAddToDatabase={handleShowAddToDatabase}
        handleValidation={handleValidation}
        handleSingleCheck={handleSingleCheck}
        handleHomeButton={handleHomeButton}
        changePass={handleAccountButton}
        addUser={handleAddPending}
        copyLink={handleCopyLink}
        handleActivity={handleActivityAudit}
      />
    );
  };

  return (
    <>
      {data?.TermCond == false && Number(roleId) !== 1 ? (
        // <index></indexicon>
        <>
          <TermCond value={data} onLogout={onLogout} />
          {/* <Index /> */}
        </>
      ) : // <TermCond value={data} onLogout={onLogout} />
        Number(roleId) === 1 ? (
          <SuperAdmin onLogout={onLogout} userid={userid} />
        ) : Number(roleId) === 2 || Number(roleId) === 3 ? (
          <div className=" ">
            <div className="top-icons-section d-none">
              <div className="top-icons-wrapper">
                <div className="icon-item" onClick={handleShowAddToDatabase}>
                  <div className="icon-circle">
                    <svg viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                  </div>
                  <div className="icon-label">Fraud Photo Upload</div>
                </div>

                <div className="icon-item" onClick={handleValidation}>
                  <div className="icon-circle">
                    <svg viewBox="0 0 24 24">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                  </div>
                  <div className="icon-label">e-KYC</div>
                </div>

                {/* <div className="icon-item" onClick={handleShowFraudCustomerList}>
                <div className="icon-circle">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                </div>
                <div className="icon-label">View or Delete</div>
              </div> */}

                <div className="icon-item">
                  <div className="icon-circle" onClick={handleSingleCheck}>
                    <svg viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                  <div className="icon-label">Single Check</div>
                </div>

                {/* <div className="icon-item">
                <div className="icon-circle">
                  <svg viewBox="0 0 24 24">
                    <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
                  </svg>
                </div>
                <div className="icon-label">Multi Check</div>
              </div> */}

                <div className="icon-item">
                  <div className="icon-circle" onClick={openNav}>
                    &#9776;
                  </div>
                  <div className="icon-label">Menu</div>
                </div>
              </div>
            </div>

            {/* Side Menu admin */}
            <div
              className="menu-icon d-none"
              style={{ width: menuOpen ? "250px" : "0" }}
            >
              <a href="#" className="closebtn" onClick={closeNav}>
                &times;
              </a>
              <ul>
                <li>
                  <a href="#" onClick={handleAccountButton}>
                    Change Password
                  </a>
                </li>
                <li>
                  <button onClick={onLogout}>Logout</button>
                </li>
                {Number(roleId) === 1 && (
                  <li>
                    <a href="#" onClick={handleAddGroup}>
                      Add Group
                    </a>
                  </li>
                )}
                {Number(roleId) === 2 && (
                  <li>
                    <a href="#" onClick={handleAddPending}>
                      Add User
                    </a>
                  </li>
                )}
                {(Number(roleId) === 1 || Number(roleId) === 2) && (
                  <li>
                    <button
                      onClick={handleCopyLink}
                      className="btn btn-link text-white p-0"
                    >
                      Copy User Generate Link
                    </button>
                  </li>
                )}

                <li>
                  <a href="#" onClick={handleActivityAudit}>
                    Usage statistics
                  </a>
                </li>
              </ul>
            </div>

            <div className="mid-image-section">
              {showMyAccount ? (
                <>
                  {head()}
                  <MyAccount userId={userid} />
                </>
              ) : AddGroup ? (
                <>
                  {head()}

                  <AdminSuper roleid={roleId} />
                </>
              ) : Addpending ? (
                <>
                  {head()}
                  <AddPendingOfficer currentRoleId={roleId} />
                </>
              ) : showAddToDatabase ? (
                <>
                  {head()}
                  <UploadFraud
                    handleShowFraudCustomerList={handleShowFraudCustomerList}
                  />
                </>
              ) : showMyActivity ? (
                <>
                  {head()}
                  <ActivityList userid={userid} />
                </>
              ) : showFraudCustomerList ? (
                <>
                  {head()}
                  <FraudCustomerList userid={userid} />
                </>
              ) : showSingleCheck ? (
                <>
                  {head()}
                  <SingleCheck
                    onCheck={handleCheck}
                    result={result}
                    onBack={handleHomeButton}
                    handleHomeButton={handleHomeButton}
                  />
                </>
              ) : selectedVerification ? (
                // <>
                //   {selectedVerification === 'Aadhar' && <Aadhar />}
                //   {selectedVerification === 'VoterID' && <VoterID />}
                //   {selectedVerification === 'DrivingLicense' && <DrivingLicense />}
                //   {selectedVerification === 'Passport' && <Passport />}
                // </>
                <>
                  {head()}

                  <Validation />
                </>
              ) : isDiv1Visible ? (
                <>
                  {head()}

                  <TakePicture
                    result={result}
                    capturedImage={capturedImage}
                    webcamRef={webcamRef}
                    handleCapture={handleCapture}
                    setCapturedImage={setCapturedImage}
                    setResult={setResult}
                    onCheck={handleCheck}
                    onBack={handleHomeButton}
                    handleCheck={handleCheck}
                    isScanActive={isScanActive}
                    setScanActive={setScanActive}
                  />
                </>
              ) : (
                <>
                  <div>
                    {/* <!-- Match Found Component --> */}
                    <div class="match-found-container container">
                      <div class="match-found-header">
                        <h3 class="match-found-title">Match found</h3>
                        <div class="match-found-alerts">
                          <p class="match-found-contact">Contact <span class="highlight-text">{uploader.name}</span> on <span class="highlight-text">{uploader.mobile}</span> immediately</p>
                          <p class="match-found-percentage">Match percentage: <span class="highlight-text">{percentage}%</span></p>
                        </div>
                      </div>

                      {/* <!-- Image Comparison Section --> */}
                      <div class="row match-found-images">
                        <div class="col-md-6 col-sm-12 p-4">
                          <div class="match-found-image-box">
                            {capturedImage && (
                              <img
                                src={capturedImage}
                                alt="Captured"
                                class="match-found-img"
                              />
                            )}
                            <div class="image-label">Current Image</div>
                          </div>
                        </div>
                        <div class="col-md-6 col-sm-12 p-4">
                          <div class="match-found-image-box">
                            {backendImage && (
                              <img
                                src={`${BASE_URL}/images/${backendImage}`}
                                alt="Backend"
                                class="match-found-img"
                              />
                            )}
                            <div class="image-label">Uploaded Image</div>
                          </div>
                        </div>
                      </div>

                      {/* <!-- Details Section --> */}
                      <div class="row match-found-details">
                        {/* <!-- Uploader Details --> */}
                        <div class="col-md-6 col-sm-12 p-4">
                          <div class="match-found-detail-card verification-card">
                            <h4 class="match-found-detail-title">Uploader Details</h4>
                            <div class="detail-grid">
                              <strong>Name:</strong>
                              <span>{uploader.name}</span>

                              <strong>Email:</strong>
                              <span>{uploader.email}</span>

                              <strong>Phone:</strong>
                              <span>{uploader.mobile}</span>

                              <strong>Business Name:</strong>
                              <span>{uploader.business}</span>
                            </div>
                          </div>
                        </div>

                        {/* <!-- Fraud Details --> */}
                        <div class="col-md-6 col-sm-12 p-4">
                          <div class="match-found-detail-card verification-card">
                            <h4 class="match-found-detail-title">Fraud Details</h4>
                            <div class="detail-grid">
                              <strong>Name:</strong>
                              <span>{Fraud.name}</span>

                              <strong>Address:</strong>
                              <span>{Fraud.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <!-- Result Message --> */}
                      <div class="match-found-result">
                        <p class="match-found-result-text">{result}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="bottom-home-section my-4 btn btn--primary">
              <div className="home-icon" onClick={handleHomeButton}>
                Home
              </div>
            </div>
          </div>
        ) : null}
    </>
  );
};

export default Mainpage;
