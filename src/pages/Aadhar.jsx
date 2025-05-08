import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';


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
      const response = await axios.post(
        `${BASE_URL}/aadhaar/request-otp`,
        {
          aadhaarNumber,
          taskId,
          consent_text: consentText,
        },
        {
          withCredentials: true, // Include credentials (cookies, auth headers, etc.)
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setOtpSent(true);
        setRequestId(response.data.request_id || "");
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

      const response = await axios.post(
        `${BASE_URL}/aadhaar/verify-otp`,
        {
          requestId,
          otp,
          taskId,
          consent_text: consentText,
        },
        {
          withCredentials: true, // Include credentials (cookies, auth headers, etc.)
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle API response status code 403 (API limit exceeded)
      if (response.status === 403) {
        alert("🚨 API limit exceeded!");
        return;
      }

      // Assuming the response data contains a "success" flag and "result" for user data
      if (response.data.success) {
        setUserData(response.data.result); // Store verified user data
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
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        backgroundColor: 'var(--bg-dropdown)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          color: 'var(--text-hover)',
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '28px'
        }}>
          Aadhaar Verification
        </h2>
  
        {userData ? (
          <div style={{
            borderLeft: '3px solid var(--btn-primary)',
            paddingLeft: '20px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setUserData(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  color: 'var(--btn-primary)',
                  border: '1px solid var(--btn-primary)',
                  padding: '8px 16px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'var(--btn-primary)';
                  e.target.style.color = 'var(--bg-body)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--btn-primary)';
                }}
              >
                <span>←</span> Back
              </button>
            </div>
  
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--btn-primary)', fontSize: '24px' }}>
              ✅ Verification Successful
            </h2>
  
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'max-content 1fr',
              gap: '12px 20px',
              marginTop: '20px',
              color: 'var(--text-color)'
            }}>
              <strong>Name:</strong>
              <span>{userData?.user_full_name}</span>
  
              <strong>Aadhaar Number:</strong>
              <span>{userData?.user_aadhaar_number}</span>
  
              <strong>Date of Birth:</strong>
              <span>{userData?.user_dob}</span>
  
              <strong>Gender:</strong>
              <span>{userData?.user_gender}</span>
  
              <strong>ZIP Code:</strong>
              <span>{userData?.address_zip}</span>
            </div>
  
            {userData?.user_profile_image && (
              <div style={{ marginTop: '20px' }}>
                <strong style={{ display: 'block', marginBottom: '10px' }}>Profile Image:</strong>
                <img
                  src={`data:image/jpeg;base64,${userData.user_profile_image}`}
                  alt="Profile"
                  style={{
                    maxWidth: '150px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{
              color: 'var(--text-color)',
              marginBottom: '25px',
              textAlign: 'center'
            }}>
              Fill in the below details to run verification
            </p>
  
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: 'var(--text-color)',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                Aadhaar Number
              </label>
              <input
                type="text"
                placeholder="Enter 12-digit Aadhaar Number"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-dropdown)',
                  color: 'var(--text-color)',
                  fontSize: '15px'
                }}
              />
            </div>
  
            <button
              onClick={handleRequestOtp}
              disabled={!consent || loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                backgroundColor: 'var(--btn-primary)',
                color: 'var(--bg-body)',
                border: 'none',
                borderRadius: '6px',
                cursor: (!consent || loading) ? 'not-allowed' : 'pointer',
                opacity: (!consent || loading) ? 0.6 : 1,
                fontWeight: '600',
                marginBottom: '20px'
              }}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
  
            {otpSent && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: 'var(--text-color)',
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: '15px'
                }}>
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-dropdown)',
                    color: 'var(--text-color)',
                    fontSize: '15px'
                  }}
                />
              </div>
            )}
  
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '25px',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-body)'
            }}>
              <input
                type="checkbox"
                id="consent-checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--btn-primary)' }}
              />
              <label htmlFor="consent-checkbox" style={{ color: 'var(--text-color)', fontSize: '14px', cursor: 'pointer' }}>
                I agree to let Zoop.one verify my data
              </label>
            </div>
  
            {otpSent && (
              <button
                onClick={handleVerifyOtp}
                disabled={!consent || !otp || loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  backgroundColor: 'var(--btn-primary)',
                  color: 'var(--bg-body)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: (!consent || !otp || loading) ? 'not-allowed' : 'pointer',
                  opacity: (!consent || !otp || loading) ? 0.6 : 1,
                  fontWeight: '600'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span>Verifying</span><span>...</span>
                  </span>
                ) : "Run Verification"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
  
}

export default Aadhar;
