import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SubmitFIR from './pages/SubmitFIR';
import FIRStatus from './pages/FIRStatus';
import Admin from './pages/Admin';
import UserDashboard from './pages/User/UserDashboard';
import FIRDetails from './pages/User/FIRDetails';
import StationManagement from './pages/Admin/StationManagement';
import FIRAnalytics from './pages/Admin/FIRAnalytics';
import Help from './pages/Help';
import ForgotPassword from './pages/ForgotPassword';
import { NotificationProvider } from './components/NotificationProvider';
import withRole from './components/withRole';
import Chatbot from './components/Chatbot';
import { LangProvider, useLang } from './components/LangProvider';
import PublicFIRStatus from './pages/PublicFIRStatus';
import './App.css';

function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <select value={lang} onChange={e=>setLang(e.target.value)} style={{marginLeft:12,padding:'4px 10px',borderRadius:8}} aria-label="Switch Language">
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
    </select>
  );
}

function AppRoutes() {
  const { t } = useLang();
  const user = JSON.parse(sessionStorage.getItem('fir-loggedin'));
  const isLoggedIn = !!user;
  return (
    <NotificationProvider>
      <nav className="paytm-navbar">
        <img src="/logo.svg" alt="FIR Logo" style={{height:36,marginRight:16,borderRadius:8,background:'#fff',padding:2}} />
        <Link to="/" className="paytm-nav-link">{t('login')}</Link>
        <Link to="/signup" className="paytm-nav-link">{t('signup')}</Link>
        <Link to="/forgot-password" className="paytm-nav-link">{t('forgotPassword')}</Link>
        <Link to="/public-fir-status" className="paytm-nav-link">Public FIR Status</Link>
        {isLoggedIn && <>
          <Link to="/dashboard" className="paytm-nav-link">{t('dashboard')}</Link>
          <Link to="/submit-fir" className="paytm-nav-link">{t('submitFIR')}</Link>
          <Link to="/fir-status" className="paytm-nav-link">{t('firStatus')}</Link>
          {user.role === 'admin' && <>
            <Link to="/admin" className="paytm-nav-link">{t('admin')}</Link>
            <Link to="/admin/stations" className="paytm-nav-link">{t('stations')}</Link>
            <Link to="/admin/analytics" className="paytm-nav-link">{t('analytics')}</Link>
          </>}
          <button className="paytm-btn" style={{marginLeft:16}} onClick={() => {
            sessionStorage.removeItem('fir-loggedin');
            window.location.href = '/';
          }}>{t('logout')}</button>
        </>}
        <Link to="/help" className="paytm-nav-link">{t('help')}</Link>
        <LangSwitcher />
      </nav>
      <div className="paytm-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/public-fir-status" element={<PublicFIRStatus />} />
          {isLoggedIn && <>
            <Route path="/dashboard" element={withRole(UserDashboard, ['user', 'officer', 'admin'])()} />
            <Route path="/fir-details/:id" element={withRole(FIRDetails, ['user', 'officer', 'admin'])()} />
            <Route path="/submit-fir" element={withRole(SubmitFIR, ['user', 'officer'])()} />
            <Route path="/fir-status" element={withRole(FIRStatus, ['user', 'officer', 'admin'])()} />
            <Route path="/admin" element={withRole(Admin, ['admin'])()} />
            <Route path="/admin/stations" element={withRole(StationManagement, ['admin'])()} />
            <Route path="/admin/analytics" element={withRole(FIRAnalytics, ['admin'])()} />
          </>}
          <Route path="/help" element={<Help />} />
        </Routes>
      </div>
      <Chatbot />
    </NotificationProvider>
  );
}

function App() {
  return (
    <LangProvider>
      <AppRoutes />
    </LangProvider>
  );
}

export default App;
