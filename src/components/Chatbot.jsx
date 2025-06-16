import React, { useState } from 'react';
import PaytmCard from './PaytmCard';
import PaytmButton from './PaytmButton';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';

const FAQS = [
  { q: 'How do I submit a FIR?', a: 'Go to the Submit FIR page, fill in the required details, and click Submit.' },
  { q: 'How can I track my FIR status?', a: 'Use the FIR Status page or your dashboard to track the status using your FIR ID.' },
  { q: 'Who can access the admin panel?', a: 'Only users with the Admin/SP role can access the admin panel.' },
  { q: 'How do I upload evidence?', a: 'You can upload evidence while submitting a FIR or during investigation updates.' },
  { q: 'How do I reset my password?', a: 'Use the Forgot Password link on the login page (if enabled).' },
];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am your FIR Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    // Simple FAQ match
    const found = FAQS.find(faq => input.toLowerCase().includes(faq.q.toLowerCase().split(' ')[0]));
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'bot', text: found ? found.a : 'Sorry, I do not have an answer for that. Please contact support.' }]);
    }, 700);
    setInput('');
  };

  return (
    <div style={{position:'fixed',bottom:24,right:24,zIndex:9999}}>
      {!open && <button className="paytm-btn" style={{borderRadius:'50%',width:56,height:56,padding:0,background:'#1877f2',boxShadow:'0 2px 8px #1877f233'}} onClick={()=>setOpen(true)}><FaRobot size={28} /></button>}
      {open && (
        <PaytmCard style={{width:320,padding:'1.2rem 1rem',boxShadow:'0 8px 32px #1877f233'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <b style={{color:'#1877f2'}}>FIR Chatbot</b>
            <button className="paytm-btn" style={{background:'#aaa',padding:'2px 10px',borderRadius:8}} onClick={()=>setOpen(false)}>Close</button>
          </div>
          <div style={{height:180,overflowY:'auto',background:'#f8fafc',borderRadius:8,padding:8,marginBottom:8}}>
            {messages.map((msg,i) => (
              <div key={i} style={{textAlign:msg.from==='bot'?'left':'right',margin:'6px 0'}}>
                <span style={{background:msg.from==='bot'?'#e3f0ff':'#1877f2',color:msg.from==='bot'?'#222':'#fff',padding:'6px 12px',borderRadius:12,display:'inline-block',maxWidth:220}}>{msg.text}</span>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:6}}>
            <input className="paytm-input" style={{flex:1}} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSend()} placeholder="Type your question..." />
            <button className="paytm-btn" style={{padding:'0 12px'}} onClick={handleSend}><FaPaperPlane /></button>
          </div>
        </PaytmCard>
      )}
    </div>
  );
};

export default Chatbot;
