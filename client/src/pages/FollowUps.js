import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowUps = () => {
  const [followUps, setFollowUps] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    client: '',
    dueDate: '',
    type: 'PrEP Refill',
    notes: ''
  });

  useEffect(() => {
    fetchFollowUps();
    fetchStats();
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get('/api/clients?prepStatus=Active');
      setClients(res.data.data);
    } catch (err) {
      // Error fetching clients - handle silently
    }
  };

  const fetchFollowUps = async () => {
    try {
      const res = await axios.get('/api/followups');
      setFollowUps(res.data.data);
    } catch (err) {
      // Error fetching follow-ups - handle silently
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/followups/stats');
      setStats(res.data.data);
    } catch (err) {
      // Error fetching stats - handle silently
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`/api/followups/${id}`, {
        status: 'Completed',
        completionDate: new Date()
      });
      fetchFollowUps();
      fetchStats();
      alert('Follow-up marked as completed');
    } catch (err) {
      alert('Error updating follow-up');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('/api/followups', formData);
      alert('Follow-up scheduled successfully!');
      setShowForm(false);
      setFormData({
        client: '',
        dueDate: '',
        type: 'PrEP Refill',
        notes: ''
      });
      fetchFollowUps();
      fetchStats();
    } catch (err) {
      alert('Error scheduling follow-up');
    }
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
      <div className="whatsapp-box">
        <h4>📱 WhatsApp Business API - Active</h4>
        <p>✓ Auto-reminders sent to clients 3 days before follow-up<br />
        ✓ Refill reminders sent 7 days before due date<br />
        ✓ Staff notifications for overdue follow-ups<br />
        ✓ Daily adherence messages (if opted-in)</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Pending Today</div>
            <div className="stat-value">{stats.pendingToday}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">This Week</div>
            <div className="stat-value">{stats.thisWeek}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Overdue</div>
            <div className="stat-value">{stats.overdue}</div>
          </div>
        </div>
      )}

      {/* Add Follow-up Button */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Schedule New Follow-up'}
        </button>
      </div>

      {/* Add Follow-up Form */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-title">Schedule Follow-up</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Client *</label>
                <select
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select client</option>
                  {clients.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.clientID} - {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Follow-up Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Follow-up Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option>PrEP Refill</option>
                  <option>Adherence Check</option>
                  <option>HIV Re-test</option>
                  <option>Side Effect Review</option>
                  <option>Doctor Consultation</option>
                  <option>General Follow-up</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes..."
                  rows="3"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary">
                Schedule Follow-up
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Client Name</th>
              <th>Due Date</th>
              <th>Type</th>
              <th>Counsellor</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {followUps.map((followUp) => (
              <tr key={followUp._id}>
                <td><strong>{followUp.client?.clientID}</strong></td>
                <td>{followUp.client?.name}</td>
                <td>{new Date(followUp.dueDate).toLocaleDateString()}</td>
                <td>{followUp.type}</td>
                <td>{followUp.counsellor?.name}</td>
                <td>
                  <span className={`status-badge status-${followUp.status.toLowerCase()}`}>
                    {followUp.status}
                  </span>
                </td>
                <td>
                  {followUp.status !== 'Completed' && (
                    <button
                      className="btn btn-success"
                      style={{ padding: '6px 12px', fontSize: '13px' }}
                      onClick={() => handleComplete(followUp._id)}
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FollowUps;
