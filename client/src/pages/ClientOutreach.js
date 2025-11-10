import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClientOutreach = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    age: '',
    typology: 'MSM (Men who have Sex with Men)',
    district: '',
    reachStageNotes: '',
    outreachDate: new Date().toISOString().split('T')[0],
    outreachType: 'Virtual Outreach',
    referralMethod: ''
  });
  const [clientID] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create client in reach stage (no contact number yet)
      const clientRes = await axios.post('/api/clients', formData);
      const newClient = clientRes.data.data;

      // Create outreach record
      await axios.post('/api/outreach', {
        client: newClient._id,
        outreachDate: formData.outreachDate,
        district: formData.district,
        outreachType: formData.outreachType,
        referralMethod: formData.referralMethod
      });

      alert(`Client registered successfully in Reach Stage! Proceed to Engagement Stage to add contact details and generate Client ID.`);
      navigate('/hiv-testing');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {clientID && (
        <div className="client-id-display">
          <label>Auto-Generated Client ID</label>
          <div className="id-value">{clientID}</div>
          <p style={{ fontSize: '11px', color: '#718096', marginTop: '4px' }}>
            This ID is unique and will be used throughout the system
          </p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-title">Outreach Information</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Date of Outreach <span className="required">*</span></label>
              <input
                type="date"
                name="outreachDate"
                value={formData.outreachDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>District/Location <span className="required">*</span></label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter district"
                required
              />
            </div>
            <div className="form-group">
              <label>Type of Outreach <span className="required">*</span></label>
              <select name="outreachType" value={formData.outreachType} onChange={handleChange}>
                <option>Virtual Outreach</option>
                <option>Physical Outreach</option>
              </select>
            </div>
            <div className="form-group">
              <label>Referral Method <span className="required">*</span></label>
              <select name="referralMethod" value={formData.referralMethod} onChange={handleChange} required>
                <option value="">-- Select Referral Method --</option>
                <option>One to One</option>
                <option>Instagram</option>
                <option>Grindr</option>
                <option>Blued</option>
                <option>Tinder</option>
                <option>Facebook</option>
                <option>WhatsApp</option>
                <option>Website</option>
                <option>Ad Leads</option>
                <option>Others</option>
              </select>
            </div>
          </div>

          <div className="card-title" style={{ marginTop: '24px' }}>Client Details</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Client Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name (can be anonymous)"
                required
              />
              <span className="helper-text">Privacy protected - can use initials or profile name</span>
            </div>
            <div className="form-group">
              <label>Gender <span className="required">*</span></label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option>Male</option>
                <option>Female</option>
                <option>Transgender</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Age (completed years) <span className="required">*</span></label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                min="18"
                required
              />
            </div>
            <div className="form-group">
              <label>Typology <span className="required">*</span></label>
              <select name="typology" value={formData.typology} onChange={handleChange} required>
                <option>MSM (Men who have Sex with Men)</option>
                <option>Transgender</option>
                <option>FSW (Female Sex Workers)</option>
                <option>PWID (People Who Inject Drugs)</option>
                <option>Others</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Special Notes/Instructions</label>
              <textarea
                name="reachStageNotes"
                value={formData.reachStageNotes}
                onChange={handleChange}
                placeholder="Any important notes about reach stage - communication preferences, specific needs, engagement context, etc."
                rows="3"
              />
              <span className="helper-text">
                Use this field to record details about initial contact, client's situation, or any special considerations for follow-up
              </span>
            </div>
          </div>

          <div className="nav-buttons">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save & Continue to Engagement Stage'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClientOutreach;
