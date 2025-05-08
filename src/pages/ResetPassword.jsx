import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/reset-password`,
        { password, token },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json' // optional, Axios sets this automatically
          }
        }
      );
      const data = await res.data;
      if (data.success) {
        setMessage('✅ Password updated successfully. You can now log in.');
        alert(' Password updated successfully! Please login.');
        window.location.href = '/';

      } else {
        setMessage('❌ Invalid or expired link.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error resetting password.');
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🔒 Reset Password</h2>
    
      <form onSubmit={handleResetPassword}>
             
      <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="New Password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ResetPassword;
