import React, { useState, useEffect } from 'react';
import Mainpage from '../pages/Mainpage';
import ForgotPassword from './ForgotPassword';
import { requestFCMToken, deleteFCMToken, onMessageListener } from "../firebase/firebase";

import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userid');
    const storedRoleId = localStorage.getItem('roleid');
    const loginTime = localStorage.getItem('loginTime');

    console.log('haiiiii 111111');
    console.log(storedUserId);
    console.log(storedRoleId);
    console.log(loginTime);


    // handleLogout();
    if (storedUserId && loginTime) {
      const elapsedTime = Date.now() - parseInt(loginTime, 10);
      const maxSessionTime = 8 * 60 * 60 * 1000; // 8 hours
      console.log(elapsedTime);
      if (elapsedTime < maxSessionTime) {
        setRoleId(storedRoleId);
        setLoginSuccess(true);
        
        setTimeout(handleLogout, maxSessionTime - elapsedTime);
      } else {
        handleLogout();
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const fcmToken = await requestFCMToken();
      console.log(fcmToken);
      const response = await fetch('http://localhost:1337/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password,fcmToken }),
      });

      const data = await response.json();

      if (data.user) {
        setRoleId(data.user.roleid);
        localStorage.setItem('userid', data.user.userid);
        localStorage.setItem('roleid', data.user.roleid);
        localStorage.setItem('loginTime', Date.now().toString());
        setLoginSuccess(true);
        setTimeout(handleLogout, 8 * 60 * 60 * 1000);
      } else {
        alert('Invalid login');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('userid');
    localStorage.removeItem('roleid');
    localStorage.removeItem('loginTime');
    setLoginSuccess(false);
    console.log('aaasdfgg');
    await deleteFCMToken(); // Wait for token to be deleted
    // window.location.reload();
  };
   

  if (loginSuccess) {
    return <Mainpage roleId={roleId} onLogout={handleLogout} />;
  }

  return (

  
      <div className="login-container alpha-loginform">
        {showForgotPassword ? (
          <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
        ) : (
          <>
            <div className="login-header">
              <div className="login-header-title">Au Lens</div>
              <div className="login-header-subtitle">A.L.P.H.A</div>
            </div>
            <div className="login-form-container">
              <h1 className="login-title">Log in</h1>
              <form onSubmit={handleLogin}>
                <div className="login-form-group">
                  <label className="login-label" htmlFor="username">Email</label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                    </svg>
                    <input className="login-input" type="text" id="username" placeholder="Registered email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="login-form-group">
                  <label className="login-label" htmlFor="password">
                    Password
                   
                  </label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path fill="currentColor" d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
                    </svg>
                    <input className="login-input" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="login-button">Log in</button>
              </form>
              <a href="#" onClick={() => setShowForgotPassword(true)} className="forgot-password">Forgot your password?</a>
            </div>
          </>
        )}
      </div>
  
  );
};

export default Login;


