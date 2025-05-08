import React, { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";

const AddPendingOfficer = ({ currentRoleId }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState(currentRoleId === 1 ? 2 : 3); // Default based on role
  const [phoneExists, setPhoneExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const AddedUserId = localStorage.getItem("userid");

  // Function to check if phone number exists
  const checkPhoneExists = async (phoneNumber) => {
    if (phoneNumber.length < 10) {
      setPhoneExists(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/pendingOfficers/checkPhoneNumber/${phoneNumber}`,
        {
          withCredentials: true, // Include credentials (cookies, auth headers, etc.)
        }
      ); //middleware not need
      const data = response.data;

      setPhoneExists(data.exists);
    } catch (error) {
      console.error("Error checking phone:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    checkPhoneExists(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneExists) return;

    const officerData = {
      PhoneNumber: phone,
      Name: name,
      RoleID: roleId,
      AddedUser: AddedUserId,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/pendingOfficers/create`,
        officerData,
        {
          withCredentials: true, // Include credentials (cookies, auth headers, etc.)
        }
      );

      if (response.status === 200) {
        alert("Officer added successfully!");
        setName("");
        setPhone("");
        setRoleId(currentRoleId === 1 ? 2 : 3); // Reset based on role
      } else {
        alert("Error adding officer!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="main-section pending-off">
      <div className="container">
        <div
          className="feature-text-content"
          style={{ maxWidth: "460px", margin: "0 auto" }}
        >
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "20px",
              color: "var(--text-hover)",
            }}
          >
          Add branch
          </h2>

          <form
            onSubmit={handleSubmit}
            className="custum-file-upload"
            style={{ height: "auto", padding: "30px" }}
          >
            <div style={{ width: "100%", marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "var(--bg-dropdown)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "5px",
                  color: "var(--text-color)",
                }}
              />
            </div>

            <div style={{ width: "100%", marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                Phone:
              </label>
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "var(--bg-dropdown)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "5px",
                  color: "var(--text-color)",
                }}
              />
              {loading && (
                <p style={{ fontSize: "14px", marginTop: "5px" }}>
                  Checking phone...
                </p>
              )}
              {phoneExists && (
                <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  Phone number already exists!
                </p>
              )}
            </div>

            <div style={{ width: "100%", marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                Role:
              </label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(Number(e.target.value))}
                disabled={currentRoleId === 2} // Main Officers can only add Sub Officers
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "var(--bg-dropdown)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "5px",
                  color: "var(--text-color)",
                }}
              >
                {currentRoleId === 1 && <option value={2}>Main Officer</option>}
                {currentRoleId === 2 && <option value={3}>Sub Officer</option>}
              </select>
            </div>

            <div className="in-btn-div">
              <button
                type="submit"
                disabled={phoneExists}
                className="btn btn--primary"
                style={{
                  width: "100%",
                  padding: "12px",
                  opacity: phoneExists ? "0.7" : "1",
                  cursor: phoneExists ? "not-allowed" : "pointer",
                }}
              >
                  Add branch
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPendingOfficer;
