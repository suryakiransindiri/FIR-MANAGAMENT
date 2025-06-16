import React, { useState } from 'react';
import PaytmCard from '../components/PaytmCard';
import PaytmInput from '../components/PaytmInput';
import PaytmButton from '../components/PaytmButton';

const FIRStatus = () => {
  const [firId, setFirId] = useState('');
  const [status, setStatus] = useState('');

  const handleChange = e => setFirId(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    const allFIRs = JSON.parse(localStorage.getItem('firs') || '[]');
    const fir = allFIRs.find(f => f.id === firId);
    setStatus(fir ? `Status: ${fir.status}` : 'FIR not found');
  };

  return (
    <PaytmCard>
      <h2>FIR Status</h2>
      <form className="paytm-form" onSubmit={handleSubmit}>
        <PaytmInput placeholder="FIR Number" value={firId} onChange={handleChange} required />
        <PaytmButton type="submit">Check Status</PaytmButton>
      </form>
      <div className="paytm-status-result">
        {status}
      </div>
    </PaytmCard>
  );
};

export default FIRStatus;
