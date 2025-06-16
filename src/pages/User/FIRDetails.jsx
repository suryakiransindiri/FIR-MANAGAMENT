import React, { useEffect, useState } from 'react';
import PaytmCard from '../../components/PaytmCard';
import { useParams, useNavigate } from 'react-router-dom';
import PaytmButton from '../../components/PaytmButton';

const STATUS_STEPS = [
  { key: 'Registered', label: 'Registered' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Investigation', label: 'Investigation' },
  { key: 'Transferred', label: 'Transferred' },
  { key: 'Closed', label: 'Closed' }
];

const getStatusStep = status => {
  if (status === 'Registered') return 0;
  if (status === 'In Progress') return 1;
  if (status === 'Investigation') return 2;
  if (status === 'Transferred') return 3;
  if (status === 'Closed') return 4;
  return 0;
};

const StatusTimeline = ({ status }) => {
  const currentStep = getStatusStep(status);
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',margin:'18px 0 24px 0',gap:18}}>
      {STATUS_STEPS.map((step, idx) => (
        <div key={step.key} style={{display:'flex',alignItems:'center',gap:6}}>
          <div style={{
            width:32,height:32,borderRadius:'50%',
            background: idx <= currentStep ? 'linear-gradient(90deg,#1877f2 60%,#0f4c81 100%)' : '#e3e8ee',
            color: idx <= currentStep ? '#fff' : '#888',
            display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:16,
            boxShadow: idx <= currentStep ? '0 2px 8px #1877f233' : 'none',
            border: idx === currentStep ? '2.5px solid #1877f2' : '2px solid #e3e8ee',
            transition:'all 0.2s'
          }}>{idx+1}</div>
          <div style={{fontSize:13,fontWeight:600,color: idx <= currentStep ? '#1877f2' : '#888',minWidth:80,textAlign:'center'}}>{step.label}</div>
          {idx < STATUS_STEPS.length-1 && <div style={{width:32,height:3,background: idx < currentStep ? 'linear-gradient(90deg,#1877f2 60%,#0f4c81 100%)' : '#e3e8ee',borderRadius:2}}></div>}
        </div>
      ))}
    </div>
  );
};

const StarRating = ({ rating, setRating }) => (
  <div style={{fontSize:24,margin:'8px 0'}}>
    {[1,2,3,4,5].map(star => (
      <span key={star} style={{cursor:'pointer',color:star<=rating?'#ffc107':'#e3e8ee'}} onClick={()=>setRating(star)} aria-label={`Rate ${star} star`} tabIndex={0} onKeyDown={e=>{if(e.key==='Enter')setRating(star)}}>★</span>
    ))}
  </div>
);

const FIRDetails = () => {
  const { id } = useParams();
  const [fir, setFir] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const logged = JSON.parse(sessionStorage.getItem('fir-loggedin'));
    if (!logged) {
      navigate('/');
      return;
    }
    const allFIRs = JSON.parse(localStorage.getItem('firs') || '[]');
    setFir(allFIRs.find(f => f.id === id));
  }, [id, navigate]);

  const handleFeedback = () => {
    if (!rating) return;
    let allFIRs = JSON.parse(localStorage.getItem('firs') || '[]');
    allFIRs = allFIRs.map(f => f.id === fir.id ? { ...f, feedback, rating } : f);
    localStorage.setItem('firs', JSON.stringify(allFIRs));
    setSubmitted(true);
  };

  if (!fir) return <PaytmCard><h2>FIR Details</h2><p>FIR not found.</p></PaytmCard>;

  return (
    <PaytmCard>
      <h2>FIR Details</h2>
      <StatusTimeline status={fir.status} />
      <b>ID:</b> {fir.id}<br/>
      <b>Name:</b> {fir.name}<br/>
      <b>City:</b> {fir.city}<br/>
      <b>Station:</b> {fir.station}<br/>
      <b>Location:</b> {fir.location}<br/>
      <b>Status:</b> {fir.status}<br/>
      <b>Date:</b> {fir.date}<br/>
      <b>Details:</b> <div style={{whiteSpace:'pre-wrap'}}>{fir.details}</div>
      {fir.evidence &&
        <div style={{marginTop:10}}>
          <b>Evidence/Document:</b> <a href={fir.evidence} target="_blank" rel="noopener noreferrer">{fir.evidenceName || 'View File'}</a>
        </div>
      }
      {fir.adminComment && <div style={{marginTop:10}}><b>Admin Comment:</b> {fir.adminComment}</div>}
      {fir.status === 'Closed' && !fir.rating && (
        <div style={{marginTop:18,background:'#f8fafc',borderRadius:12,padding:16,boxShadow:'0 2px 8px #1877f211'}}>
          <h3>Rate & Feedback</h3>
          <StarRating rating={rating} setRating={setRating} />
          <textarea className="paytm-input" placeholder="Your feedback (optional)" value={feedback} onChange={e=>setFeedback(e.target.value)} style={{marginTop:8}} />
          <PaytmButton style={{marginTop:8}} onClick={handleFeedback} disabled={!rating}>Submit</PaytmButton>
          {submitted && <div style={{color:'green',marginTop:8}}>Thank you for your feedback!</div>}
        </div>
      )}
      {fir.status === 'Closed' && fir.rating && (
        <div style={{marginTop:18,background:'#f8fafc',borderRadius:12,padding:16,boxShadow:'0 2px 8px #1877f211'}}>
          <h3>Your Rating</h3>
          <StarRating rating={fir.rating} setRating={()=>{}} />
          {fir.feedback && <div style={{marginTop:8}}><b>Feedback:</b> {fir.feedback}</div>}
        </div>
      )}
    </PaytmCard>
  );
};

export default FIRDetails;
