import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SimpleChart from '../components/SimpleChart';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    monthly: [],
    prepStatus: [],
    district: []
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/clients/stats');
      setStats(res.data.data);

      // Fetch real chart data from API
      const [monthlyRes, prepStatusRes, districtRes] = await Promise.all([
        axios.get('/api/clients/chart/monthly'),
        axios.get('/api/clients/chart/prep-status'),
        axios.get('/api/clients/chart/districts')
      ]);

      setChartData({
        monthly: monthlyRes.data.data,
        prepStatus: prepStatusRes.data.data,
        district: districtRes.data.data
      });

      // Fetch recent activities
      try {
        const activitiesRes = await axios.get('/api/clients?limit=5');
        const activities = activitiesRes.data.data.map(client => ({
          date: new Date(client.createdAt).toLocaleDateString(),
          clientId: client.clientID,
          clientName: client.name,
          activity: 'Client Registration',
          counsellor: client.counsellor?.name || 'N/A',
          status: 'Completed'
        }));
        setRecentActivities(activities);
      } catch (err) {
        // Activities not critical, continue loading
      }
    } catch (error) {
      // Stats and charts loading failed
    } finally {
      setLoading(false);
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
      <div className="alert alert-info">
        <strong>📋 Unique Client ID System:</strong> Auto-generated IDs (VH00001 - VH99999). Each new client gets a unique sequential ID. 
        {stats && stats.totalClients !== undefined && (
          <span> Next ID: <strong>VH{String(stats.totalClients + 1).padStart(5, '0')}</strong></span>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Clients Registered</div>
          <div className="stat-value">{stats?.totalClients || 0}</div>
          <div className="stat-trend">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active on PrEP</div>
          <div className="stat-value">{stats?.activeOnPrep || 0}</div>
          <div className="stat-trend">Current medication</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">HIV Positive Referrals</div>
          <div className="stat-value">{stats?.hivPositive || 0}</div>
          <div className="stat-trend">Linked to ART</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">New This Month</div>
          <div className="stat-value">{stats?.newThisMonth || 0}</div>
          <div className="stat-trend">Monthly growth</div>
        </div>
      </div>

      <div className="whatsapp-box">
        <h4>📱 WhatsApp Integration Active</h4>
        <p>Auto-reminders enabled: Follow-ups, Refills, Appointments sent automatically to clients and staff via WhatsApp Business API</p>
      </div>

      {/* Charts Section */}
      {chartData.monthly.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <SimpleChart 
              data={chartData.monthly}
              title="📈 Monthly Client Registration Trend"
              type="line"
            />
            <SimpleChart 
              data={chartData.prepStatus}
              title="💊 PrEP Status Distribution"
              type="bar"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <SimpleChart 
              data={chartData.district}
              title="📍 Clients by District"
              type="bar"
            />
          </div>
        </>
      )}

      {/* Recent Activities */}
      {recentActivities.length > 0 && (
        <div className="card">
          <div className="card-title">Recent Activities</div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Client ID</th>
                <th>Client Name</th>
                <th>Activity</th>
                <th>Counsellor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.date}</td>
                  <td><strong>{activity.clientId}</strong></td>
                  <td>{activity.clientName}</td>
                  <td>{activity.activity}</td>
                  <td>{activity.counsellor}</td>
                  <td>
                    <span className="status-badge status-completed">
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card">
        <div className="card-title">Getting Started</div>
        <p style={{ marginBottom: '16px', color: '#4a5568' }}>
          Welcome to VARHAD PrEPARED Database Management System. Here's what you can do:
        </p>
        <ul style={{ color: '#4a5568', marginLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>Client Outreach:</strong> Register new clients with auto-generated IDs</li>
          <li><strong>HIV Testing:</strong> Record HIV test results with automatic routing</li>
          <li><strong>PrEP Initiation:</strong> Initiate PrEP for eligible clients</li>
          <li><strong>Inventory:</strong> Track medical supplies with auto-sync</li>
          <li><strong>Follow-ups:</strong> Manage appointments with WhatsApp reminders</li>
          <li><strong>Reports:</strong> Generate comprehensive reports for monitoring</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
