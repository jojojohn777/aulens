import React, { useState, useEffect } from 'react';
import './Register.css';

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
    confirmPassword: ''
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // New state variables for phone number and OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch states on component mount
  useEffect(() => {
    fetch('http://localhost:1337/state/stateAll')
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error('Error fetching states:', err));
  }, []);

  // Fetch districts when state is selected
  useEffect(() => {
    if (formData.state) {
      fetch(`http://localhost:1337/districts/state/${formData.state.StateID}`)
        .then((res) => res.json())
        .then((data) => setDistricts(data))
        .catch((err) => console.error('Error fetching districts:', err));
    } else {
      setDistricts([]);
      setTaluks([]);
    }
  }, [formData.state]);

  // Fetch taluks when district is selected
  useEffect(() => {
    if (formData.district) {
      fetch(`http://localhost:1337/taluks/districts/${formData.district.DistrictID}`)
        .then((res) => res.json())
        .then((data) => setTaluks(data))
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
    const { state, district, taluk, ownerName, businessName, address, mobile, email, password, confirmPassword } = formData;
    if (!state || !district || !taluk || !ownerName || !businessName || !address || !mobile || !email || !password) {
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
    try {
      const selectedOption = JSON.parse(e.target.value);
      setFormData(prevState => ({
        ...prevState,
        [type]: selectedOption
      }));
    } catch (error) {
      console.error('Error parsing dropdown value:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Handle phone number check and OTP send
  const handlePhoneNumberCheck = async () => {
    try {
      const response = await fetch(`http://localhost:1337/pendingOfficers/checkPhoneNumberOtPVerify/${phoneNumber}`);
      const result = await response.json();

      if (response.ok && result.exists) {
        setShowOtpInput(true);
        // Call API to send OTP
        await fetch('http://localhost:1337/sendOtp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber }),
        });
      } else {
        setError('Phone number does not exist.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to check phone number.');
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async () => {
    try {
      const response = await fetch('http://localhost:1337/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const result = await response.json();

      if (response.ok && result.verified) {
        setShowForm(true);
      } else {
        setError('Invalid OTP.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to verify OTP.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if email already exists
      const checkResponse = await fetch('http://localhost:1337/user/checkemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const checkResult = await checkResponse.json();

      if (checkResponse.ok && checkResult.exists) {
        setError('Email already exists. Please use a different email.');
        return;
      }

      // Proceed with registration
      const submissionData = {
        ...formData,
        state: formData.state.StateName,
        district: formData.district.DistrictName,
        taluk: formData.taluk.TalukName,
      };

      const response = await fetch('http://localhost:1337/user/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();
      if (response.ok) {
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
        {!showForm ? (
          <>
            <h1 className="register-title">Verify Phone Number</h1>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            {showOtpInput && (
              <div className="form-group">
                <label htmlFor="otp">OTP *</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            )}
            {error && <p className="error-message">{error}</p>}
            <button
              type="button"
              className="register-button"
              onClick={showOtpInput ? handleOtpVerification : handlePhoneNumberCheck}
            >
              {showOtpInput ? 'Verify OTP' : 'Check Phone Number'}
            </button>
          </>
        ) : (
          <>
            <h1 className="register-title">Create an account</h1>
            <form className="register-form" onSubmit={handleSubmit}>
              {/* State Dropdown */}
              <div className="form-group">
                <label htmlFor="state">State *</label>
                <select id="state" name="state" className="form-select" value={formData.state ? JSON.stringify(formData.state) : ''} onChange={(e) => handleDropdownChange(e, 'state')} required>
                  <option value="" disabled>Select state</option>
                  {states.map((state) => (<option key={state.StateID} value={JSON.stringify(state)}>{state.StateName}</option>))}
                </select>
              </div>

              {/* District Dropdown */}
              <div className="form-group">
                <label htmlFor="district">District *</label>
                <select id="district" name="district" className="form-select" value={formData.district ? JSON.stringify(formData.district) : ''} onChange={(e) => handleDropdownChange(e, 'district')} required disabled={!formData.state}>
                  <option value="" disabled>Select district</option>
                  {districts.map((district) => (<option key={district.DistrictID} value={JSON.stringify(district)}>{district.DistrictName}</option>))}
                </select>
              </div>

              {/* Taluk Dropdown */}
              <div className="form-group">
                <label htmlFor="taluk">Taluk *</label>
                <select id="taluk" name="taluk" className="form-select" value={formData.taluk ? JSON.stringify(formData.taluk) : ''} onChange={(e) => handleDropdownChange(e, 'taluk')} required disabled={!formData.district}>
                  <option value="" disabled>Select taluk</option>
                  {taluks.map((taluk) => (<option key={taluk.TalukID} value={JSON.stringify(taluk)}>{taluk.TalukName}</option>))}
                </select>
              </div>

              {/* Owner Name */}
              <div className="form-group">
                <label htmlFor="ownerName">Name of the Registered Owner *</label>
                <input type="text" id="ownerName" name="ownerName" placeholder="Enter owner name" value={formData.ownerName} onChange={handleChange} required />
              </div>

              {/* Business Name */}
              <div className="form-group">
                <label htmlFor="businessName">Name of the Business *</label>
                <input type="text" id="businessName" name="businessName" placeholder="Enter business name" value={formData.businessName} onChange={handleChange} required />
              </div>

              {/* Business Address */}
              <div className="form-group">
                <label htmlFor="address">Address of the Business *</label>
                <textarea id="address" name="address" placeholder="Enter business address" value={formData.address} onChange={handleChange} required rows="3"></textarea>
              </div>

              {/* Mobile Number */}
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number (WhatsApp) *</label>
                <input type="tel" id="mobile" name="mobile" placeholder="Enter mobile number" value={formData.mobile} onChange={handleChange} required />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email ID *</label>
                <input type="email" id="email" name="email" placeholder="email@email.com" value={formData.email} onChange={handleChange} required />
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Create Password *</label>
                <div className="password-input-container">
                  <input type={passwordVisible ? "text" : "password"}
                    id="password" name="password" placeholder="************" value={formData.password} onChange={handleChange} required />
                  <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>{passwordVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Repeat password *</label>
                <div className="password-input-container">
                  <input type={confirmPasswordVisible ? "text" : "password"} id="confirmPassword" name="confirmPassword" placeholder="************" value={formData.confirmPassword} onChange={handleChange} required />
                  <button type="button" className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                    {confirmPasswordVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="error-message">{error}</p>}

              {/* Submit Button */}
              <button type="submit" className="register-button" disabled={isButtonDisabled}>
                Sign Up
              </button>

              {/* Login Link */}
              <p className="login-link">
                Already have an account? <a href="/login">Click here to Login</a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;