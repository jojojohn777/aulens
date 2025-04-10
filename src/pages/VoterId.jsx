import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
      const response = await fetch("http://localhost:1337/voterid/verify-Voterid", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_epic_number: voterID,
          consent: "Y",
          consent_text: "I hereby declare my consent agreement for fetching my information via ZOOP API.",
          task_id: taskId,
        }),
      });

      const dataResult = await response.json();

      if (response.status === 403) {
        alert("🚨 API limit exceeded!");// ✅ Proper alert message
        return; // ✅ Stops further execution
      }

      if (response.ok && dataResult.success) {
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
    <div className="container ">
      <h2 className="mb-4">Voter ID Verification</h2>

      {userData ? (
        <div className="border p-4 rounded">
          <button className="btn btn-secondary mb-3" onClick={() => setUserData(null)}>
            Back
          </button>
          <h2>✅ Verification Successful</h2>
          <p><strong>Voter ID:</strong> {userData.epic_number}</p>
          <p><strong>Name:</strong> {userData.user_name_english}</p>
          <p><strong>State:</strong> {userData.address.state}</p>
          <p><strong>District:</strong> {userData.address.district_name}</p>
          <p><strong>Assembly Constituency:</strong> {userData.assembly_constituency_name}</p>
          <p><strong>Polling Booth:</strong> {userData.polling_booth.name}</p>
        </div>
      ) : (
        <div>
          <p>Enter your Voter ID for verification:</p>

          <div className="mb-3">
            <label className="form-label">Voter ID</label>
            <input
              type="text"
              placeholder="Enter Voter ID"
              className="form-control"
              value={voterID}
              onChange={(e) => setVoterID(e.target.value)}
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
            onClick={handleVerifyVoterID}
            disabled={!consent || loading}
            className="btn btn-primary w-100 mb-3"
          >
            {loading ? "Verifying..." : "Verify Voter ID"}
          </button>

          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default VotersID;
