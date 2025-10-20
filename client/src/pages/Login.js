import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const userCredentials = {
  counsellor: { username: 'aparna.b', password: 'demo123', name: 'Aparna Banerjee' },
  doctor: { username: 'dr.sharma', password: 'demo123', name: 'Dr. Rajesh Sharma' },
  admin: { username: 'admin', password: 'demo123', name: 'System Admin' },
  fieldstaff: { username: 'field.001', password: 'demo123', name: 'Rahul Verma' }
};

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [selectedUserType, setSelectedUserType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleUserTypeSelect = (type) => {
    setSelectedUserType(type);
    const creds = userCredentials[type];
    setUsername(creds.username);
    setPassword(creds.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid credentials. Try selecting a user type or check your credentials.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-left">
          <div className="login-branding">
            <img 
              src="/varhad-logo.svg" 
              alt="VARHAD Logo" 
              style={{ 
                maxWidth: '320px', 
                height: 'auto',
                marginBottom: '24px'
              }} 
            />
            <h1 style={{ fontSize: '36px', color: 'white', marginBottom: '12px', fontWeight: '700' }}>
              VARHAD PrEPARED
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '32px' }}>
              Database Management System
            </p>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '24px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '16px' }}>
                🏥 Comprehensive HIV Prevention Platform
              </h3>
              <ul style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '2', listStyle: 'none', padding: 0 }}>
                <li>✓ Client Registration & Management</li>
                <li>✓ HIV Testing & PrEP Initiation</li>
                <li>✓ Inventory & Asset Tracking</li>
                <li>✓ WhatsApp Integration for Reminders</li>
                <li>✓ Comprehensive Reporting & Analytics</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right">
          <div className="login-box">
            <h2 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '8px', fontWeight: '600' }}>
              Welcome Back
            </h2>
            <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
              Sign in to access your dashboard
            </p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>
              Select User Type:
            </label>
            <div className="user-type-selector">
              <div
                className={`user-type-card ${selectedUserType === 'counsellor' ? 'selected' : ''}`}
                onClick={() => handleUserTypeSelect('counsellor')}
              >
                <h3>Counsellor</h3>
                <p>Field Worker</p>
              </div>
              <div
                className={`user-type-card ${selectedUserType === 'doctor' ? 'selected' : ''}`}
                onClick={() => handleUserTypeSelect('doctor')}
              >
                <h3>Doctor</h3>
                <p>Medical Officer</p>
              </div>
              <div
                className={`user-type-card ${selectedUserType === 'admin' ? 'selected' : ''}`}
                onClick={() => handleUserTypeSelect('admin')}
              >
                <h3>Admin</h3>
                <p>System Manager</p>
              </div>
              <div
                className={`user-type-card ${selectedUserType === 'fieldstaff' ? 'selected' : ''}`}
                onClick={() => handleUserTypeSelect('fieldstaff')}
              >
                <h3>Field Staff</h3>
                <p>Outreach Worker</p>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username or select user type above"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p style={{ marginTop: '16px', fontSize: '12px', color: '#a0aec0', textAlign: 'center' }}>
            💡 Quick Login: Click any user type above to auto-fill credentials, or enter manually
          </p>
          <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px', fontSize: '11px', color: '#0369a1' }}>
            <strong>All 4 user types ready:</strong> Counsellor, Doctor, Admin, Field Staff<br/>
            Password for all: <code style={{ backgroundColor: '#e0f2fe', padding: '2px 6px', borderRadius: '3px' }}>demo123</code>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
