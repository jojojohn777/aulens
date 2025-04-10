import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import UploadFraud from './UploadFraud';
import FraudCustomerList from './FraudCustomerList';
import Aadhar from './Aadhar';
import VoterID from './VoterID';
import SingleCheck from './SingleCheck';
import DrivingLicense from './DrivingLicense';
import Passport from './Passport';
import MyAccount from './MyAccount';
import ActivityList from './ActivityList';
import AddPendingOfficer from './AddPendingOfficer'
import SuperAdmin from './SuperAdmin';
import './Mainpage.css';
import 'bootstrap/dist/css/bootstrap.min.css';


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
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [result, setResult] = useState('');
  const [Message, setMessage] = useState('');
  const webcamRef = useRef(null);
  const userid = localStorage.getItem('userid');

  const openNav = () => setMenuOpen(true);
  const closeNav = () => {
    setMenuOpen(false);
    setValidationMenuOpen(false);
  };
  const openValidationNav = () => setValidationMenuOpen(true);

  const sendFraudAlert = async (userid, ImagePath, similarity, filePath, customer, userData) => {
    try {
      // Capture the screenshot using html2canvas
      // const canvas = await html2canvas(document.body);  // Use await to capture the screenshot
      // const AlertimageSrc = canvas.toDataURL('image/png');  // Convert canvas to base64 image string
      // const base64AlertImage = AlertimageSrc.split(",")[1];  // Extract the base64 data part
      // console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

      // Send the fraud alert with userID and image to the server
      console.log('Send the fraud alert');
      console.log(userid, ImagePath, similarity, filePath, customer, userData);
      const response = await fetch("http://localhost:1337/fraud-customer/fraud-alert", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid, image: ImagePath, similarity, filePath, customer, userData }),
      });

      // Handle the response from the API
      const data = await response.json();
      if (response.ok) {
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
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);

      const base64Image = imageSrc.split(',')[1];

      try {
        const response = await fetch('http://localhost:1337/fraud-customer/findOne', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image }),
        });

        const responseData = await response.json();

        if (response.status === 403) {
          alert("🚨 API limit exceeded!");// ✅ Proper alert message
          return; // ✅ Stops further execution
        }

        if (responseData?.customer && responseData.rekognAWS?.matched) {
          const { name, phone, Date_Time, ImagePath, message } = responseData.customer;
          const similarity = responseData.rekognAWS.similarity.toFixed(2);
          const formattedDate = new Date(Date_Time).toUTCString();
          const filePath = responseData.filePath;
          setResult(`Match Found: ${name} - ${phone} - ${formattedDate} - Match Percentage: ${similarity}%`);
          setMessage(`🛑 CRIME: ${message}`);
          setBackendImage(ImagePath);
          setUploader(responseData.user);
          setFraud(responseData.customer)
          setIdentifier(responseData.UserIdentified);
          setIsDiv1Visible(false);
          console.log(userid, ImagePath, similarity, filePath, responseData.customer, responseData.user);
          sendFraudAlert(userid, ImagePath, similarity, filePath, responseData.customer, responseData.user);
        } else {
          setResult('Face not found!');
          setIsDiv1Visible(true);
        }
      } catch (error) {
        console.error(error);
        setResult('Error: Something went wrong.');
        setIsDiv1Visible(true);
      }
    }
  };



  const handleCheck = async (file) => {
    console.log("Checked file:", file.name);

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

      const response = await fetch('http://localhost:1337/fraud-customer/findOne', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      const responseData = await response.json();

      if (response.status === 403) {
        alert("🚨 API limit exceeded!");
        return;
      }

      if (responseData?.customer && responseData.rekognAWS?.matched) {
        const { name, phone, Date_Time, ImagePath, message } = responseData.customer;
        const similarity = responseData.rekognAWS.similarity.toFixed(2);
        const formattedDate = new Date(Date_Time).toUTCString();
        const { filePath } = responseData.filePath;
        setResult(`Match Found: ${name} - ${phone} - ${formattedDate} - Match Percentage: ${similarity}%`);
        setMessage(`🛑 CRIME: ${message}`);
        setBackendImage(ImagePath);
        setCapturedImage(URL.createObjectURL(file));
        setUploader(responseData.user);
        setFraud(responseData.customer);
        setIdentifier(responseData.UserIdentified);
        setIsDiv1Visible(false);
        setShowSingleCheck(false);
        console.log(userid, ImagePath, similarity, filePath, responseData.customer, responseData.user);
        sendFraudAlert(userid, ImagePath, similarity, filePath, responseData.customer, responseData.user);
      } else {
        setResult('Face not found!');
        setShowSingleCheck(false);
        setIsDiv1Visible(true);
      }
    } catch (error) {
      console.error(error);
      setResult('Error: Something went wrong.');
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
    setResult('');
    setMessage('');
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

  }

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
    navigator.clipboard.writeText('http://localhost:5173/register?ref=superadmin');
    alert('Registration link copied!');
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
  const handleAddPending = () => {
    handleHomeButton();
    setAddPending(true);
  };

  const handleAddGroup = () => {
    handleHomeButton();
    setAddGroup(true);
  };

  const handleVerificationClick = (type) => {
    handleHomeButton();
    setSelectedVerification(type);

  };

  return (

    <>
      {Number(roleId) === 1 ? (
        <SuperAdmin onLogout={onLogout} userid={userid} />
      ) : Number(roleId) === 2 || Number(roleId) === 3 ? (
        <div className="container">

          <div className="top-icons-section">
            <div className="top-icons-wrapper">
              <div className="icon-item" onClick={handleShowAddToDatabase}>
                <div className="icon-circle">
                  <svg viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </div>
                <div className="icon-label">Add</div>
              </div>

              <div className="icon-item" onClick={openValidationNav}>
                <div className="icon-circle">
                  <svg viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                  </svg>
                </div>
                <div className="icon-label">Validation</div>
              </div>

              <div className="icon-item" onClick={handleShowFraudCustomerList}>
                <div className="icon-circle">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                </div>
                <div className="icon-label">View or Delete</div>
              </div>

              <div className="icon-item">
                <div className="icon-circle" onClick={handleSingleCheck}>
                  <svg viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
                <div className="icon-label">Single Check</div>
              </div>

              <div className="icon-item">
                <div className="icon-circle">
                  <svg viewBox="0 0 24 24">
                    <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
                  </svg>
                </div>
                <div className="icon-label">Multi Check</div>
              </div>

              <div className="icon-item">
                <div className="icon-circle" onClick={openNav}>
                  &#9776;
                </div>
                <div className="icon-label">Menu</div>
              </div>

            </div>
          </div>




          {/* Side Menu */}
          <div className="menu-icon" style={{ width: menuOpen ? "250px" : "0" }}>
            <a href="#" className="closebtn" onClick={closeNav}>&times;</a>
            <ul>
              <li><a href="#" onClick={handleAccountButton}>Change Password</a></li>
              <li><a href="#" onClick={onLogout}>Logout</a></li>
              {Number(roleId) === 1 && (
                <li>
                  <a href="#" onClick={handleAddGroup}>Add Group</a>

                </li>
              )}
              {Number(roleId) === 2 && (
                <li>
                  <a href="#" onClick={handleAddPending}>Add Officer</a>
                </li>
              )}
              {(Number(roleId) === 1 || Number(roleId) === 2) && (
                <li>
                  <button onClick={handleCopyLink} className="btn btn-link text-white p-0">
                    Copy User Generate Link
                  </button>
                </li>
              )}

              <li><a href="#" onClick={handleActivityAudit}>Activity Audit</a></li>
            </ul>


          </div>

          {/* Validation Menu */}
          <div className="menu-icon" style={{ width: validationMenuOpen ? "250px" : "0" }}>
            <a href="#" className="closebtn" onClick={closeNav}>&times;</a>
            <ul>
              <li><a href="#" className="text-white" onClick={() => handleVerificationClick('Aadhar')}>Aadhar</a></li>
              <li><a href="#" className="text-white" onClick={() => handleVerificationClick('Passport')}>Passport</a></li>
              <li><a href="#" className="text-white" onClick={() => handleVerificationClick('DrivingLicense')}>Driving License</a></li>
              <li><a href="#" className="text-white" onClick={() => handleVerificationClick('VoterID')}>Voters ID</a></li>
            </ul>
          </div>



          <div className="mid-image-section">
            {showMyAccount ? (
              <MyAccount userId={userid} />
            ) : AddGroup ? (
              <AdminSuper roleid={roleId} />
            ) : Addpending ? (
              <AddPendingOfficer currentRoleId={roleId} />
            ) : showAddToDatabase ? (
              <UploadFraud />
            ) : showMyActivity ? (
              <ActivityList userID={userid} />
            ) : showFraudCustomerList ? (
              <FraudCustomerList userid={userid} />
            ) : showSingleCheck ? (
              <SingleCheck onCheck={handleCheck} onBack={handleHomeButton} />
            ) : selectedVerification ? (
              <>
                {selectedVerification === 'Aadhar' && <Aadhar />}
                {selectedVerification === 'VoterID' && <VoterID />}
                {selectedVerification === 'DrivingLicense' && <DrivingLicense />}
                {selectedVerification === 'Passport' && <Passport />}
              </>
            ) : isDiv1Visible ? (
              <>
                <div className="info-text">
                  The service once logged in will have 8 hours of validity and will not log off.
                </div>
                <p style={{ fontSize: 'larger' }}>{result}</p>
                <div className="image-container">
                  <Webcam className="web-cam" audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="100%" />
                </div>
                <button type="button" className="btn btn-outline-primary mt-3" onClick={handleCapture}>
                  Take Picture
                </button>
              </>
            ) : (
              <>
                <div>
                  <div className="row">
                    <h3>🚨 Fraud Found 🚨</h3>
                    <p>{Message}</p>

                    <div className="col-md-6 col-sm-12 p-4">
                      <div className="image-container">
                        {capturedImage && <img src={capturedImage} alt="Captured" style={{ width: '100%', height: '224px' }} />}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12 p-4">
                      <div className="image-container">
                        {backendImage && (
                          <img src={`http://localhost:1337/images/${backendImage}`} alt="Backend" style={{ width: '100%', height: '224px' }} />
                        )}
                      </div>
                    </div>

                    {/* Uploader Details */}
                    <div className="col-md-6 col-sm-12 p-4">
                      <h4>Uploader Details</h4>
                      <p><strong>Name:</strong> {uploader.name}</p>
                      <p><strong>Email:</strong> {uploader.email}</p>
                      <p><strong>Phone:</strong> {uploader.mobile}</p>
                      <p><strong>Business Name:</strong> {uploader.business}</p>
                    </div>

                    {/* Fraud Details */}
                    <div className="col-md-6 col-sm-12 p-4">
                      <h4>Fraud Details</h4>
                      <p><strong>Name:</strong> {Fraud.name}</p>
                      <p><strong>Address:</strong> {Fraud.address}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: 'x-large' }}>{result}</p>
                </div>
              </>
            )}
          </div>






          <div className="bottom-home-section">
            <div className="home-icon" onClick={handleHomeButton}>
              <svg viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
          </div>


        </div>
      ) : null}
    </>
  );

};

export default Mainpage;


