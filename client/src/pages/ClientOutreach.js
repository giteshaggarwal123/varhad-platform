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
    contactNumber: '',
    email: '',
    preferredContactMethod: 'WhatsApp',
    maritalStatus: 'Unmarried',
    district: '',
    specialNeeds: '',
    outreachDate: new Date().toISOString().split('T')[0],
    outreachType: 'Virtual Outreach',
    referralMethod: 'One to One'
  });
  const [clientID, setClientID] = useState('');
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
      // Check for duplicate client by phone number
      const checkRes = await axios.get(`/api/clients?contactNumber=${formData.contactNumber}`);
      if (checkRes.data.data && checkRes.data.data.length > 0) {
        setError(`Client with phone number ${formData.contactNumber} already exists! Client ID: ${checkRes.data.data[0].clientID}`);
        setLoading(false);
        return;
      }

      // Create client
      const clientRes = await axios.post('/api/clients', formData);
      const newClientID = clientRes.data.data.clientID;
      setClientID(newClientID);

      // Create outreach record
      await axios.post('/api/outreach', {
        client: clientRes.data.data._id,
        outreachDate: formData.outreachDate,
        district: formData.district,
        outreachType: formData.outreachType,
        referralMethod: formData.referralMethod
      });

      alert(`Client registered successfully with ID: ${newClientID}`);
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
              <label>Referral Method</label>
              <select name="referralMethod" value={formData.referralMethod} onChange={handleChange}>
                <option>One to One</option>
                <option>Instagram</option>
                <option>Grindr</option>
                <option>Blued</option>
                <option>Tinder</option>
                <option>Facebook</option>
                <option>WhatsApp</option>
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
            <div className="form-group">
              <label>Contact Number <span className="required">*</span></label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter phone (10 digits)"
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                required
              />
            </div>
            <div className="form-group">
              <label>Email ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>
            <div className="form-group">
              <label>Preferred Contact Method</label>
              <select name="preferredContactMethod" value={formData.preferredContactMethod} onChange={handleChange}>
                <option>WhatsApp</option>
                <option>Phone Call</option>
                <option>SMS</option>
                <option>Email</option>
              </select>
            </div>
            <div className="form-group">
              <label>Marital Status</label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                <option>Unmarried</option>
                <option>Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Special Needs/Notes</label>
              <textarea
                name="specialNeeds"
                value={formData.specialNeeds}
                onChange={handleChange}
                placeholder="Any special requirements, disabilities, or important notes"
                rows="2"
              />
            </div>
          </div>

          <div className="nav-buttons">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save & Continue to HIV Testing'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClientOutreach;
