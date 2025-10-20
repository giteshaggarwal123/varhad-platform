import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    organizationName: 'VARHAD',
    email: user?.email || '',
    phone: '',
    district: 'Lucknow',
    enableWhatsApp: true,
    enableEmailNotifications: true,
    autoBackup: true,
    clientIdPrefix: 'VH',
    clientIdStart: 1,
    theme: 'light',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12 Hour (AM/PM)'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('varhadSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applyTheme(parsed.theme);
    }
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else if (theme === 'light') {
      document.body.classList.remove('dark-theme');
    } else if (theme === 'auto') {
      // Auto mode - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Save to localStorage
    localStorage.setItem('varhadSettings', JSON.stringify(settings));
    applyTheme(settings.theme);

    alert('Settings saved successfully! Theme applied.');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirmation do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }

    alert('Password change functionality requires backend API implementation.\nThis feature will be available in the next update.');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      const defaultSettings = {
        organizationName: 'VARHAD',
        email: user?.email || '',
        phone: '',
        district: 'Lucknow',
        enableWhatsApp: true,
        enableEmailNotifications: true,
        autoBackup: true,
        clientIdPrefix: 'VH',
        clientIdStart: 1,
        theme: 'light',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12 Hour (AM/PM)'
      };

      setSettings(defaultSettings);
      localStorage.setItem('varhadSettings', JSON.stringify(defaultSettings));
      applyTheme('light');
      alert('Settings reset to defaults!');
    }
  };

  return (
    <div>
      <div className="alert alert-info">
        <strong>⚙️ System Settings:</strong> Configure system preferences, user profile, and application settings
      </div>

      <form onSubmit={handleSave}>
        {/* User Profile */}
        <div className="card">
          <div className="card-title">User Profile</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={user?.name || ''} readOnly style={{ background: '#f7fafc' }} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" value={user?.role || ''} readOnly style={{ background: '#f7fafc', textTransform: 'capitalize' }} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={settings.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={settings.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>District</label>
              <select name="district" value={settings.district} onChange={handleChange}>
                <option>Lucknow</option>
                <option>Varanasi</option>
                <option>Kanpur</option>
                <option>Allahabad</option>
                <option>Agra</option>
              </select>
            </div>
          </div>
        </div>

        {/* Organization Settings */}
        <div className="card">
          <div className="card-title">Organization Settings</div>
          <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
            <strong>Note:</strong> Client ID Prefix and Starting Number are currently display-only settings.
            The system uses a fixed "VH" prefix and auto-increments from the last registered client.
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Organization Name</label>
              <input
                type="text"
                name="organizationName"
                value={settings.organizationName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Client ID Prefix (Display Only)</label>
              <input
                type="text"
                name="clientIdPrefix"
                value={settings.clientIdPrefix}
                onChange={handleChange}
                maxLength="3"
              />
              <small style={{ color: '#718096', fontSize: '11px' }}>
                Example: VH00001, VH00002, etc.
              </small>
            </div>
            <div className="form-group">
              <label>Starting Client ID Number (Display Only)</label>
              <input
                type="number"
                name="clientIdStart"
                value={settings.clientIdStart}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div className="card-title">Notification Settings</div>
          <div style={{ padding: '8px 0' }}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="enableWhatsApp"
                  checked={settings.enableWhatsApp}
                  onChange={handleChange}
                />
                <span>Enable WhatsApp Notifications</span>
              </label>
              <small style={{ color: '#718096', fontSize: '11px', marginLeft: '28px' }}>
                Send automated reminders via WhatsApp Business API
              </small>
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="enableEmailNotifications"
                  checked={settings.enableEmailNotifications}
                  onChange={handleChange}
                />
                <span>Enable Email Notifications</span>
              </label>
              <small style={{ color: '#718096', fontSize: '11px', marginLeft: '28px' }}>
                Receive email alerts for important events
              </small>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="autoBackup"
                  checked={settings.autoBackup}
                  onChange={handleChange}
                />
                <span>Enable Automatic Backups</span>
              </label>
              <small style={{ color: '#718096', fontSize: '11px', marginLeft: '28px' }}>
                Daily automatic database backups at 2:00 AM
              </small>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="card">
          <div className="card-title">Display Settings</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Theme</label>
              <select name="theme" value={settings.theme} onChange={handleChange}>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Format</label>
              <select name="dateFormat" value={settings.dateFormat} onChange={handleChange}>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Format</label>
              <select name="timeFormat" value={settings.timeFormat} onChange={handleChange}>
                <option value="12 Hour (AM/PM)">12 Hour (AM/PM)</option>
                <option value="24 Hour">24 Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <div className="card-title">Security Settings</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password (min 8 characters)"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn btn-primary">Save Settings</button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset to Defaults</button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
