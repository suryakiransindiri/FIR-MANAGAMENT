import React, { useState } from 'react';
import PaytmCard from '../components/PaytmCard';
import PaytmInput from '../components/PaytmInput';
import PaytmButton from '../components/PaytmButton';

const PublicFIRStatus = () => {
  const [firId, setFirId] = useState('');
  const [fir, setFir] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = e => {
    e.preventDefault();
    const allFIRs = JSON.parse(localStorage.getItem('firs') || '[]');
    const found = allFIRs.find(f => f.id === firId);
    if (found) {
      setFir(found);
      setError('');
    } else {
      setFir(null);
      setError('FIR not found. Please check the ID.');
    }
  };

  return (
    <PaytmCard>
      <h2>Public FIR Status Lookup</h2>
      <form className="paytm-form" onSubmit={handleSearch}>
        <PaytmInput name="firId" placeholder="Enter FIR ID" value={firId} onChange={e=>setFirId(e.target.value)} required />
        <PaytmButton type="submit">Check Status</PaytmButton>
      </form>
      {error && <div style={{color:'red',marginTop:10}}>{error}</div>}
      {fir && (
        <div style={{marginTop:18,background:'#f8fafc',borderRadius:12,padding:16,boxShadow:'0 2px 8px #1877f211'}}>
          <b>ID:</b> {fir.id}<br/>
          <b>Name:</b> {fir.name}<br/>
          <b>City:</b> {fir.city}<br/>
          <b>Station:</b> {fir.station}<br/>
          <b>Status:</b> {fir.status}<br/>
          <b>Date:</b> {fir.date}<br/>
        </div>
      )}
    </PaytmCard>
  );
};

export default PublicFIRStatus;
