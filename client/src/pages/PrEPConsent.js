import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { generateConsentPDF, viewConsentPDF } from '../utils/pdfGenerator';

const PrEPConsent = () => {
  const [formData, setFormData] = useState({
    clientId: '',
    consentType: 'PrEP Initiation Consent',
    consentDate: new Date().toISOString().split('T')[0],
    witnessedBy: 'Aparna Banerjee',
    counseled: false,
    questionsAnswered: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Load consents from localStorage or use default
  const loadConsents = () => {
    const saved = localStorage.getItem('varhadConsents');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, clientId: 'VH02847', clientName: 'Neeta K.', consentDate: '2025-10-18', consentType: 'PrEP Initiation', status: 'Signed', witnessedBy: 'Aparna Banerjee' },
      { id: 2, clientId: 'VH02846', clientName: 'Rahul M.', consentDate: '2025-10-17', consentType: 'PrEP Initiation', status: 'Signed', witnessedBy: 'Sita Sharma' },
      { id: 3, clientId: 'VH02845', clientName: 'Amit P.', consentDate: '2025-10-17', consentType: 'HIV Testing', status: 'Signed', witnessedBy: 'Aparna Banerjee' },
      { id: 4, clientId: 'VH02844', clientName: 'Priya S.', consentDate: '2025-10-16', consentType: 'PrEP Initiation', status: 'Pending', witnessedBy: '-' }
    ];
  };

  const [consents, setConsents] = useState(loadConsents);

  // Save to localStorage whenever consents change
  useEffect(() => {
    localStorage.setItem('varhadConsents', JSON.stringify(consents));
  }, [consents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.clientId) {
      alert('Please enter Client ID');
      return;
    }

    if (!formData.counseled || !formData.questionsAnswered) {
      alert('Please confirm all checkboxes');
      return;
    }

    try {
      // Validate Client ID and get client name
      const clientRes = await axios.get(`/api/clients?search=${formData.clientId}`);

      if (!clientRes.data.data || clientRes.data.data.length === 0) {
        alert(`Client ID ${formData.clientId} not found! Please enter a valid Client ID.`);
        return;
      }

      const client = clientRes.data.data[0];

      // Add new consent to the list
      const newConsent = {
        id: consents.length + 1,
        clientId: formData.clientId,
        clientName: client.name, // Actual name from API
        consentDate: formData.consentDate,
        consentType: formData.consentType,
        status: 'Signed',
        witnessedBy: formData.witnessedBy
      };

      setConsents(prev => [newConsent, ...prev]);
      alert(`Consent recorded successfully for ${client.name}!`);
      
      setFormData({
        clientId: '',
        consentType: 'PrEP Initiation Consent',
        consentDate: new Date().toISOString().split('T')[0],
        witnessedBy: 'Aparna Banerjee',
        counseled: false,
        questionsAnswered: false
      });
    } catch (err) {
      alert('Error validating Client ID. Please try again.');
    }
  };

  const handleViewPDF = (consent) => {
    viewConsentPDF({
      clientId: consent.clientId,
      clientName: consent.clientName,
      date: consent.consentDate,
      consentType: consent.consentType,
      witnessedBy: consent.witnessedBy
    });
  };

  const handlePrintPDF = (consent) => {
    generateConsentPDF({
      clientId: consent.clientId,
      clientName: consent.clientName,
      date: consent.consentDate,
      consentType: consent.consentType,
      witnessedBy: consent.witnessedBy
    });
  };

  return (
    <div>
      <div className="alert alert-warning">
        <strong>📋 PrEP Consent Management:</strong> Manage informed consent forms for PrEP initiation and HIV testing
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Consents</div>
          <div className="stat-value">2,847</div>
          <div className="stat-trend">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">This Month</div>
          <div className="stat-value">124</div>
          <div className="stat-trend">New consents</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Signature</div>
          <div className="stat-value">3</div>
          <div className="stat-trend">Awaiting completion</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Compliance Rate</div>
          <div className="stat-value">98.5%</div>
          <div className="stat-trend">Documentation</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-title">Record New Consent</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Client ID *</label>
              <input 
                type="text" 
                name="clientId"
                value={formData.clientId}
                onChange={handleInputChange}
                placeholder="Enter or scan client ID (e.g., VH00001)" 
                required
              />
            </div>
            <div className="form-group">
              <label>Consent Type</label>
              <select 
                name="consentType"
                value={formData.consentType}
                onChange={handleInputChange}
              >
                <option>PrEP Initiation Consent</option>
                <option>HIV Testing Consent</option>
                <option>Data Sharing Consent</option>
                <option>Photography Consent</option>
              </select>
            </div>
            <div className="form-group">
              <label>Consent Date</label>
              <input 
                type="date" 
                name="consentDate"
                value={formData.consentDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Witnessed By</label>
              <select 
                name="witnessedBy"
                value={formData.witnessedBy}
                onChange={handleInputChange}
              >
                <option>Aparna Banerjee</option>
                <option>Dr. Rajesh Sharma</option>
                <option>Sita Sharma</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                name="counseled"
                checked={formData.counseled}
                onChange={handleInputChange}
                required
              /> 
              Client has been counseled and understands the risks and benefits
            </label>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                name="questionsAnswered"
                checked={formData.questionsAnswered}
                onChange={handleInputChange}
                required
              /> 
              All questions have been answered satisfactorily
            </label>
          </div>
          <button type="submit" className="btn btn-primary">Record Consent</button>
        </div>
      </form>

      <div className="card">
        <div className="card-title">Consent Records</div>
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Client Name</th>
              <th>Consent Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Witnessed By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {consents.map((consent) => (
              <tr key={consent.id}>
                <td><strong>{consent.clientId}</strong></td>
                <td>{consent.clientName}</td>
                <td>{consent.consentType}</td>
                <td>{consent.consentDate}</td>
                <td>
                  <span className={`status-badge ${
                    consent.status === 'Signed' ? 'status-completed' : 'status-pending'
                  }`}>
                    {consent.status}
                  </span>
                </td>
                <td>{consent.witnessedBy}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleViewPDF(consent)}
                    style={{ marginRight: '4px' }}
                  >
                    View PDF
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handlePrintPDF(consent)}
                  >
                    Print PDF
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

export default PrEPConsent;
