import React, { useState, useEffect } from 'react';
import PaytmCard from '../components/PaytmCard';
import PaytmInput from '../components/PaytmInput';
import PaytmButton from '../components/PaytmButton';
import { useNavigate } from 'react-router-dom';

function generateFIRId() {
  return 'FIR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function generateFileUrl(file) {
  return URL.createObjectURL(file);
}

const SubmitFIR = () => {
  const [form, setForm] = useState({
    name: '',
    city: '',
    station: '',
    location: '',
    details: '',
    date: '',
  });
  const [firId, setFirId] = useState('');
  const [stations, setStations] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [stationOptions, setStationOptions] = useState([]);
  const [evidence, setEvidence] = useState(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check session
    const logged = JSON.parse(sessionStorage.getItem('fir-loggedin'));
    if (!logged) {
      navigate('/');
      return;
    }
    setForm(f => ({ ...f, name: logged.username }));
    const allStations = JSON.parse(localStorage.getItem('fir-stations') || '[]');
    setStations(allStations);
    setCityOptions([...new Set(allStations.map(s => s.city))]);
  }, [navigate]);

  useEffect(() => {
    setStationOptions(stations.filter(s => s.city === form.city).map(s => s.station));
  }, [form.city, stations]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setEvidence(file);
    if (file) setEvidenceUrl(generateFileUrl(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const id = generateFIRId();
    setFirId(id);
    const allFIRs = JSON.parse(localStorage.getItem('firs') || '[]');
    let firData = { ...form, id };
    if (evidence) {
      const evidenceData = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function(ev) { resolve(ev.target.result); };
        reader.readAsDataURL(evidence);
      });
      firData.evidence = evidenceData;
      firData.evidenceName = evidence.name;
    }
    allFIRs.push(firData);
    localStorage.setItem('firs', JSON.stringify(allFIRs));
    setForm(f => ({ ...f, city: '', station: '', location: '', details: '', date: '' }));
    setEvidence(null);
    setEvidenceUrl('');
    setSubmitting(false);
  };

  return (
    <PaytmCard>
      <h2>Submit FIR</h2>
      <form className="paytm-form" onSubmit={handleSubmit}>
        <PaytmInput name="name" placeholder="Complainant Name" value={form.name} onChange={handleChange} required readOnly />
        <select name="city" className="paytm-input" value={form.city} onChange={handleChange} required>
          <option value="">Select City</option>
          {cityOptions.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
        <select name="station" className="paytm-input" value={form.station} onChange={handleChange} required disabled={!form.city}>
          <option value="">Select Station</option>
          {stationOptions.map(station => <option key={station} value={station}>{station}</option>)}
        </select>
        <PaytmInput name="location" placeholder="Incident Location" value={form.location} onChange={handleChange} required />
        <PaytmInput name="date" type="date" placeholder="Incident Date" value={form.date} onChange={handleChange} required />
        <textarea name="details" placeholder="Incident Details" className="paytm-input" value={form.details} onChange={handleChange} required />
        <div style={{marginTop:8,marginBottom:8}}>
          <label style={{fontWeight:500}}>Upload Evidence/Document (optional):</label>
          <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="paytm-input" style={{padding:0}} />
          {evidenceUrl && <div style={{marginTop:8}}><a href={evidenceUrl} target="_blank" rel="noopener noreferrer">Preview Uploaded File</a></div>}
        </div>
        <PaytmButton type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</PaytmButton>
      </form>
      {firId && <div style={{color: 'green', marginTop: 10}}>FIR Registered! Your FIR ID: <b>{firId}</b></div>}
    </PaytmCard>
  );
};

export default SubmitFIR;
