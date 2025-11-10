import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ARTReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewingReferral, setViewingReferral] = useState(null);
  const [formData, setFormData] = useState({
    client: '',
    hivTestDate: new Date().toISOString().split('T')[0],
    confirmatoryTestDone: false,
    clientInformed: true,
    referredToART: true,
    artCenterName: 'District Hospital ART Center',
    artRegistrationNumber: '',
    referralDate: new Date().toISOString().split('T')[0],
    artDoctor: '',
    followUpAppointmentDate: '',
    postTestCounsellingProvided: 'Yes - Comprehensive',
    psychosocialSupportNeeded: false,
    partnerNotification: 'Client will inform',
    tbScreeningDone: 'No',
    cd4Count: '',
    viralLoad: '',
    additionalNotes: ''
  });

  useEffect(() => {
    fetchReferrals();
    fetchStats();
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Get all clients for the dropdown
      const res = await axios.get('/api/clients');
      setClients(res.data.data);
    } catch (err) {
      // Error fetching clients - handle silently
    }
  };

  const fetchReferrals = async () => {
    try {
      const res = await axios.get('/api/art-referrals');
      setReferrals(res.data.data);
    } catch (err) {
      // Error fetching referrals - handle silently
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/art-referrals/stats');
      setStats(res.data.data);
    } catch (err) {
      // Error fetching stats - handle silently
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client) {
      alert('Please select a client');
      return;
    }

    try {
      await axios.post('/api/art-referrals', formData);
      alert('ART Referral created successfully! Client linked to ART services.');

      setShowForm(false);
      setFormData({
        client: '',
        hivTestDate: new Date().toISOString().split('T')[0],
        confirmatoryTestDone: false,
        clientInformed: true,
        referredToART: true,
        artCenterName: 'District Hospital ART Center',
        artRegistrationNumber: '',
        referralDate: new Date().toISOString().split('T')[0],
        artDoctor: '',
        followUpAppointmentDate: '',
        postTestCounsellingProvided: 'Yes - Comprehensive',
        psychosocialSupportNeeded: false,
        partnerNotification: 'Client will inform',
        tbScreeningDone: 'No',
        cd4Count: '',
        viralLoad: '',
        additionalNotes: ''
      });

      fetchReferrals();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating ART referral');
    }
  };

  const handleView = (referral) => {
    setViewingReferral(referral);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="alert alert-danger">
        <strong>🏥 ART Referrals:</strong> HIV Positive Case Management - Link clients to ART treatment centers
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total ART Referrals</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-trend">All time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">This Month</div>
            <div className="stat-value">{stats.thisMonth}</div>
            <div className="stat-trend">New referrals</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Linkage Completed</div>
            <div className="stat-value">{stats.linkageCompleted}</div>
            <div className="stat-trend">Successfully linked</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Linkage</div>
            <div className="stat-value">{stats.pendingLinkage}</div>
            <div className="stat-trend">Need follow-up</div>
          </div>
        </div>
      )}

      {/* Add Referral Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New ART Referral'}
        </button>
      </div>

      {/* Add Referral Form */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-title">Create ART Referral</div>

            {/* Client Selection */}
            <div className="form-grid">
              <div className="form-group">
                <label>Select Client *</label>
                <select
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select HIV Positive Client --</option>
                  {clients.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.clientID} - {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>HIV Test Date *</label>
                <input
                  type="date"
                  name="hivTestDate"
                  value={formData.hivTestDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="confirmatoryTestDone"
                    checked={formData.confirmatoryTestDone}
                    onChange={handleInputChange}
                  />
                  <span>Confirmatory Test Done</span>
                </label>
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="clientInformed"
                    checked={formData.clientInformed}
                    onChange={handleInputChange}
                  />
                  <span>Client Informed of Result *</span>
                </label>
              </div>
            </div>

            {/* ART Linkage Details */}
            <div className="card-title" style={{ marginTop: '24px' }}>ART Linkage Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>ART Center Name *</label>
                <select
                  name="artCenterName"
                  value={formData.artCenterName}
                  onChange={handleInputChange}
                  required
                >
                  <option>District Hospital ART Center</option>
                  <option>Medical College ART Center</option>
                  <option>Community Health Center</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>ART Registration Number</label>
                <input
                  type="text"
                  name="artRegistrationNumber"
                  value={formData.artRegistrationNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., ART-LKO-2025-1234"
                />
              </div>
              <div className="form-group">
                <label>Referral Date *</label>
                <input
                  type="date"
                  name="referralDate"
                  value={formData.referralDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>ART Doctor Name</label>
                <input
                  type="text"
                  name="artDoctor"
                  value={formData.artDoctor}
                  onChange={handleInputChange}
                  placeholder="Treating doctor's name"
                />
              </div>
              <div className="form-group">
                <label>Follow-up Appointment Date</label>
                <input
                  type="date"
                  name="followUpAppointmentDate"
                  value={formData.followUpAppointmentDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Support Services */}
            <div className="card-title" style={{ marginTop: '24px' }}>Support Services & Counselling</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Post-Test Counselling Provided</label>
                <select
                  name="postTestCounsellingProvided"
                  value={formData.postTestCounsellingProvided}
                  onChange={handleInputChange}
                >
                  <option>Yes - Comprehensive</option>
                  <option>Yes - Basic</option>
                  <option>No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Partner Notification</label>
                <select
                  name="partnerNotification"
                  value={formData.partnerNotification}
                  onChange={handleInputChange}
                >
                  <option>Client will inform</option>
                  <option>Assisted partner notification</option>
                  <option>Declined</option>
                </select>
              </div>
              <div className="form-group">
                <label>TB Screening</label>
                <select
                  name="tbScreeningDone"
                  value={formData.tbScreeningDone}
                  onChange={handleInputChange}
                >
                  <option>No</option>
                  <option>Yes - Negative</option>
                  <option>Yes - Positive (Refer)</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="psychosocialSupportNeeded"
                    checked={formData.psychosocialSupportNeeded}
                    onChange={handleInputChange}
                  />
                  <span>Psychosocial Support Needed</span>
                </label>
              </div>
            </div>

            {/* Clinical Data */}
            <div className="card-title" style={{ marginTop: '24px' }}>Clinical Data</div>
            <div className="form-grid">
              <div className="form-group">
                <label>CD4 Count</label>
                <input
                  type="text"
                  name="cd4Count"
                  value={formData.cd4Count}
                  onChange={handleInputChange}
                  placeholder="e.g., 245 cells/mm³"
                />
              </div>
              <div className="form-group">
                <label>Viral Load</label>
                <input
                  type="text"
                  name="viralLoad"
                  value={formData.viralLoad}
                  onChange={handleInputChange}
                  placeholder="e.g., Pending or 50,000 copies/mL"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Additional Notes</label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any additional information about the case..."
                rows="3"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary">
                Create ART Referral
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* View Modal */}
      {viewingReferral && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '12px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '24px', color: '#2d3748' }}>ART Referral Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong>Client ID:</strong> {viewingReferral.client?.clientID}
              </div>
              <div>
                <strong>Client Name:</strong> {viewingReferral.client?.name}
              </div>
              <div>
                <strong>HIV Test Date:</strong> {new Date(viewingReferral.hivTestDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Confirmatory Test:</strong> {viewingReferral.confirmatoryTestDone ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>ART Center:</strong> {viewingReferral.artCenterName}
              </div>
              <div>
                <strong>Registration Number:</strong> {viewingReferral.artRegistrationNumber || 'Pending'}
              </div>
              <div>
                <strong>Referral Date:</strong> {new Date(viewingReferral.referralDate).toLocaleDateString()}
              </div>
              <div>
                <strong>ART Doctor:</strong> {viewingReferral.artDoctor || 'Not assigned'}
              </div>
              <div>
                <strong>Counselling:</strong> {viewingReferral.postTestCounsellingProvided}
              </div>
              <div>
                <strong>Partner Notification:</strong> {viewingReferral.partnerNotification}
              </div>
              <div>
                <strong>TB Screening:</strong> {viewingReferral.tbScreeningDone}
              </div>
              <div>
                <strong>CD4 Count:</strong> {viewingReferral.cd4Count || 'Pending'}
              </div>
              <div>
                <strong>Viral Load:</strong> {viewingReferral.viralLoad || 'Pending'}
              </div>
              <div>
                <strong>Counsellor:</strong> {viewingReferral.counsellor?.name}
              </div>
            </div>
            {viewingReferral.additionalNotes && (
              <div style={{ marginTop: '16px' }}>
                <strong>Additional Notes:</strong>
                <p style={{ marginTop: '8px', color: '#4a5568' }}>{viewingReferral.additionalNotes}</p>
              </div>
            )}
            <button
              className="btn btn-primary"
              onClick={() => setViewingReferral(null)}
              style={{ marginTop: '24px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Referrals Table */}
      <div className="table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 10px' }}>
          <h3 style={{ margin: 0 }}>ART Referral Records ({referrals.length})</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Client Name</th>
              <th>Test Date</th>
              <th>Referral Date</th>
              <th>ART Center</th>
              <th>Registration No.</th>
              <th>Counsellor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral) => (
              <tr key={referral._id}>
                <td><strong>{referral.client?.clientID}</strong></td>
                <td>{referral.client?.name}</td>
                <td>{new Date(referral.hivTestDate).toLocaleDateString()}</td>
                <td>{new Date(referral.referralDate).toLocaleDateString()}</td>
                <td>{referral.artCenterName}</td>
                <td>
                  {referral.artRegistrationNumber ? (
                    <span className="status-badge status-completed">{referral.artRegistrationNumber}</span>
                  ) : (
                    <span className="status-badge status-pending">Pending</span>
                  )}
                </td>
                <td>{referral.counsellor?.name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleView(referral)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ARTReferrals;
