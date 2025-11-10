import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasAccess } from '../utils/roleAccess';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const allNavItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/outreach', label: 'Client Outreach (Reach)' },
    { path: '/hiv-testing', label: 'Engagement & Testing' },
    { path: '/prep', label: 'PrEP Initiation' },
    { path: '/hiv-positivity-tracker', label: 'HIV Positivity Tracker' },
    { path: '/art-referrals', label: 'ART Referrals' },
    { path: '/documents', label: 'Documents' },
    { path: '/inventory', label: 'Inventory' },
    { path: '/asset-management', label: 'Asset Management' },
    { path: '/followups', label: 'Follow-ups' },
    { path: '/hr-attendance', label: 'HR & Attendance' },
    { path: '/prep-consent', label: 'PrEP Consent' },
    { path: '/clients', label: 'Client Database' },
    { path: '/reports', label: 'Reports' },
    { path: '/user-management', label: 'User Management' },
    { path: '/settings', label: 'Settings' }
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => 
    hasAccess(user?.role, item.path)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <img 
              src="/varhad-logo.svg" 
              alt="VARHAD Logo" 
              style={{ 
                maxWidth: '180px', 
                height: 'auto'
              }} 
            />
          </div>
          <h2>VARHAD PrEPARED</h2>
          <div className="user-badge">
            {user?.role === 'counsellor' && 'Counsellor Portal'}
            {user?.role === 'doctor' && 'Doctor Portal'}
            {user?.role === 'admin' && 'Admin Portal'}
            {user?.role === 'fieldstaff' && 'Field Staff Portal'}
          </div>
        </div>
        <div className="nav-menu">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </div>
          ))}
          <div className="nav-item" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="topbar">
          <div className="user-info">
            <span className="badge">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </span>
            <span className="name">{user?.name}</span>
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
