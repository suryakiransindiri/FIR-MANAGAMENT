import React, { useEffect, useState } from 'react';
import PaytmCard from '../../components/PaytmCard';
import PaytmButton from '../../components/PaytmButton';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [firs, setFirs] = useState([]);
  const [user, setUser] = useState(null);
  const [userChecked, setUserChecked] = useState(false);
  const [userNotifs, setUserNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const logged = JSON.parse(sessionStorage.getItem('fir-loggedin'));
    if (!logged) {
      navigate('/');
      return;
    }
    setUser(logged);
    const allFIRs = JSON.parse(localStorage.getItem('firs') || '[]');
    setFirs(allFIRs.filter(f => f.name === logged.username));
    setUserChecked(true);
    setUserNotifs(JSON.parse(localStorage.getItem(`notifs-${logged.username}`) || '[]'));
  }, [navigate]);

  const clearNotifs = () => {
    if (user) {
      localStorage.setItem(`notifs-${user.username}`,'[]');
      setUserNotifs([]);
    }
  };

  const filteredFIRs = firs.filter(fir => {
    const matchesSearch =
      fir.id.toLowerCase().includes(search.toLowerCase()) ||
      (fir.city && fir.city.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter ? fir.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  if (!userChecked) return <div style={{textAlign:'center',marginTop:'3rem',fontSize:'1.2rem'}}>Loading...</div>;

  return (
    <PaytmCard>
      <h2>Welcome, {user?.username || 'User'}</h2>
      <PaytmButton onClick={() => navigate('/submit-fir')}>Submit New FIR</PaytmButton>
      <PaytmButton style={{marginLeft:12,background:'#1877f2'}} onClick={()=>setShowNotifs(s=>!s)}>
        {showNotifs ? 'Hide' : 'Show'} Notifications
      </PaytmButton>
      {showNotifs && (
        <div style={{margin:'18px 0',background:'#f8fafc',borderRadius:12,padding:16,boxShadow:'0 2px 8px #1877f211'}}>
          <b>Notifications</b>
          {userNotifs.length === 0 ? <div style={{marginTop:8}}>No notifications.</div> :
            <ul style={{textAlign:'left',marginTop:8}}>
              {userNotifs.map((n,i) => <li key={i}><span style={{color:'#1877f2',fontWeight:600}}>{n.msg}</span> <span style={{fontSize:12,color:'#888'}}>{n.time}</span></li>)}
            </ul>
          }
          <PaytmButton style={{marginTop:8,background:'#aaa'}} onClick={clearNotifs}>Clear</PaytmButton>
        </div>
      )}
      <div style={{marginBottom:16,display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
        <input className="paytm-input" style={{maxWidth:180}} placeholder="Search by ID, City" value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="paytm-input" style={{maxWidth:160}} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Registered">Registered</option>
          <option value="In Progress">In Progress</option>
          <option value="Investigation">Investigation</option>
          <option value="Transferred">Transferred</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <h3 style={{marginTop: 24}}>Your FIRs</h3>
      {filteredFIRs.length === 0 ? <p>No FIRs submitted yet.</p> : filteredFIRs.map(fir => (
        <div key={fir.id} style={{borderBottom: '1px solid #eee', marginBottom: 10, paddingBottom: 10}}>
          <b>ID:</b> {fir.id}<br/>
          <b>City:</b> {fir.city}<br/>
          <b>Station:</b> {fir.station}<br/>
          <b>Status:</b> {fir.status}<br/>
          <PaytmButton style={{marginTop: 6}} onClick={() => navigate(`/fir-details/${fir.id}`)}>View Details</PaytmButton>
        </div>
      ))}
    </PaytmCard>
  );
};

export default UserDashboard;
