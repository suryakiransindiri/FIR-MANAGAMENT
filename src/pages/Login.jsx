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

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
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
    let users = JSON.parse(sessionStorage.getItem('fir-users') || '[]');
    const user = users.find(u => u.username === form.username && u.password === form.password);
    if (user) {
      setError('');
      sessionStorage.setItem('fir-loggedin', JSON.stringify(user));
      sessionStorage.setItem('fir-lastActive', Date.now());
      navigate('/submit-fir');
    } else {
      setError('Invalid credentials or user not registered.');
    }
  };

  // Session timeout (20 min)
  React.useEffect(() => {
    const interval = setInterval(() => {
      const last = sessionStorage.getItem('fir-lastActive');
      if (last && Date.now() - Number(last) > 20*60*1000) {
        sessionStorage.removeItem('fir-loggedin');
        sessionStorage.removeItem('fir-lastActive');
        window.location.href = '/';
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PaytmCard>
      <h2>Login</h2>
      <form className="paytm-form" onSubmit={handleSubmit}>
        <PaytmInput name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <PaytmInput name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontFamily:'monospace',fontSize:18,background:'#e3f0ff',padding:'4px 12px',borderRadius:8,letterSpacing:2}}>{captcha}</span>
          <PaytmInput name="captcha" placeholder="Enter CAPTCHA" value={captchaInput} onChange={e=>setCaptchaInput(e.target.value.toUpperCase())} required style={{maxWidth:140}} />
          <button type="button" className="paytm-btn" style={{padding:'4px 10px',background:'#aaa'}} onClick={()=>setCaptcha(generateCaptcha())}>↻</button>
        </div>
        <PaytmButton type="submit">Login</PaytmButton>
      </form>
      {error && <div style={{color: 'red', marginTop: 10}}>{error}</div>}
      <div style={{marginTop: 16}}>
        <span>New user? </span>
        <a href="/signup" style={{color: '#1877f2'}}>Register here</a>
      </div>
    </PaytmCard>
  );
};

export default Login;
