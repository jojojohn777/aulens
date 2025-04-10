import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Aadhar() {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [taskId] = useState(uuidv4());
  const [otp, setOtp] = useState("");
  const [requestId, setRequestId] = useState("");
  const [consent, setConsent] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const consentText =
    "I hereby declare my consent agreement for fetching my information via ZOOP API";

  const handleRequestOtp = async () => {
    if (!consent) {
      alert("Please agree to the consent before proceeding.");
      return;
    }
    if (!aadhaarNumber) {
      alert("Please enter Aadhaar number.");
      return;
    }

    try {
      const response = await fetch("http://localhost:1337/aadhaar/request-otp", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aadhaarNumber,
          taskId,
          consent_text: consentText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setRequestId(data.request_id || "");
        alert("OTP Sent successfully!");
      } else {
        alert("Failed to send OTP. Please check the Aadhaar number and try again.");
      }
    } catch (error) {
      console.error("OTP Request Error:", error);
      alert("Error sending OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!consent) {
      alert("Please agree to the consent before proceeding.");
      return;
    }
    if (!otp) {
      alert("Please enter OTP.");
      return;
    }
    if (!requestId) {
      alert("Request ID not found. Please request OTP first.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:1337/aadhaar/verify-otp", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          otp,
          taskId,
          consent_text: consentText,
        }),
      });

      if (response.status === 403) {
        alert("🚨 API limit exceeded!");// ✅ Proper alert message
        return; // ✅ Stops further execution
      }
      
      if (data.success) {
        setUserData(data.result); // Store verified user data
        alert("Aadhaar Verification Successful!");
      } else {
        alert("Verification failed. Please check the OTP and try again.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      alert("Error verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
  <h2 className="mb-4">Aadhaar Verification</h2>

  {userData ? (
    <div className="border p-4 rounded">
      <button className="btn btn-secondary mb-3" onClick={() => setUserData(null)}>Back</button>
      <h2>✅ Verification Successful</h2>
      <p><strong>Name:</strong> {userData.user_full_name}</p>
      <p><strong>Aadhaar Number:</strong> {userData.user_aadhaar_number}</p>
      <p><strong>Date of Birth:</strong> {userData.user_dob}</p>
      <p><strong>Gender:</strong> {userData.user_gender}</p>
      <p><strong>ZIP Code:</strong> {userData.address_zip}</p>
      {userData.user_profile_image && (
        <div>
          <strong>Profile Image:</strong>
          <br />
          <img
            src={`data:image/jpeg;base64,${userData.user_profile_image}`}
            alt="Profile"
            className="img-thumbnail mt-2"
            style={{ width: "150px", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  ) : (
    <div>
      <p>Fill in the below details to run verification</p> {/* Moved inside the form block */}
      
      <div className="mb-3">
        <label className="form-label">Aadhaar Number</label>
        <input
          type="text"
          placeholder="AADHAAR Number"
          className="form-control"
          value={aadhaarNumber}
          onChange={(e) => setAadhaarNumber(e.target.value)}
        />
      </div>

      <button
        onClick={handleRequestOtp}
        disabled={!consent || loading}
        className="btn btn-primary w-100 mb-3"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

      {otpSent && (
        <div className="mb-3">
          <label className="form-label">Enter OTP</label>
          <input
            type="text"
            placeholder="Enter OTP"
            className="form-control"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
      )}

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <label className="form-check-label">
          I agree to let Zoop.one verify my data.
        </label>
      </div>

      {otpSent && (
        <button
          onClick={handleVerifyOtp}
          disabled={!consent || !otp}
          className="btn btn-success w-100"
        >
          {loading ? "Verifying..." : "Run Verification"}
        </button>
      )}
    </div>
  )}
</div>
  );
}

export default Aadhar;
