import React, { useState } from 'react';
import PaytmCard from '../components/PaytmCard';
import PaytmInput from '../components/PaytmInput';
import PaytmButton from '../components/PaytmButton';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUsername = e => setUsername(e.target.value);
  const handleNewPassword = e => setNewPassword(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    let users = JSON.parse(sessionStorage.getItem('fir-users') || '[]');
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) {
      setError('Username not found.');
      return;
    }
    setStep(2);
    setError('');
  };

  const handleReset = e => {
    e.preventDefault();
    let users = JSON.parse(sessionStorage.getItem('fir-users') || '[]');
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) {
      setError('Username not found.');
      return;
    }
    users[idx].password = newPassword;
    sessionStorage.setItem('fir-users', JSON.stringify(users));
    setSuccess(true);
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <PaytmCard>
      <h2>Forgot Password</h2>
      {step === 1 && (
        <form className="paytm-form" onSubmit={handleSubmit}>
          <PaytmInput name="username" placeholder="Enter your username" value={username} onChange={handleUsername} required />
          <PaytmButton type="submit">Next</PaytmButton>
        </form>
      )}
      {step === 2 && (
        <form className="paytm-form" onSubmit={handleReset}>
          <PaytmInput name="newPassword" type="password" placeholder="Enter new password" value={newPassword} onChange={handleNewPassword} required />
          <PaytmButton type="submit">Reset Password</PaytmButton>
        </form>
      )}
      {error && <div style={{color:'red',marginTop:10}}>{error}</div>}
      {success && <div style={{color:'green',marginTop:10}}>Password reset! Redirecting to login...</div>}
    </PaytmCard>
  );
};

export default ForgotPassword;
