import React, { useState } from 'react';
import PaytmCard from '../components/PaytmCard';
import PaytmInput from '../components/PaytmInput';
import PaytmButton from '../components/PaytmButton';

const Help = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Simulate sending (could be extended to backend/email)
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <PaytmCard>
      <h2>Help & FAQ</h2>
      <h3>How do I file a new FIR?</h3>
      <p>Login and click 'Submit FIR' in the navigation bar. Fill in all required details and submit.</p>
      <h3>How can I check my FIR status?</h3>
      <p>Go to 'FIR Status' and enter your FIR ID to see the current status.</p>
      <h3>Who can access the admin panel?</h3>
      <p>Only authorized police/admin users can access the admin panel and manage FIRs.</p>
      <h3>Need more help?</h3>
      <p>Contact your local police station or use the chatbot below for quick answers.</p>
      <div style={{marginTop:32,background:'#f8fafc',borderRadius:12,padding:18,boxShadow:'0 2px 8px #1877f211'}}>
        <h3>Contact Support</h3>
        <form className="paytm-form" onSubmit={handleSubmit}>
          <PaytmInput name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
          <PaytmInput name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
          <textarea name="message" className="paytm-input" placeholder="How can we help you?" value={form.message} onChange={handleChange} required />
          <PaytmButton type="submit">Send</PaytmButton>
        </form>
        {sent && <div style={{color:'green',marginTop:10}}>Your message has been sent! Our team will contact you soon.</div>}
      </div>
    </PaytmCard>
  );
};

export default Help;
