import React, { useState, useEffect } from 'react';
import PaytmCard from '../../components/PaytmCard';
import PaytmInput from '../../components/PaytmInput';
import PaytmButton from '../../components/PaytmButton';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem('fir-loggedin')));
  const [form, setForm] = useState({ username: user?.username || '', password: user?.password || '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const logged = JSON.parse(sessionStorage.getItem('fir-loggedin'));
    if (!logged) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = e => {
    e.preventDefault();
    let users = JSON.parse(sessionStorage.getItem('fir-users') || '[]');
    users = users.map(u => u.username === user.username ? { ...u, ...form } : u);
    sessionStorage.setItem('fir-users', JSON.stringify(users));
    sessionStorage.setItem('fir-loggedin', JSON.stringify({ ...user, ...form }));
    setMsg('Profile updated!');
    setUser({ ...user, ...form });
  };

  return (
    <PaytmCard>
      <h2>Profile</h2>
      <form className="paytm-form" onSubmit={handleSave}>
        <PaytmInput name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <PaytmInput name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <PaytmButton type="submit">Save</PaytmButton>
      </form>
      {msg && <div style={{color:'green',marginTop:10}}>{msg}</div>}
    </PaytmCard>
  );
};

export default Profile;
