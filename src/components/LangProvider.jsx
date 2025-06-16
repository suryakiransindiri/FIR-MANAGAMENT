import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    login: 'Login',
    signup: 'Sign Up',
    forgotPassword: 'Forgot Password',
    dashboard: 'Dashboard',
    submitFIR: 'Submit FIR',
    firStatus: 'FIR Status',
    admin: 'Admin',
    stations: 'Station Management',
    analytics: 'Analytics',
    help: 'Help',
    logout: 'Logout',
    welcome: 'Welcome',
    notifications: 'Notifications',
    yourFIRs: 'Your FIRs',
    viewDetails: 'View Details',
    search: 'Search',
    status: 'Status',
    allStatuses: 'All Statuses',
    registered: 'Registered',
    inProgress: 'In Progress',
    investigation: 'Investigation',
    transferred: 'Transferred',
    closed: 'Closed',
    // ...add more as needed
  },
  hi: {
    login: 'लॉगिन',
    signup: 'रजिस्टर करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    dashboard: 'डैशबोर्ड',
    submitFIR: 'एफआईआर दर्ज करें',
    firStatus: 'एफआईआर स्थिति',
    admin: 'प्रशासन',
    stations: 'स्टेशन प्रबंधन',
    analytics: 'विश्लेषण',
    help: 'सहायता',
    logout: 'लॉगआउट',
    welcome: 'स्वागत है',
    notifications: 'सूचनाएं',
    yourFIRs: 'आपकी एफआईआर',
    viewDetails: 'विवरण देखें',
    search: 'खोजें',
    status: 'स्थिति',
    allStatuses: 'सभी स्थितियां',
    registered: 'पंजीकृत',
    inProgress: 'प्रगति में',
    investigation: 'जांच',
    transferred: 'स्थानांतरित',
    closed: 'बंद',
    // ...add more as needed
  }
};

const LangContext = createContext();
export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const t = key => translations[lang][key] || key;
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};
