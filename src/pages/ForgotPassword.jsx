import React, { useState } from 'react';

const ForgotPassword = ({ setShowForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:1337/forgot-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
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
