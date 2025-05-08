import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

const Passport = () => {
  const [customerFileNumber, setCustomerFileNumber] = useState("");
  const [customerDob, setCustomerDob] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const handleVerifyPassport = async () => {
    if (!consent) {
      alert("Please agree to the consent before proceeding.");
      return;
    }

    if (!customerFileNumber.trim() || !customerDob.trim()) {
      setError("Please enter both Passport File Number and Date of Birth.");
      return;
    }
    // Convert Date from YYYY-MM-DD to DD-MM-YYYY
    const formattedDob = customerDob.split("-").reverse().join("-");

    setLoading(true);
    setError("");
    const taskId = uuidv4();

    try {

      const response = await axios.post(
        `${BASE_URL}/passport/verify-passport`,
        {
          customer_file_number: customerFileNumber,
          customer_dob: formattedDob,
          task_id: taskId,
        },
        {
          withCredentials: true, // to include cookies/session info
          headers: {
            "Content-Type": "application/json", // optional, Axios sets this by default
          },
        }
      );


      const dataResult = await response.data;

      if (response.status === 403) {
        alert("🚨 API limit exceeded!");// ✅ Proper alert message
        return; // ✅ Stops further execution
      }

      if (response.status===200 && dataResult.success) {
        setUserData(dataResult.data);
      } else {
        setError(dataResult.error || "Verification failed.");
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
        Passport Verification
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
              fontSize: '28px'
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
            alignItems: 'baseline'
          }}>
            <strong style={{ color: 'var(--text-hover)' }}>Passport Number:</strong>
            <span>{userData.passport_number}</span>
  
            <strong style={{ color: 'var(--text-hover)' }}>Name on Passport:</strong>
            <span>{userData.name_on_passport}</span>
  
            <strong style={{ color: 'var(--text-hover)' }}>Last Name:</strong>
            <span>{userData.customer_last_name}</span>
  
            <strong style={{ color: 'var(--text-hover)' }}>Date of Birth:</strong>
            <span>{userData.customer_dob}</span>
  
            <strong style={{ color: 'var(--text-hover)' }}>Passport Applied Date:</strong>
            <span>{userData.passport_applied_date}</span>
  
            <strong style={{ color: 'var(--text-hover)' }}>Passport Status:</strong>
            <span>{userData.passport_satus ? "Active" : "Inactive"}</span>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ 
            color: 'var(--text-color)',
            marginBottom: '25px',
            textAlign: 'center',
            fontSize: '16px'
          }}>
            Enter your Passport details for verification:
          </p>
  
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'var(--text-color)',
              marginBottom: '8px',
              fontWeight: '500',
              fontSize: '15px'
            }}>
              Passport File Number
            </label>
            <input
              type="text"
              placeholder="Enter Passport File Number"
              value={customerFileNumber}
              onChange={(e) => setCustomerFileNumber(e.target.value)}
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
              value={customerDob}
              onChange={(e) => setCustomerDob(e.target.value)}
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
            onClick={handleVerifyPassport}
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
            {loading ? "Verifying..." : "Verify Passport"}
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
export default Passport;
