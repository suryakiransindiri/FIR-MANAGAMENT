import React, { useEffect, useState } from 'react';
import PaytmCard from '../../components/PaytmCard';

const StationManagement = () => {
  const [stations, setStations] = useState(() => JSON.parse(localStorage.getItem('fir-stations') || '[]'));
  const [city, setCity] = useState('');
  const [station, setStation] = useState('');
  const [msg, setMsg] = useState('');

  const addStation = e => {
    e.preventDefault();
    if (!city || !station) return;
    const updated = [...stations, { city, station }];
    setStations(updated);
    localStorage.setItem('fir-stations', JSON.stringify(updated));
    setMsg('Station added!');
    setCity('');
    setStation('');
  };

  return (
    <PaytmCard>
      <h2>Station/City Management</h2>
      <form className="paytm-form" onSubmit={addStation}>
        <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="paytm-input" required />
        <input placeholder="Station" value={station} onChange={e => setStation(e.target.value)} className="paytm-input" required />
        <button className="paytm-btn" type="submit">Add</button>
      </form>
      {msg && <div style={{color:'green',marginTop:10}}>{msg}</div>}
      <h3 style={{marginTop:24}}>All Stations</h3>
      {stations.length === 0 ? <p>No stations added.</p> : stations.map((s,i) => (
        <div key={i} style={{borderBottom:'1px solid #eee',marginBottom:10,paddingBottom:10}}>
          <b>City:</b> {s.city} <b>Station:</b> {s.station}
        </div>
      ))}
    </PaytmCard>
  );
};

export default StationManagement;
