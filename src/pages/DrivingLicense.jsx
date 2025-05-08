
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';


const DrivingLicense = () => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [dob, setDob] = useState("");
  const [consent, setConsent] = useState(false);
  const [taskId, setTaskId] = useState(uuidv4());
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const handleVerifyLicense = async () => {
    if (!consent) {
      alert("Please agree to the consent before proceeding.");
      return;
    }

    if (!licenseNumber.trim() || !dob.trim()) {
      setError("Please enter both License Number and Date of Birth.");
      return;
    }

    // Convert Date from YYYY-MM-DD to DD-MM-YYYY
    const formattedDob = dob.split("-").reverse().join("-");

    // Generate a new task ID for each request
    setTaskId(uuidv4());
    setLoading(true);
    setError("");

    try {

      const response = await axios.post(
        `${BASE_URL}/DLicence/verify-DLicence`,
        {
          customer_dl_number: licenseNumber,
          customer_dob: formattedDob,
          task_id: taskId,
        },
        {
          withCredentials: true, // Include credentials (cookies, auth headers, etc.)
          headers: {
            'Content-Type': 'application/json', // Optional, as Axios sets this by default for JSON requests
          },
        }
      );


      const data = response.data.result;

      console.log(data);

      if (response.status === 403) {
        alert("🚨 API limit exceeded!");// ✅ Proper alert message
        return; // ✅ Stops further execution
      }

      if (response.status===200 && data.user_full_name) {
        setUserData(data);
      } else {
        setError(data?.error || "Verification failed.");
      }
    } catch (err) {
      setError("Error connecting to the server. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="container" style={{ 
      maxWidth: '600px', 
      margin: '0 auto',
      padding: '20px'
    }}>
      <h2 style={{ 
        color: 'var(--text-hover)',
        marginBottom: '30px',
        textAlign: 'center',
        fontSize: '28px'
      }}>
        Driving License Verification
      </h2>
  
      {userData ? (
        <div style={{
          backgroundColor: 'var(--bg-dropdown)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <button 
            onClick={() => setUserData(null)}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--btn-primary)',
              border: '1px solid var(--btn-primary)',
              padding: '8px 16px',
              borderRadius: '5px',
              marginBottom: '20px',
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
            Back
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{
              color: 'var(--btn-primary)',
              fontSize: '28px',
              lineHeight: '1'
            }}>✓</div>
            <h2 style={{ 
              color: 'var(--text-hover)',
              margin: 0,
              fontSize: '24px'
            }}>Verification Successful</h2>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr',
            gap: '12px 20px',
            alignItems: 'baseline',
            marginBottom: '20px'
          }}>
            <strong style={{ color: 'var(--text-hover)' }}>Name:</strong>
            <span>{userData.user_full_name}</span>
            
            <strong style={{ color: 'var(--text-hover)' }}>License Number:</strong>
            <span>{userData.dl_number}</span>
            
            <strong style={{ color: 'var(--text-hover)' }}>Date of Birth:</strong>
            <span>{userData.user_dob}</span>
            
            <strong style={{ color: 'var(--text-hover)' }}>License Status:</strong>
            <span>{userData.status}</span>
            
            <strong style={{ color: 'var(--text-hover)' }}>Issued Date:</strong>
            <span>{userData.issued_date || "Not Available"}</span>
            
            <strong style={{ color: 'var(--text-hover)' }}>Expiry Date:</strong>
            <span>{userData.expiry_date}</span>
            
            <strong style={{ color: 'var(--text-hover)' }}>Father/Husband Name:</strong>
            <span>{userData.father_or_husband}</span>
          </div>
  
          {userData.user_image && (
            <div style={{
              textAlign: 'center',
              marginTop: '25px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-color)'
            }}>
              <strong style={{ 
                color: 'var(--text-hover)',
                display: 'block',
                marginBottom: '15px'
              }}>Profile Image:</strong>
              <img
                src={`data:image/jpeg;base64,${userData.user_image}`}
                alt="Profile"
                style={{ 
                  width: '180px',
                  borderRadius: '8px',
                  border: '2px solid var(--border-color)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
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
            textAlign: 'center',
            fontSize: '16px'
          }}>
            Enter your Driving License Number and Date of Birth for verification:
          </p>
  
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'var(--text-color)',
              marginBottom: '8px',
              fontWeight: '500',
              fontSize: '15px'
            }}>
              Driving License Number
            </label>
            <input
              type="text"
              placeholder="Enter License Number"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
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
  
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'var(--text-color)',
              marginBottom: '8px',
              fontWeight: '500',
              fontSize: '15px'
            }}>
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
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
  
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '25px'
          }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: 'var(--btn-primary)',
                cursor: 'pointer'
              }}
            />
            <label style={{ 
              color: 'var(--text-color)',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              I agree to let Zoop.one verify my data.
            </label>
          </div>
  
          <button
            onClick={handleVerifyLicense}
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
              opacity: (!consent || loading) ? 0.7 : 1,
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (consent && !loading) {
                e.target.style.backgroundColor = 'var(--btn-hover)';
              }
            }}
            onMouseOut={(e) => {
              if (consent && !loading) {
                e.target.style.backgroundColor = 'var(--btn-primary)';
              }
            }}
          >
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Verifying...</span>
              </span>
            ) : (
              "Verify License"
            )}
          </button>
  
          {error && (
            <p style={{
              color: '#ff6b6b',
              marginTop: '20px',
              textAlign: 'center',
              padding: '10px',
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              borderRadius: '6px'
            }}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DrivingLicense;











