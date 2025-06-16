import React, { useEffect, useState } from 'react';

const NotificationContext = React.createContext();

export const useNotifications = () => React.useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('fir-notifications') || '[]');
    setNotifications(stored);
  }, []);

  const addNotification = (msg) => {
    const updated = [...notifications, { msg, id: Date.now() }];
    setNotifications(updated);
    sessionStorage.setItem('fir-notifications', JSON.stringify(updated));
    setTimeout(() => {
      setNotifications(n => n.filter(notif => notif.id !== updated[updated.length-1].id));
    }, 3500);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
      <div style={{position:'fixed',top:20,right:20,zIndex:9999}}>
        {notifications.map(n => (
          <div key={n.id} style={{background:'#1877f2',color:'#fff',padding:'12px 20px',borderRadius:8,marginBottom:8,boxShadow:'0 2px 8px #0002',fontWeight:500}}>
            {n.msg}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
