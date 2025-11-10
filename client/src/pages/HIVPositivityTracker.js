import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HIVPositivityTracker = () => {
  const navigate = useNavigate();
  const [positiveClients, setPositiveClients] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    linkedToART: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPositiveClients();
  }, [filter]);

  const fetchPositiveClients = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/clients?hivStatus=Positive');
      const clients = res.data.data || [];

      setPositiveClients(clients);

      // Calculate stats
      const total = clients.length;
      const linkedToART = clients.filter(c => c.prepStatus === 'Referred').length;
      const pending = total - linkedToART;

      setStats({ total, linkedToART, pending });
    } catch (err) {
      console.error('Error fetching positive clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = positiveClients.filter(client => {
    if (filter === 'linked') return client.prepStatus === 'Referred';
    if (filter === 'pending') return client.prepStatus !== 'Referred';
    return true;
  });

  const exportToCSV = () => {
    const headers = ['Client ID', 'Name', 'Age', 'Gender', 'Typology', 'District', 'Contact Number', 'Test Date', 'ART Status', 'Registration Date'];
    const csvData = filteredClients.map(client => [
      client.clientID,
      client.name,
      client.age,
      client.gender,
      client.typology,
      client.district,
      client.contactNumber,
      new Date(client.updatedAt).toLocaleDateString(),
      client.prepStatus === 'Referred' ? 'Linked to ART' : 'Pending',
      new Date(client.registrationDate).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hiv-positive-clients-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>HIV Positivity Tracker</h2>
        <button className="btn btn-primary" onClick={exportToCSV}>
          Export to CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center', background: '#fff5f5', borderLeft: '4px solid #e53e3e' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e53e3e' }}>{stats.total}</div>
          <div style={{ color: '#718096', marginTop: '4px' }}>Total HIV Positive</div>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center', background: '#f0fff4', borderLeft: '4px solid #38a169' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#38a169' }}>{stats.linkedToART}</div>
          <div style={{ color: '#718096', marginTop: '4px' }}>Linked to ART</div>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center', background: '#fffaf0', borderLeft: '4px solid #dd6b20' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dd6b20' }}>{stats.pending}</div>
          <div style={{ color: '#718096', marginTop: '4px' }}>Pending Linkage</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className={filter === 'all' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </button>
          <button
            className={filter === 'linked' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setFilter('linked')}
          >
            Linked to ART ({stats.linkedToART})
          </button>
          <button
            className={filter === 'pending' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setFilter('pending')}
          >
            Pending Linkage ({stats.pending})
          </button>
        </div>
      </div>

      {/* Client List */}
      <div className="card">
        <div className="card-title">HIV Positive Clients</div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            Loading...
          </div>
        ) : filteredClients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            No HIV positive clients found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f7fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Client ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Age/Gender</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Typology</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>District</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Contact</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ART Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <tr key={client._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px' }}>
                      <strong>{client.clientID || 'N/A'}</strong>
                    </td>
                    <td style={{ padding: '12px' }}>{client.name}</td>
                    <td style={{ padding: '12px' }}>{client.age} / {client.gender}</td>
                    <td style={{ padding: '12px', fontSize: '12px' }}>{client.typology}</td>
                    <td style={{ padding: '12px' }}>{client.district}</td>
                    <td style={{ padding: '12px' }}>{client.contactNumber || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      {client.prepStatus === 'Referred' ? (
                        <span style={{
                          background: '#c6f6d5',
                          color: '#22543d',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          Linked to ART
                        </span>
                      ) : (
                        <span style={{
                          background: '#fed7d7',
                          color: '#742a2a',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          Pending
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                        onClick={() => navigate('/art-referrals', { state: { clientId: client._id } })}
                      >
                        {client.prepStatus === 'Referred' ? 'View Details' : 'Create Referral'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="nav-buttons" style={{ marginTop: '24px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default HIVPositivityTracker;
