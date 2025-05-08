import React, { useState } from 'react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

const ForgotPassword = ({ setShowForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {


      const res = await axios.post(
        `${BASE_URL}/forgot-password`,
        { email }, // Axios automatically handles the body data as JSON
        {
          withCredentials: true, // Include credentials (cookies, auth headers, etc.)
          headers: {
            'Content-Type': 'application/json', // Optional, as Axios sets this by default for JSON requests
          },
        }
      );

      const data = await res.data;
      if (data.success) {
        setMessage('Reset link sent to your email.');
        setTimeout(() => {
          setShowForgotPassword(false); // Automatically go back to login after success
        }, 2000); // Delay for better UX
      } else {
        setMessage('Email not found.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error sending reset link.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Forgot Password</h2>

      <form onSubmit={handleForgotPassword}>
        <div className="mb-3">
          <label className="form-label">Email ID</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Send Reset Link</button>
      </form>

      <p>{message}</p>

      <button className="btn btn-secondary mt-3" onClick={() => setShowForgotPassword(false)}>
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;
