import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

const VotersID = () => {
  const [voterID, setVoterID] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const handleVerifyVoterID = async () => {
    if (!consent) {
      alert("Please agree to the consent before proceeding.");
      return;
    }

    if (!voterID.trim()) {
      setError("Please enter your Voter ID.");
      return;
    }

    setLoading(true);
    setError("");
    const taskId = uuidv4(); // Generate taskId just before making the request

    try {
      const response = await axios.post(
        `${BASE_URL}/voterid/verify-Voterid`,
        {
          customer_epic_number: voterID,
          consent: "Y",
          consent_text: "I hereby declare my consent agreement for fetching my information via ZOOP API.",
          task_id: taskId,
        },
        {
          withCredentials: true, // equivalent to fetch's `credentials: "include"`
          headers: {
            "Content-Type": "application/json", // optional, Axios sets it by default
          },
        }
      );

      const dataResult = await response.data;

      if (response.status === 403) {
        alert("🚨 API limit exceeded!");// ✅ Proper alert message
        return; // ✅ Stops further execution
      }

      if (response.status===200 && dataResult.success) {
        setUserData(dataResult.voterData); // Use voterData from API response
      } else {
        setError(dataResult.error || "Verification failed.");
      }
    } catch (err) {
      setError("Error connecting to the server. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="feature-text-content" style={{ 
        color: 'var(--text-hover)', 
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        Voter ID Verification
      </h2>
  
      {userData ? (
        <div style={{
          backgroundColor: 'var(--bg-dropdown)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '20px'
        }}>
          <button 
            className="btn--primary" 
            onClick={() => setUserData(null)}
            style={{
              marginBottom: '20px',
              padding: '8px 16px',
              fontSize: '14px'
            }}
          >
            Back
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <div style={{
              color: 'var(--btn-primary)',
              fontSize: '24px'
            }}>✓</div>
            <h2 style={{ 
              color: 'var(--text-hover)',
              margin: 0
            }}>Verification Successful</h2>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr',
            gap: '10px 15px',
            alignItems: 'baseline'
          }}>
            <strong style={{ color: 'var(--text-hover)' }}>Voter ID:</strong>
            <span>{userData.epic_number}</span>
            
            <strong style={{ color: 'var(--text-hover)' }}>Name:</strong>
            <span>{userData.user_name_english}</span>
            
            <strong style={{ color: 'var(--text-hover)' }}>State:</strong>
            <span>{userData.address.state}</span>
            
            <strong style={{ color: 'var(--text-hover)' }}>District:</strong>
            <span>{userData.address.district_name}</span>
            
            <strong style={{ color: 'var(--text-hover)' }}>Assembly Constituency:</strong>
            <span>{userData.assembly_constituency_name}</span>
            
            <strong style={{ color: 'var(--text-hover)' }}>Polling Booth:</strong>
            <span>{userData.polling_booth.name}</span>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ 
            color: 'var(--text-color)',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Enter your Voter ID for verification:
          </p>
  
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'var(--text-color)',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Voter ID
            </label>
            <input
              type="text"
              placeholder="Enter Voter ID"
              value={voterID}
              onChange={(e) => setVoterID(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '5px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-dropdown)',
                color: 'var(--text-color)',
                fontSize: '16px'
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
                accentColor: 'var(--btn-primary)'
              }}
            />
            <label style={{ color: 'var(--text-color)' }}>
              I agree to let Zoop.one verify my data.
            </label>
          </div>
  
          <button
            onClick={handleVerifyVoterID}
            disabled={!consent || loading}
            className="btn--primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              opacity: (!consent || loading) ? 0.7 : 1,
              cursor: (!consent || loading) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>Verifying...</span>
              </span>
            ) : (
              "Verify Voter ID"
            )}
          </button>
  
          {error && (
            <p style={{
              color: '#ff6b6b',
              marginTop: '15px',
              textAlign: 'center'
            }}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VotersID;
