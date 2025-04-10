
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

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
      const response = await fetch("http://localhost:1337/DLicence/verify-DLicence", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_dl_number: licenseNumber,
          customer_dob: formattedDob,
          task_id: taskId,
        }),
      });

      const dataResult = await response.json();
      const data = dataResult.result;

      console.log(data);
      
      if (response.status === 403) {
        alert("🚨 API limit exceeded!");// ✅ Proper alert message
        return; // ✅ Stops further execution
      }

      if (response.ok && data.user_full_name) {
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
    <div className="container">
      <h2 className="mb-4">Driving License Verification</h2>

      {userData ? (
        <div className="border p-4 rounded">
          <button className="btn btn-secondary mb-3" onClick={() => setUserData(null)}>
            Back
          </button>
          <h2>✅ Verification Successful</h2>
          <p><strong>Name:</strong> {userData.user_full_name}</p>
          <p><strong>License Number:</strong> {userData.dl_number}</p>
          <p><strong>Date of Birth:</strong> {userData.user_dob}</p>
          <p><strong>License Status:</strong> {userData.status}</p>
          <p><strong>Issued Date:</strong> {userData.issued_date || "Not Available"}</p>
          <p><strong>Expiry Date:</strong> {userData.expiry_date}</p>
          <p><strong>Father/Husband Name:</strong> {userData.father_or_husband}</p>

          {userData.user_image && (
            <div className="text-center mt-3">
              <strong>Profile Image:</strong>
              <br />
              <img
                src={`data:image/jpeg;base64,${userData.user_image}`}
                alt="Profile"
                className="img-thumbnail mt-2"
                style={{ width: "150px", borderRadius: "8px" }}
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Enter your Driving License Number and Date of Birth for verification:</p>

          <div className="mb-3">
            <label className="form-label">Driving License Number</label>
            <input
              type="text"
              placeholder="Enter License Number"
              className="form-control"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

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

          <button
            onClick={handleVerifyLicense}
            disabled={!consent || loading}
            className="btn btn-primary w-100 mb-3"
          >
            {loading ? "Verifying..." : "Verify License"}
          </button>

          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default DrivingLicense;
 
     
     
     
     
     
     
     
     
     
    
        