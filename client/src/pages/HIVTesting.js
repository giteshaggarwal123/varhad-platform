import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HIVTesting = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [formData, setFormData] = useState({
    engagementDate: new Date().toISOString().split('T')[0],
    purposeOfEngagement: 'HIV Testing',
    testDate: new Date().toISOString().split('T')[0],
    testResult: '',
    testType: 'Rapid Test',
    testingLocation: '',
    unprotectedSexualActivity: false,
    numberOfPartners: 0,
    condomUsageFrequency: 'Sometimes'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get('/api/clients');
      setClients(res.data.data);
    } catch (err) {
      // Error fetching clients - handle silently
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      setError('Please select a client');
      return;
    }

    // Validate dates - test date must be on or after engagement date
    const engagementDate = new Date(formData.engagementDate);
    const testDate = new Date(formData.testDate);
    
    if (testDate < engagementDate) {
      setError('Test date cannot be before engagement date. Please check dates.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('/api/hiv-tests', {
        ...formData,
        client: selectedClient
      });

      // Auto-navigate based on result
      if (formData.testResult === 'Negative') {
        alert('Client tested HIV Negative. Redirecting to PrEP Initiation module.');
        navigate('/prep');
      } else if (formData.testResult === 'Positive') {
        alert('Client tested HIV Positive. Please provide ART linkage and referral.');
      } else {
        alert('HIV test record saved successfully');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating HIV test record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="alert alert-warning">
        <strong>Important:</strong> All dates must be chronological (each date must be equal to or after previous dates)
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-title">Engagement Details</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Client <span className="required">*</span></label>
              <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} required>
                <option value="">-- Select Client --</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.clientID} - {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Engagement Date <span className="required">*</span></label>
              <input
                type="date"
                name="engagementDate"
                value={formData.engagementDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Purpose of Engagement <span className="required">*</span></label>
              <select name="purposeOfEngagement" value={formData.purposeOfEngagement} onChange={handleChange}>
                <option>HIV Testing</option>
                <option>STI Services</option>
                <option>Counselling</option>
                <option>PrEP Consultation</option>
                <option>Doctor Consultation</option>
                <option>Crisis Support</option>
                <option>Others</option>
              </select>
            </div>
          </div>

          <div className="card-title" style={{ marginTop: '24px' }}>HIV Testing</div>
          <div className="alert alert-info">
            Based on test result, system will automatically navigate to appropriate module
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Test Date <span className="required">*</span></label>
              <input
                type="date"
                name="testDate"
                value={formData.testDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Test Result <span className="required">*</span></label>
              <select name="testResult" value={formData.testResult} onChange={handleChange} required>
                <option value="">-- Select Result --</option>
                <option value="Negative">Negative (Proceed to PrEP)</option>
                <option value="Positive">Positive (Proceed to ART Linkage)</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="form-group">
              <label>Type of Test</label>
              <select name="testType" value={formData.testType} onChange={handleChange}>
                <option>Rapid Test</option>
                <option>ELISA</option>
                <option>NAT</option>
                <option>Western Blot</option>
              </select>
            </div>
            <div className="form-group">
              <label>Testing Location</label>
              <input
                type="text"
                name="testingLocation"
                value={formData.testingLocation}
                onChange={handleChange}
                placeholder="e.g., VARHAD Clinic"
              />
            </div>
          </div>

          <div className="card-title" style={{ marginTop: '24px' }}>Risk Assessment</div>
          <div className="form-grid">
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="unprotectedSexualActivity"
                  checked={formData.unprotectedSexualActivity}
                  onChange={handleChange}
                />
                <span>Unprotected Sexual Activity</span>
              </label>
            </div>
            <div className="form-group">
              <label>Number of Sexual Partners (Last 6 Months)</label>
              <input
                type="number"
                name="numberOfPartners"
                value={formData.numberOfPartners}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Condom Usage Frequency</label>
              <select name="condomUsageFrequency" value={formData.condomUsageFrequency} onChange={handleChange}>
                <option>Always</option>
                <option>Sometimes</option>
                <option>Never</option>
              </select>
            </div>
          </div>

          <div className="nav-buttons">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/outreach')}>
              Previous
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Saving...' : 'Save & Continue (Auto-Navigate Based on Result)'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HIVTesting;
