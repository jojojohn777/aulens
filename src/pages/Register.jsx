import React, { useState, useEffect } from 'react';
import './Register.css';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    taluk: '',
    ownerName: '',
    businessName: '',
    address: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    whatsapp: ''
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Fetch states on component mount

  useEffect(() => {
    axios.get(`${BASE_URL}/state/stateAll`)
      .then((res) => setStates(res.data))
      .catch((err) => console.error('Error fetching states:', err));
  }, []);

  // Fetch districts when state is selected
  useEffect(() => {
    if (formData.state) {
      axios.get(`${BASE_URL}/districts/state/${formData.state.StateID}`)
        .then((res) => setDistricts(res.data))
        .catch((err) => console.error('Error fetching districts:', err));
    } else {
      setDistricts([]);
      setTaluks([]);
    }
  }, [formData.state]);

  // Fetch taluks when district is selected
  useEffect(() => {
    if (formData.district) {
      axios
        .get(`${BASE_URL}/taluks/districts/${formData.district.DistrictID}`)
        .then((res) => setTaluks(res.data))
        .catch((err) => console.error('Error fetching taluks:', err));
    } else {
      setTaluks([]);
    }
  }, [formData.district]);

  // Validate form before enabling submit button
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const { state, district, taluk, ownerName, businessName, address, mobile, email, password, confirmPassword, whatsapp } = formData;
    if (!state || !district || !taluk || !ownerName || !businessName || !address || !mobile || !email || !password || !whatsapp) {
      setError('⚠️ Please fill in all required fields!');
      setIsButtonDisabled(true);
    } else if (password !== confirmPassword) {
      setError('⚠️ Passwords do not match!');
      setIsButtonDisabled(true);
    } else {
      setError('');
      setIsButtonDisabled(false);
    }
  };

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle dropdown change (store both ID and name)
  const handleDropdownChange = (e, type) => {
    setFormData(prevState => ({
      ...prevState,
      [type]: e.target.value // Store only the ID
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if email already exists 

      const checkResponse = await axios.post(
        `${BASE_URL}/user/checkemail`,
        { email: formData.email },
        {
          headers: {
            'Content-Type': 'application/json', // optional with Axios
          },
        }
      );

      const checkResult = await checkResponse.data;

      if (checkResponse.status===200 && checkResult.exists) {
        setError('Email already exists. Please use a different email.');
        return;
      }

      // Proceed with registration
      const submissionData = {
        ...formData, // Already contains state, district, taluk as IDs
      };

      const response = await axios.post(
        `${BASE_URL}/user/create`,
        submissionData,
        {
          withCredentials: true, // to include cookies/session info
          headers: {
            'Content-Type': 'application/json', // optional, Axios sets this by default
          },
        }
      );

      const result = await response.data;
      if (response.status===200) {
        alert('Registration Successful! Please login.');
        window.location.href = '/';
      } else {
        setError(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h1 className="register-title">Create an account</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* State Dropdown */}
          <div className="form-group">
            <label htmlFor="state">State *</label>
            <select
              id="state"
              name="state"
              className="form-select"
              value={formData.state}
              onChange={(e) => handleDropdownChange(e, 'state')}
              required
            >
              <option value="" disabled>Select state</option>
              {states.map((state) => (
                <option key={state.StateID} value={state.StateID}>
                  {state.StateName}
                </option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div className="form-group">
            <label htmlFor="district">District *</label>
            <select
              id="district"
              name="district"
              className="form-select"
              value={formData.district}
              onChange={(e) => handleDropdownChange(e, 'district')}
              required
              disabled={!formData.state}
            >
              <option value="" disabled>Select district</option>
              {districts.map((district) => (
                <option key={district.DistrictID} value={district.DistrictID}>
                  {district.DistrictName}
                </option>
              ))}
            </select>
          </div>

          {/* Taluk Dropdown */}
          <div className="form-group">
            <label htmlFor="taluk">Taluk *</label>
            <select
              id="taluk"
              name="taluk"
              className="form-select"
              value={formData.taluk}
              onChange={(e) => handleDropdownChange(e, 'taluk')}
              required
              disabled={!formData.district}
            >
              <option value="" disabled>Select taluk</option>
              {taluks.map((taluk) => (
                <option key={taluk.TalukID} value={taluk.TalukID}>
                  {taluk.TalukName}
                </option>
              ))}
            </select>
          </div>

          {/* Owner Name */}
          <div className="form-group">
            <label htmlFor="ownerName">Name of the Registered Owner *</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              placeholder="Enter owner name"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Business Name */}
          <div className="form-group">
            <label htmlFor="businessName">Name of the Business *</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              placeholder="Enter business name"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Business Address */}
          <div className="form-group">
            <label htmlFor="address">Address of the Business *</label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter business address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
            ></textarea>
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number *</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          {/* Whatsapp Number */}
          <div className="form-group">
            <label htmlFor="whatsapp">Whatsapp Number *</label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              placeholder="Enter whatsapp number"
              value={formData.whatsapp}
              onChange={handleChange}
              required
            />
          </div>


          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email ID *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Create Password *</label>
            <div className="password-input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="************"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Repeat password *</label>
            <div className="password-input-container">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="************"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
              >
                {confirmPasswordVisible ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="register-button"
            disabled={isButtonDisabled}
          >
            Sign Up
          </button>

          {/* Login Link */}
          <p className="login-link">
            Already have an account? <a href="/login">Click here to Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

