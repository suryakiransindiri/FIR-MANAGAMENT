import React, { useState } from 'react';
import PaytmCard from '../components/PaytmCard';
import PaytmInput from '../components/PaytmInput';
import PaytmButton from '../components/PaytmButton';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaExchangeAlt, FaIdBadge } from 'react-icons/fa';
import { useNotifications } from '../components/NotificationProvider';
import CaseAssignmentPanel from '../components/CaseAssignmentPanel';

const ADMIN_IPS = ['127.0.0.1', '::1']; // Example: local admin IPs

function getStats(firs) {
  const stats = {};
  firs.forEach(fir => {
    const date = fir.date || 'Unknown';
    const city = fir.city || 'Unknown';
    const station = fir.station || 'Unknown';
    if (!stats[date]) stats[date] = {};
    if (!stats[date][city]) stats[date][city] = {};
    if (!stats[date][city][station]) stats[date][city][station] = 0;
    stats[date][city][station]++;
  });
  return stats;
}

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [firs, setFirs] = useState([]);
  const [editingFIR, setEditingFIR] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', city: '', station: '', location: '', details: '' });
  const [transferFIR, setTransferFIR] = useState(null);
  const [transferForm, setTransferForm] = useState({ city: '', station: '', approved: false });
  const [stationsList, setStationsList] = useState([]);
  const [investigationFIR, setInvestigationFIR] = useState(null);
  const [investigationForm, setInvestigationForm] = useState({ assignedTo: '', started: false, notes: '' });
  const [showAudit, setShowAudit] = useState(false);
  const [auditLog, setAuditLog] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('fir-loggedin'));
    if (!user) {
      navigate('/');
      return;
    }
    const userIp = '127.0.0.1'; // Placeholder for demo
    setIsAdmin(ADMIN_IPS.includes(userIp));
    setFirs(JSON.parse(localStorage.getItem('firs') || '[]'));
    setStationsList(JSON.parse(localStorage.getItem('fir-stations') || '[]'));
  }, [navigate]);

  const updateStatus = (id, status) => {
    const updated = firs.map(fir => fir.id === id ? { ...fir, status } : fir);
    setFirs(updated);
    localStorage.setItem('firs', JSON.stringify(updated));
    // Notification for user
    const changedFIR = updated.find(f => f.id === id);
    if (changedFIR) {
      // Store notification for the FIR's user
      let userNotifs = JSON.parse(localStorage.getItem(`notifs-${changedFIR.name}`) || '[]');
      userNotifs.push({
        msg: `Status of your FIR (ID: ${changedFIR.id}) changed to: ${status}`,
        time: new Date().toLocaleString()
      });
      localStorage.setItem(`notifs-${changedFIR.name}`, JSON.stringify(userNotifs));
      addNotification(`Status of FIR ${changedFIR.id} updated to ${status}`);
    }
    // Audit log
    let audit = JSON.parse(localStorage.getItem('fir-audit') || '[]');
    audit.push({
      action: 'Status Update',
      firId: id,
      status,
      by: JSON.parse(sessionStorage.getItem('fir-loggedin'))?.username,
      time: new Date().toLocaleString()
    });
    localStorage.setItem('fir-audit', JSON.stringify(audit));
  };

  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this FIR?')) {
      const updated = firs.filter(fir => fir.id !== id);
      setFirs(updated);
      localStorage.setItem('firs', JSON.stringify(updated));
    }
  };

  const handleEditSave = id => {
    const updated = firs.map(fir => fir.id === id ? { ...fir, ...editForm } : fir);
    setFirs(updated);
    localStorage.setItem('firs', JSON.stringify(updated));
    setEditingFIR(null);
  };

  React.useEffect(() => {
    if (editingFIR) {
      const fir = firs.find(f => f.id === editingFIR);
      if (fir) setEditForm({ name: fir.name, city: fir.city, station: fir.station, location: fir.location, details: fir.details });
    }
  }, [editingFIR, firs]);

  const handleTransfer = (fir) => {
    setTransferFIR(fir.id);
    setTransferForm({ city: '', station: '', approved: false });
  };

  const handleTransferSave = (id) => {
    if (!transferForm.city || !transferForm.station || !transferForm.approved) return;
    const updated = firs.map(fir => fir.id === id ? { ...fir, city: transferForm.city, station: transferForm.station, status: 'Transferred' } : fir);
    setFirs(updated);
    localStorage.setItem('firs', JSON.stringify(updated));
    setTransferFIR(null);
  };

  const handleInvestigation = (fir) => {
    setInvestigationFIR(fir.id);
    setInvestigationForm({ assignedTo: fir.assignedTo || '', started: !!fir.investigationStarted, notes: fir.investigationNotes || '' });
  };

  const handleInvestigationSave = (id) => {
    const updated = firs.map(fir => fir.id === id ? { ...fir, assignedTo: investigationForm.assignedTo, investigationStarted: investigationForm.started, investigationNotes: investigationForm.notes } : fir);
    setFirs(updated);
    localStorage.setItem('firs', JSON.stringify(updated));
    setInvestigationFIR(null);
  };

  const loadAuditLog = () => {
    setAuditLog(JSON.parse(localStorage.getItem('fir-audit') || '[]').reverse());
    setShowAudit(true);
  };

  const filteredFIRs = firs.filter(fir => {
    const matchesSearch =
      fir.id.toLowerCase().includes(search.toLowerCase()) ||
      (fir.name && fir.name.toLowerCase().includes(search.toLowerCase())) ||
      (fir.city && fir.city.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter ? fir.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const stats = getStats(firs);

  if (!isAdmin) {
    return <PaytmCard><h2>Admin Panel</h2><p>Access denied. You do not have admin privileges.</p></PaytmCard>;
  }

  return (
    <PaytmCard>
      <h2>Admin Panel</h2>
      <PaytmButton style={{marginBottom:16,background:'#0f4c81'}} onClick={loadAuditLog}>{showAudit ? 'Hide' : 'Show'} Audit Log</PaytmButton>
      {showAudit && (
        <div style={{background:'#f8fafc',borderRadius:12,padding:16,marginBottom:18,boxShadow:'0 2px 8px #1877f211'}}>
          <b>Audit Log</b>
          {auditLog.length === 0 ? <div style={{marginTop:8}}>No actions logged yet.</div> :
            <ul style={{textAlign:'left',marginTop:8,maxHeight:220,overflowY:'auto'}}>
              {auditLog.map((log,i) => (
                <li key={i} style={{marginBottom:6}}>
                  <span style={{color:'#1877f2',fontWeight:600}}>{log.action}</span> on FIR <b>{log.firId}</b> to <b>{log.status}</b> by <b>{log.by}</b> <span style={{fontSize:12,color:'#888'}}>{log.time}</span>
                </li>
              ))}
            </ul>
          }
        </div>
      )}
      <div className="paytm-admin-list">
        <div style={{marginBottom:16,display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
          <input className="paytm-input" style={{maxWidth:180}} placeholder="Search by ID, Name, City" value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="paytm-input" style={{maxWidth:160}} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Registered">Registered</option>
            <option value="In Progress">In Progress</option>
            <option value="Investigation">Investigation</option>
            <option value="Transferred">Transferred</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <h3>FIR Dashboard (Cases by Date, City, Station)</h3>
        {Object.keys(stats).length === 0 ? <p>No FIRs to display.</p> : (
          <div style={{marginBottom: 20}}>
            {Object.entries(stats).map(([date, cities]) => (
              <div key={date} style={{marginBottom: 10}}>
                <b>Date:</b> {date}
                <ul>
                  {Object.entries(cities).map(([city, stations]) => (
                    <li key={city}>
                      <b>City:</b> {city}
                      <ul>
                        {Object.entries(stations).map(([station, count]) => (
                          <li key={station}>
                            <b>Station:</b> {station} - <b>Cases:</b> {count}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <h3>All FIRs</h3>
        <div style={{marginTop: '2rem'}}></div>
        {filteredFIRs.length === 0 ? <p>No FIRs to display.</p> : filteredFIRs.map(fir => (
          <div key={fir.id} style={{borderBottom: '1px solid #eee', marginBottom: 10, paddingBottom: 10, position:'relative'}}>
            <span style={{position:'absolute',right:10,top:10,background:'#1877f2',color:'#fff',borderRadius:8,padding:'4px 12px',fontWeight:600,letterSpacing:1,fontSize:14,boxShadow:'0 2px 8px #1877f233',display:'flex',alignItems:'center',gap:6}}><FaIdBadge style={{marginRight:4}}/>FIR ID: {fir.id}</span>
            <b>Name:</b> {fir.name}<br/>
            <b>City:</b> {fir.city || 'Unknown'}<br/>
            <b>Station:</b> {fir.station || 'Unknown'}<br/>
            <b>Location:</b> {fir.location}<br/>
            <b>Date:</b> {fir.date}<br/>
            <b>Status:</b> {fir.status}<br/>
            <select value={fir.status} onChange={e => updateStatus(fir.id, e.target.value)}>
              <option>Registered</option>
              <option>In Progress</option>
              <option>Closed</option>
              <option>Transferred</option>
            </select>
            <button className="paytm-btn" title="Edit" style={{marginLeft:8,background:'#ffa500',color:'#222',padding:'6px 10px',display:'inline-flex',alignItems:'center'}} onClick={() => setEditingFIR(fir.id)}><FaEdit /></button>
            <button className="paytm-btn" title="Delete" style={{marginLeft:8,background:'#e74c3c',padding:'6px 10px',display:'inline-flex',alignItems:'center'}} onClick={() => handleDelete(fir.id)}><FaTrash /></button>
            <button className="paytm-btn" title="Transfer" style={{marginLeft:8,background:'#0f4c81',padding:'6px 10px',display:'inline-flex',alignItems:'center'}} onClick={() => handleTransfer(fir)}><FaExchangeAlt /></button>
            <button className="paytm-btn" title="Investigation" style={{marginLeft:8,background:'#1877f2',padding:'6px 10px',display:'inline-flex',alignItems:'center'}} onClick={() => handleInvestigation(fir)}>Investigation</button>
            {editingFIR === fir.id && (
              <div style={{marginTop:12,background:'#f8fafc',padding:12,borderRadius:8,border:'1px solid #e3e8ee'}}>
                <input className="paytm-input" value={editForm.name} onChange={e => setEditForm({...editForm,name:e.target.value})} placeholder="Name" />
                <input className="paytm-input" value={editForm.city} onChange={e => setEditForm({...editForm,city:e.target.value})} placeholder="City" />
                <input className="paytm-input" value={editForm.station} onChange={e => setEditForm({...editForm,station:e.target.value})} placeholder="Station" />
                <input className="paytm-input" value={editForm.location} onChange={e => setEditForm({...editForm,location:e.target.value})} placeholder="Location" />
                <textarea className="paytm-input" value={editForm.details} onChange={e => setEditForm({...editForm,details:e.target.value})} placeholder="Details" />
                <button className="paytm-btn" style={{marginTop:8}} onClick={() => handleEditSave(fir.id)}>Save</button>
                <button className="paytm-btn" style={{marginLeft:8,background:'#aaa'}} onClick={() => setEditingFIR(null)}>Cancel</button>
              </div>
            )}
            {transferFIR === fir.id && (
              <div style={{marginTop:12,background:'#f8fafc',padding:12,borderRadius:8,border:'1px solid #e3e8ee'}}>
                <select className="paytm-input" value={transferForm.city} onChange={e => setTransferForm({...transferForm,city:e.target.value,station:''})} required>
                  <option value="">Select City</option>
                  {Array.from(new Set(stationsList.map(s => s.city))).map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                <select className="paytm-input" value={transferForm.station} onChange={e => setTransferForm({...transferForm,station:e.target.value})} required disabled={!transferForm.city}>
                  <option value="">Select Station</option>
                  {stationsList.filter(s => s.city === transferForm.city).map(s => <option key={s.station} value={s.station}>{s.station}</option>)}
                </select>
                <label style={{marginTop:8,display:'block'}}>
                  <input type="checkbox" checked={transferForm.approved} onChange={e => setTransferForm({...transferForm,approved:e.target.checked})} />
                  <span style={{marginLeft:8}}>Approved by SP</span>
                </label>
                <button className="paytm-btn" style={{marginTop:8}} onClick={() => handleTransferSave(fir.id)}>Transfer</button>
                <button className="paytm-btn" style={{marginLeft:8,background:'#aaa'}} onClick={() => setTransferFIR(null)}>Cancel</button>
              </div>
            )}
            {investigationFIR === fir.id && (
              <div style={{marginTop:12,background:'#f8fafc',padding:12,borderRadius:8,border:'1px solid #e3e8ee'}}>
                <input className="paytm-input" value={investigationForm.assignedTo} onChange={e => setInvestigationForm({...investigationForm,assignedTo:e.target.value})} placeholder="Assigned To (Officer Name)" />
                <label style={{marginTop:8,display:'block'}}>
                  <input type="checkbox" checked={investigationForm.started} onChange={e => setInvestigationForm({...investigationForm,started:e.target.checked})} />
                  <span style={{marginLeft:8}}>Investigation Started</span>
                </label>
                <textarea className="paytm-input" value={investigationForm.notes} onChange={e => setInvestigationForm({...investigationForm,notes:e.target.value})} placeholder="Investigation Notes" />
                <button className="paytm-btn" style={{marginTop:8}} onClick={() => handleInvestigationSave(fir.id)}>Save</button>
                <button className="paytm-btn" style={{marginLeft:8,background:'#aaa'}} onClick={() => setInvestigationFIR(null)}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <CaseAssignmentPanel firs={firs} setFirs={setFirs} />
    </PaytmCard>
  );
};

export default Admin;
