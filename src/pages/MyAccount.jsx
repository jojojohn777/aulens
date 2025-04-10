import React, { useState } from "react";
import "./MyAccount.css";

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
      const response = await fetch("http://localhost:1337/user/changepassword", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, oldPassword, newPassword }),
      });
      const result = await response.json();

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
    <div className="fraud-container-account">
      <h3>Change Password</h3>
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
      {error && <p className="text-danger">{error}</p>}
      <button className="btn btn-success mt-3" onClick={handlePasswordChange}>
        Change Password
      </button>
    </div>
  );
};

export default MyAccount;
