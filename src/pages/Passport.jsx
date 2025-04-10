import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
      const response = await fetch("http://localhost:1337/passport/verify-passport", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_file_number: customerFileNumber,
          customer_dob: formattedDob,
          task_id: taskId,
        }),
      });

      const dataResult = await response.json();

      if (response.status === 403) {
        alert("🚨 API limit exceeded!");// ✅ Proper alert message
        return; // ✅ Stops further execution
      }

      if (response.ok && dataResult.success) {
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
    <div className="container">
      <h2 className="mb-4">Passport Verification</h2>

      {userData ? (
        <div className="border p-4 rounded">
          <button className="btn btn-secondary mb-3" onClick={() => setUserData(null)}>
            Back
          </button>
          <h2>✅ Verification Successful</h2>
          <p><strong>Passport Number:</strong> {userData.passport_number}</p>
          <p><strong>Name on Passport:</strong> {userData.name_on_passport}</p>
          <p><strong>Last Name:</strong> {userData.customer_last_name}</p>
          <p><strong>Date of Birth:</strong> {userData.customer_dob}</p>
          <p><strong>Passport Applied Date:</strong> {userData.passport_applied_date}</p>
          <p><strong>Passport Status:</strong> {userData.passport_satus ? "Active" : "Inactive"}</p>
         
        </div>
      ) : (
        <div>
          <p>Enter your Passport details for verification:</p>

          <div className="mb-3">
            <label className="form-label">Passport File Number</label>
            <input
              type="text"
              placeholder="Enter Passport File Number"
              className="form-control"
              value={customerFileNumber}
              onChange={(e) => setCustomerFileNumber(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              value={customerDob}
              onChange={(e) => setCustomerDob(e.target.value)}
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
            onClick={handleVerifyPassport}
            disabled={!consent || loading}
            className="btn btn-primary w-100 mb-3"
          >
            {loading ? "Verifying..." : "Verify Passport"}
          </button>

          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      )}
    </div>
  );
};
export default Passport;
