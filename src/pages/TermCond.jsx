import React, { useState, useEffect } from "react";
import "./TermCond.css";
import axios from "axios";
import TandC from "./TandC";

import { requestFCMToken, deleteFCMToken } from "../firebase/firebase";
// import TandC  from "./TandC";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TermCond = (props) => {
  // console.log(onLogout);

  const [formData, setFormData] = useState({
    name: "",
    state: "",
    district: "",
    taluk: "",
    business: "",
    address: "",
    mobile: "",
    email: "",
    whatsapp: "",
    password: "",
    confirmPassword: "",
    licenseNo: "",
    lendersLicenseNo: ''
  });

  const [error, setError] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [userData, setUserData] = useState(props || {});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [whatappNum, setWhatsapp] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogout = async () => {
    try {
      // Clear localStorage and state
      localStorage.removeItem("userid");
      localStorage.removeItem("roleid");
      localStorage.removeItem("loginTime");
      setLoginSuccess(false);

      // Optionally delete FCM token
      // await deleteFCMToken();

      console.log("Logged out");

      // Call the logout API with correct options
      await axios.post(`${BASE_URL}/user/logout`, null, {
        withCredentials: true, // Include cookies/session
      });
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);

      window.location.reload();
    }
  };

  const handleDeclineTerms = () => {
    setHasAcceptedTerms(false);
    setShowTermsModal(false);
    // Optionally, show a message that certain features will be unavailable
  };

  const handleAcceptTerms = () => {
    setHasAcceptedTerms(true);
    localStorage.setItem("termsAccepted", "true");
    setShowTermsModal(false);
  };

  const [termsAccepted, setTermsAccepted] = useState(
    userData.value?.TermCond || false
  );

  // Fetch states on component mount
  useEffect(() => {
    axios
      .get(`${BASE_URL}/state/stateAll`)
      .then((res) => setStates(res.data))
      .catch((err) => console.error("Error fetching states:", err));
  }, []);

  // Fetch districts when state is selected
  useEffect(() => {
    if (formData.state) {
      axios
        .get(`${BASE_URL}/districts/state/${formData.state.StateID}`)
        .then((res) => setDistricts(res.data))
        .catch((err) => console.error("Error fetching districts:", err));
    } else {
      setDistricts([]);
      setTaluks([]);
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.district) {
      axios
        .get(`${BASE_URL}/taluks/districts/${formData.district.DistrictID}`)
        .then((res) => setTaluks(res.data))
        .catch((err) => console.error("Error fetching taluks:", err));
    } else {
      setTaluks([]);
    }
  }, [formData.district]);

  useEffect(() => {
    // Update local state if props change
    if (props) {
      setUserData(props);
      setTermsAccepted(props.value?.TermCond || false);

      // Update form data with user values if available
      if (props.value) {
        setFormData((prevState) => ({
          ...prevState,
          name: props.value.name || "",
          address: props.value.address || "",
          mobile: props.value.mobile || "",
          email: props.value.email || "",
          business: props.value.business || "",
          TermCond: true,
          licenseNo: "",
          lendersLicenseNo: ''
        }));
      }
    }
  }, [props]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('form data',formData);
    // console.log(userData);
    // return;



    if (!termsAccepted) {
      setError(true);
      return;
    }

    setError(false);

    // Extract only the ID fields with proper null checks
    let processedData = {
      ...formData,
      state: formData.state?.StateID || "",
      district: formData.district?.DistrictID || "",
      thaluk: formData.taluk?.TalukID || "",
    };

    console.log(formData.password);
    if (termsAccepted) {
      console.log(processedData);
      console.log(userData);

      if (processedData.password) {
        if (processedData.confirmPassword != processedData.password) {
          setPasswordError(true);
          return;
        }
      }

      const response = await axios.put(
        `${BASE_URL}/user/update/${userData.value.userid}`,
        processedData,
        {
          withCredentials: true, // to include cookies/session info
          headers: {
            "Content-Type": "application/json", // optional, Axios sets this by default
          },
        }
      );

      console.log(response);
      userData.value.mobile;
      if (response.status >= 200 && response.status < 300) {
        // Refresh the page
        window.location.reload();
      }
    }
  };

  const handleDropdownChange = (e, type) => {
    try {
      const selectedOption = JSON.parse(e.target.value);
      setFormData((prevState) => ({
        ...prevState,
        [type]: selectedOption,
      }));
    } catch (error) {
      console.error("Error parsing dropdown value:", error);
    }
  };

  const user = userData.value || {};

  const handleChange = (e) => {

    setPasswordError(false);
    const { name, value } = e.target;

    let finalValue = value;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      // Get the first primitive property from the object
      const firstPrimitive = Object.values(value).find(
        (val) => typeof val !== "object" && typeof val !== "function"
      );

      finalValue = firstPrimitive ?? ""; // fallback to empty string if none found
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: finalValue,
    }));
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };
  const handleOnBlur = () => {
    // setWhatsapp(formData.mobile);
    console.log("hey");
  };

  const makeWhatsapp = () => {
    setWhatsapp(formData.mobile);
  };

  return (
    <>
      <form
        className="verification-card"
        onSubmit={handleSubmit}
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        {/* Terms and Conditions Modal */}
        {showTermsModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "var(--bg-header)",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                width: "90%",
                maxWidth: "600px",
                maxHeight: "80vh",
                overflow: "auto",
                padding: "25px",
                position: "relative",
              }}
            >
              <h2
                style={{
                  color: "var(--btn-primary)",
                  marginBottom: "20px",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "10px",
                }}
              >
                Terms and Conditions
              </h2>

              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "10px",
                  marginBottom: "20px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  background: "var(--bg-dropdown)",
                }}
              >
                <div className="au-modal-body">
                  <p>
                    By accessing or using this system, you agree to the
                    following:
                  </p>

                  <ol className="au-terms-list">
                    <li>
                      You are solely responsible for any data you upload,
                      including photos and information of individuals. Uploading
                      incorrect or malicious data is strictly prohibited.
                    </li>
                    <li>
                      The system may show matches based on facial similarities.
                      It is your responsibility to verify the identity of the
                      person before taking any action. AU Lens is not liable for
                      any consequences of a mistaken identity.
                    </li>
                    <li>
                      AU Lens only facilitates identification through its
                      platform. Any decisions taken after a match, including
                      legal or personal actions, are solely between the uploader
                      and the identifying business.
                    </li>
                    <li>
                      Do not share your login credentials with others. Any
                      activity done through your account will be treated as your
                      action.
                    </li>
                    <li>
                      The platform tracks and logs user activity for security
                      and accountability.
                    </li>
                    <li>
                      Misuse of the system may lead to legal action and
                      permanent account termination.
                    </li>
                    <li>
                      This system may evolve, and by continuing to use it, you
                      agree to any future updates in the Terms of Use.
                    </li>
                  </ol>

                  <p className="au-warning-text">
                    If you do not agree to these terms, do not proceed to use
                    the application.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "15px",
                }}
              >
                <button
                  onClick={handleDeclineTerms}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    background: "var(--bg-dropdown)",
                    color: "var(--text-color)",
                    cursor: "pointer",
                  }}
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    handleAcceptTerms();
                    setShowTermsModal(false);
                  }}
                  className="btn btn--primary"
                >
                  Accept
                </button>
                <button
                  onClick={() => setShowTermsModal(false)}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    background: "var(--bg-dropdown)",
                    color: "var(--text-color)",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="container">
          <h2
            style={{
              color: "var(--btn-primary)",
              marginBottom: "30px",
              borderBottom: "1px solid var(--border-color)",
              paddingBottom: "15px",
            }}
          >
            Update Profile
          </h2>

          <div
            className="detail-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {/* Name */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">Name:</label>
            </div>
            <div>
              <input
                className="form-input"
                name="name"
                defaultValue={user.name}
                placeholder={user.username}
                onChange={handleChange}

              />
            </div>

            {/* Business name */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">Business name:</label>
            </div>
            <div>
              <input
                className="form-input"
                name="business"
                defaultValue={user.business}
                placeholder={user.business}
                onChange={handleChange}

              />
            </div>

            {/* Address */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">Address:</label>
            </div>
            <div>
              <textarea
                className="form-input"
                name="address"
                onChange={handleChange}
                defaultValue={user.address}
                style={{ minHeight: "80px", resize: "vertical" }}
              ></textarea>
            </div>

            {/* Mobile */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">Mobile:</label>
            </div>
            <div>
              <input
                className="form-input"
                name="mobile"
                type="number"
                onChange={handleChange}
                defaultValue={user.mobile}
                onBlur={handleOnBlur}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "10px",
                  padding: "8px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  background: "var(--bg-dropdown)",
                }}
              >
                <span>Same for WhatsApp</span>
                <input
                  type="checkbox"
                  onChange={makeWhatsapp}
                  style={{ width: "16px", height: "16px" }}
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">WhatsApp:</label>
            </div>
            <div>
              <input
                className="form-input"
                type="number"
                name="whatsapp"
                onChange={handleChange}
                defaultValue={whatappNum}

              />
            </div>

            {/* Password */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">Password *</label>
            </div>
            <div>
              <input
                className="form-input"
                type="password"
                name="password"
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">
                Confirm password:
              </label>
            </div>
            <div>
              <input
                className="form-input"
                type="password"
                name="confirmPassword"
                onChange={handleChange}
              />
              {passwordError && (
                <div
                  style={{
                    color: "#ff6b6b",
                    marginTop: "5px",
                    fontSize: "14px",
                  }}
                >
                  Passwords don't match
                </div>
              )}
            </div>

            {/* Email */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">Email:</label>
            </div>
            <div>
              <input
                className="form-input"
                name="email"
                type="email"
                onChange={handleChange}
                defaultValue={user.email}
              />
            </div>

            {/* license */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">license no:</label>
            </div>
            <div>
              <input
                className="form-input"
                name="licenseNo"
                type="text"
                onChange={handleChange}
                defaultValue={user.licenseNo}
              />
            </div>


            {/* lenders license */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">lenders license no:</label>
            </div>
            <div>
              <input
                className="form-input"
                name="lendersLicenseNo"
                type="text"
                onChange={handleChange}
                defaultValue={user.lendersLicenseNo}
              />
            </div>

            {/* State */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">State:</label>
            </div>
            <div>
              <select
                id="state"
                name="state"
                className="form-input"
                value={formData.state ? JSON.stringify(formData.state) : ""}
                onChange={(e) => handleDropdownChange(e, "state")}
                required
              >
                <option value="" disabled>
                  Select state
                </option>
                {states.map((state) => (
                  <option key={state.StateID} value={JSON.stringify(state)}>
                    {state.StateName}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">District:</label>
            </div>
            <div>
              <select
                id="district"
                name="district"
                className="form-input"
                required
                value={
                  formData.district ? JSON.stringify(formData.district) : ""
                }
                onChange={(e) => handleDropdownChange(e, "district")}

                disabled={!formData.state}
                style={{ opacity: formData.state ? 1 : 0.6 }}
              >
                <option value="" disabled>
                  Select district
                </option>
                {districts.map((district) => (
                  <option
                    key={district.DistrictID}
                    value={JSON.stringify(district)}
                  >
                    {district.DistrictName}
                  </option>
                ))}
              </select>
            </div>

            {/* Taluk */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="info-label color-white">Taluk:</label>
            </div>
            <div>
              <select
                id="taluk"
                name="thaluk"
                className="form-input"
                value={formData.taluk ? JSON.stringify(formData.taluk) : ""}
                onChange={(e) => handleDropdownChange(e, "taluk")}
                required
                disabled={!formData.district}
                style={{ opacity: formData.district ? 1 : 0.6 }}
              >
                <option value="" disabled>
                  Select taluk
                </option>
                {taluks.map((taluk) => (
                  <option key={taluk.TalukID} value={JSON.stringify(taluk)}>
                    {taluk.TalukName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div
            style={{
              marginBottom: "30px",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-dropdown)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ width: "18px", height: "18px" }}
              />
              <button
                type="button"
                className="modal-btn"
                onClick={() => setShowTermsModal(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--btn-primary)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                I have read and agree to the User Agreement and Terms of Use
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                color: "#ff6b6b",
                marginBottom: "20px",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ff6b6b",
                background: "rgba(255, 107, 107, 0.1)",
              }}
            >
              Please accept the Terms & Conditions before submitting.
            </div>
          )}

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "space-between",
              marginTop: "30px",
            }}
          >
            <button
              className="btn btn--primary"
              type="submit"
              style={{ flex: "1" }}
            >
              Update Profile
            </button>

            <button
              className="btn color-white"
              type="button"
              onClick={handleLogout}
              style={{
                flex: "1",
                background: "var(--bg-dropdown)",
                border: "1px solid var(--border-color)",
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default TermCond;
