import React, { useState } from "react";
import "./MyAccount.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

const MyAccount = ({ userId }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = async () => {
    setError(""); // Clear previous errors

    if (!confirmPassword || !oldPassword || !newPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    try {

      const response = await axios.post(
        `${BASE_URL}/user/changepassword`,
        {
          userId,
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true, // to include cookies/session info
          headers: {
            "Content-Type": "application/json", // optional, Axios sets this by default
          },
        }
      );
      const result = await response.data;

      if (!result.success) {
        setError("Old password is incorrect.");
      } else {
        alert("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <section className="scan-photo-section">
      <div className="container main-section-hero">
        <div className="scan-photo-mob">
          <h1>Change Password</h1>
          <br />
          <p>
            Update your account password securely. Make sure to choose a strong password 
            that includes a mix of letters, numbers, and special characters.
          </p>
        </div>
        <div>
          <div className="custum-file-upload update-pass">
            <div className="form-container">
              <label>Old Password:</label>
              <input
                type="password"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <label>New Password:</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label>Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {error && <p style={{color: "#ff5252"}}>{error}</p>}
            </div>
            <div className="tak-pic-div">
              <button className="btn btn--primary" onClick={handlePasswordChange}>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
