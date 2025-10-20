import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';
import BulkUpload from '../components/BulkUpload';

const ClientDatabase = () => {
  const bulkUploadTemplate = [
    { clientID: 'VH00001', name: 'Sample Name', age: 25, gender: 'Male', typology: 'MSM', contactNumber: '+91-9876543210', district: 'Lucknow' }
  ];
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewingClient, setViewingClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    age: '',
    gender: '',
    contactNumber: '',
    district: '',
    typology: ''
  });

  useEffect(() => {
    fetchClients();
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get(`/api/clients?search=${search}`);
      setClients(res.data.data);
    } catch (err) {
      // Error fetching clients - handle silently
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/clients/stats');
      setStats(res.data.data);
    } catch (err) {
      // Error fetching stats - handle silently
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchClients();
  };

  const handleView = (client) => {
    setViewingClient(client);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setEditFormData({
      name: client.name,
      age: client.age,
      gender: client.gender,
      contactNumber: client.contactNumber,
      district: client.district,
      typology: client.typology
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.put(`/api/clients/${editingClient._id}`, editFormData);
      alert('Client updated successfully!');
      setEditingClient(null);
      fetchClients();
      fetchStats();
    } catch (err) {
      alert('Error updating client');
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
      <div className="alert alert-success">
        <strong>Database Access:</strong> Complete database of all registered clients with filtering and search capabilities
      </div>

      <BulkUpload
        moduleName="Client Database"
        templateData={bulkUploadTemplate}
        onUpload={(file) => {
          fetchClients();
          fetchStats();
        }}
      />

      <div className="card">
        <div className="card-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Search Clients</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-sm btn-secondary" onClick={() => exportToCSV(clients, 'clients_database')}>
                Export CSV
              </button>
              <button type="button" className="btn btn-sm btn-secondary" onClick={() => exportToExcel(clients, 'clients_database')}>
                Export Excel
              </button>
            </div>
          </div>
        </div>
        <form onSubmit={handleSearch}>
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Enter Client ID (VH00001) or Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </div>
        </form>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Clients</div>
            <div className="stat-value">{stats.totalClients}</div>
            <div className="stat-trend">Database capacity: 1,00,000</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active on PrEP</div>
            <div className="stat-value">{stats.activeOnPrep}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">New This Month</div>
            <div className="stat-value">{stats.newThisMonth}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">HIV Positive</div>
            <div className="stat-value">{stats.hivPositive}</div>
          </div>
        </div>
      )}

      <div className="table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 10px' }}>
          <h3 style={{ margin: 0 }}>All Client Records (Showing {clients.length} clients)</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>HIV Status</th>
              <th>PrEP Status</th>
              <th>District</th>
              <th>Counsellor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td><strong>{client.clientID}</strong></td>
                <td>{client.name}</td>
                <td>{client.age}</td>
                <td>{client.gender}</td>
                <td>
                  <span className={`status-badge ${
                    client.hivStatus === 'Negative' ? 'status-completed' :
                    client.hivStatus === 'Positive' ? 'status-overdue' :
                    'status-pending'
                  }`}>
                    {client.hivStatus}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${
                    client.prepStatus === 'Active' ? 'status-completed' : 'status-pending'
                  }`}>
                    {client.prepStatus}
                  </span>
                </td>
                <td>{client.district}</td>
                <td>{client.counsellor?.name}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary" 
                    onClick={() => handleView(client)}
                    style={{ marginRight: '4px' }}
                  >
                    View
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleEdit(client)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewingClient && (
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
            maxWidth: '700px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '24px', color: '#2d3748' }}>Client Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong>Client ID:</strong> {viewingClient.clientID}
              </div>
              <div>
                <strong>Name:</strong> {viewingClient.name}
              </div>
              <div>
                <strong>Age:</strong> {viewingClient.age}
              </div>
              <div>
                <strong>Gender:</strong> {viewingClient.gender}
              </div>
              <div>
                <strong>Typology:</strong> {viewingClient.typology}
              </div>
              <div>
                <strong>Contact:</strong> {viewingClient.contactNumber}
              </div>
              <div>
                <strong>District:</strong> {viewingClient.district}
              </div>
              <div>
                <strong>HIV Status:</strong>
                <span className={`status-badge ${
                  viewingClient.hivStatus === 'Negative' ? 'status-completed' :
                  viewingClient.hivStatus === 'Positive' ? 'status-overdue' :
                  'status-pending'
                }`}>
                  {viewingClient.hivStatus}
                </span>
              </div>
              <div>
                <strong>PrEP Status:</strong>
                <span className={`status-badge ${
                  viewingClient.prepStatus === 'Active' ? 'status-completed' : 'status-pending'
                }`}>
                  {viewingClient.prepStatus}
                </span>
              </div>
              <div>
                <strong>Counsellor:</strong> {viewingClient.counsellor?.name || 'Not Assigned'}
              </div>
              <div>
                <strong>Registration Date:</strong> {new Date(viewingClient.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={() => setViewingClient(null)}
              style={{ marginTop: '24px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingClient && (
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
            maxWidth: '700px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '24px', color: '#2d3748' }}>Edit Client - {editingClient.clientID}</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={editFormData.age}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    name="gender"
                    value={editFormData.gender}
                    onChange={handleEditInputChange}
                    required
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Transgender</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Typology</label>
                  <select
                    name="typology"
                    value={editFormData.typology}
                    onChange={handleEditInputChange}
                  >
                    <option>MSM (Men who have Sex with Men)</option>
                    <option>Transgender</option>
                    <option>FSW (Female Sex Workers)</option>
                    <option>PWID (People Who Inject Drugs)</option>
                    <option>Others</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={editFormData.contactNumber}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>District *</label>
                  <input
                    type="text"
                    name="district"
                    value={editFormData.district}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary">
                  Update Client
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setEditingClient(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDatabase;
