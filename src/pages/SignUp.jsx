import React, { useState } from 'react';
import PaytmCard from '../components/PaytmCard';
import PaytmInput from '../components/PaytmInput';
import PaytmButton from '../components/PaytmButton';
import { useNavigate } from 'react-router-dom';

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let str = '';
  for (let i = 0; i < 5; i++) str += chars[Math.floor(Math.random() * chars.length)];
  return str;
}

const SignUp = () => {
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (captchaInput !== captcha) {
      setError('CAPTCHA does not match.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }
    if (!form.username || !form.password || !form.role) {
      setError('All fields are required.');
      return;
    }
    let users = JSON.parse(sessionStorage.getItem('fir-users') || '[]');
    if (users.some(u => u.username === form.username)) {
      setError('Username already exists. Please choose another.');
      return;
    }
    users.push(form);
    sessionStorage.setItem('fir-users', JSON.stringify(users));
    setSuccess(true);
    // Redirect to login after 1.2s
    setTimeout(() => navigate('/'), 1200);
  };

  return (
    <PaytmCard>
      <h2>Sign Up</h2>
      <form className="paytm-form" onSubmit={handleSubmit}>
        <PaytmInput name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <PaytmInput name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select name="role" className="paytm-input" value={form.role} onChange={handleChange} required>
          <option value="user">User</option>
          <option value="officer">Police Officer</option>
          <option value="admin">Admin/SP</option>
        </select>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontFamily:'monospace',fontSize:18,background:'#e3f0ff',padding:'4px 12px',borderRadius:8,letterSpacing:2}}>{captcha}</span>
          <PaytmInput name="captcha" placeholder="Enter CAPTCHA" value={captchaInput} onChange={e=>setCaptchaInput(e.target.value.toUpperCase())} required style={{maxWidth:140}} />
          <button type="button" className="paytm-btn" style={{padding:'4px 10px',background:'#aaa'}} onClick={()=>setCaptcha(generateCaptcha())}>↻</button>
        </div>
        <PaytmButton type="submit">Register</PaytmButton>
      </form>
      {error && <div style={{color: 'red', marginTop: 10}}>{error}</div>}
      {success && <div style={{color: 'green', marginTop: 10}}>Registration successful! Redirecting to login...</div>}
    </PaytmCard>
  );
};

export default SignUp;
