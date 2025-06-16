import React, { useState } from 'react';
import PaytmCard from '../components/PaytmCard';
import PaytmInput from '../components/PaytmInput';
import PaytmButton from '../components/PaytmButton';
import { useNotifications } from '../components/NotificationProvider';

const OfficerAssignment = ({ fir, onAssign }) => {
  const [officer, setOfficer] = useState(fir.assignedTo || '');
  const [escalate, setEscalate] = useState(false);
  return (
    <div style={{marginTop:12,background:'#f8fafc',padding:12,borderRadius:8,border:'1px solid #e3e8ee'}}>
      <PaytmInput placeholder="Assign Officer Name" value={officer} onChange={e=>setOfficer(e.target.value)} required />
      <label style={{marginTop:8,display:'block'}}>
        <input type="checkbox" checked={escalate} onChange={e=>setEscalate(e.target.checked)} />
        <span style={{marginLeft:8}}>Escalate to SP</span>
      </label>
      <PaytmButton style={{marginTop:8}} onClick={()=>onAssign(officer, escalate)}>Save Assignment</PaytmButton>
    </div>
  );
};

const CaseAssignmentPanel = ({ firs, setFirs }) => {
  const { addNotification } = useNotifications();
  const [selected, setSelected] = useState(null);
  const handleAssign = (id, officer, escalate) => {
    const updated = firs.map(fir => fir.id === id ? { ...fir, assignedTo: officer, escalated: escalate } : fir);
    setFirs(updated);
    localStorage.setItem('firs', JSON.stringify(updated));
    addNotification(`FIR ${id} assigned to ${officer}${escalate ? ' and escalated to SP' : ''}`);
    setSelected(null);
  };
  return (
    <PaytmCard style={{marginTop:24}}>
      <h3>Case Assignment & Escalation</h3>
      {firs.length === 0 ? <p>No FIRs to assign.</p> : firs.map(fir => (
        <div key={fir.id} style={{borderBottom:'1px solid #eee',marginBottom:10,paddingBottom:10}}>
          <b>ID:</b> {fir.id} <b>Status:</b> {fir.status} <b>Assigned To:</b> {fir.assignedTo || 'Unassigned'} {fir.escalated && <span style={{color:'#e67e22',fontWeight:600}}>(Escalated)</span>}
          <PaytmButton style={{marginLeft:8,background:'#0f4c81'}} onClick={()=>setSelected(fir.id)}>Assign/Escalate</PaytmButton>
          {selected === fir.id && <OfficerAssignment fir={fir} onAssign={(officer, escalate)=>handleAssign(fir.id, officer, escalate)} />}
        </div>
      ))}
    </PaytmCard>
  );
};

export default CaseAssignmentPanel;
