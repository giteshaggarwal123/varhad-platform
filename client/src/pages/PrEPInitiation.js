import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PrEPInitiation = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [formData, setFormData] = useState({
    willingToStart: 'Yes',
    consentSigned: true,
    prepInitiationDate: new Date().toISOString().split('T')[0],
    doctor: '',
    medicineName: 'TDF/FTC (Truvada)',
    prescriptionDuration: 30,
    quantityDispensed: 30,
    batchNumber: '',
    hepatitisBStatus: 'Not Tested',
    nextFollowUpDate: '',
    adherenceCounsellingProvided: true,
    sideEffectsDiscussed: true
  });
  const [uploadedDocs, setUploadedDocs] = useState({
    testReport: null,
    prescription: null,
    consentForm: null,
    paymentScreenshot: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get('/api/clients?hivStatus=Negative');
      setClients(res.data.data);
    } catch (err) {
      // Error fetching clients - handle silently
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const newFormData = { ...formData, [e.target.name]: value };

    // Auto-calculate next follow-up date when initiation date or prescription duration changes
    if (e.target.name === 'prepInitiationDate' || e.target.name === 'prescriptionDuration') {
      const initiationDate = e.target.name === 'prepInitiationDate' ? new Date(value) : new Date(formData.prepInitiationDate);
      const duration = e.target.name === 'prescriptionDuration' ? parseInt(value) : parseInt(formData.prescriptionDuration);

      if (initiationDate && duration) {
        const followUpDate = new Date(initiationDate);
        followUpDate.setDate(followUpDate.getDate() + duration);
        newFormData.nextFollowUpDate = followUpDate.toISOString().split('T')[0];
      }
    }

    setFormData(newFormData);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setUploadedDocs({ ...uploadedDocs, [name]: files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      setError('Please select a client');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create FormData for file uploads
      const prepFormData = new FormData();
      prepFormData.append('client', selectedClient);
      Object.keys(formData).forEach(key => {
        prepFormData.append(key, formData[key]);
      });

      // Append documents if uploaded
      if (uploadedDocs.testReport) prepFormData.append('testReport', uploadedDocs.testReport);
      if (uploadedDocs.prescription) prepFormData.append('prescription', uploadedDocs.prescription);
      if (uploadedDocs.consentForm) prepFormData.append('consentForm', uploadedDocs.consentForm);
      if (uploadedDocs.paymentScreenshot) prepFormData.append('paymentScreenshot', uploadedDocs.paymentScreenshot);

      await axios.post('/api/prep', prepFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('PrEP initiated successfully! Inventory updated and follow-up reminder created.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error initiating PrEP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="alert alert-success">
        <strong>✓ Eligible for PrEP:</strong> Client tested HIV Negative and meets risk criteria
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-title">PrEP Enrollment Details</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Client <span className="required">*</span></label>
              <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} required>
                <option value="">-- Select HIV Negative Client --</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.clientID} - {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Willing to Start PrEP <span className="required">*</span></label>
              <select name="willingToStart" value={formData.willingToStart} onChange={handleChange}>
                <option>Yes</option>
                <option>No</option>
                <option>Needs More Counselling</option>
              </select>
            </div>
            <div className="form-group">
              <label>PrEP Initiation Date <span className="required">*</span></label>
              <input
                type="date"
                name="prepInitiationDate"
                value={formData.prepInitiationDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="consentSigned"
                  checked={formData.consentSigned}
                  onChange={handleChange}
                />
                <span>Consent Form Signed *</span>
              </label>
            </div>
            <div className="form-group">
              <label>Hepatitis B Status</label>
              <select name="hepatitisBStatus" value={formData.hepatitisBStatus} onChange={handleChange}>
                <option>Not Tested</option>
                <option>Negative</option>
                <option>Positive</option>
                <option>Vaccinated</option>
              </select>
            </div>
          </div>

          <div className="card-title" style={{ marginTop: '24px' }}>Medication Details</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Medicine Name <span className="required">*</span></label>
              <select name="medicineName" value={formData.medicineName} onChange={handleChange}>
                <option>TDF/FTC (Truvada)</option>
                <option>TAF/FTC (Descovy)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration of Prescription</label>
              <select name="prescriptionDuration" value={formData.prescriptionDuration} onChange={handleChange}>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>
            <div className="form-group">
              <label>Quantity Dispensed <span className="required">*</span></label>
              <input
                type="number"
                name="quantityDispensed"
                value={formData.quantityDispensed}
                onChange={handleChange}
                placeholder="e.g., 30"
                min="1"
                required
              />
              <span className="helper-text">Will auto-update inventory</span>
            </div>
            <div className="form-group">
              <label>Batch Number</label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                placeholder="Enter batch number"
              />
            </div>
            <div className="form-group">
              <label>Next Follow-up Date <span className="required">*</span></label>
              <input
                type="date"
                name="nextFollowUpDate"
                value={formData.nextFollowUpDate}
                onChange={handleChange}
                required
              />
              <span className="helper-text">Auto-calculated based on prescription duration</span>
            </div>
          </div>

          <div className="card-title" style={{ marginTop: '24px' }}>Document Uploads</div>
          <div className="alert alert-info">
            Upload relevant documents for PrEP initiation (Report, Prescription, Consent Form, Payment Proof)
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Test Report</label>
              <input
                type="file"
                name="testReport"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <span className="helper-text">HIV test report, baseline test results</span>
              {uploadedDocs.testReport && (
                <div style={{ color: '#38a169', fontSize: '12px', marginTop: '4px' }}>
                  ✓ {uploadedDocs.testReport.name}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Prescription</label>
              <input
                type="file"
                name="prescription"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <span className="helper-text">Doctor's prescription for PrEP medication</span>
              {uploadedDocs.prescription && (
                <div style={{ color: '#38a169', fontSize: '12px', marginTop: '4px' }}>
                  ✓ {uploadedDocs.prescription.name}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Consent Form</label>
              <input
                type="file"
                name="consentForm"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <span className="helper-text">Signed consent form from client</span>
              {uploadedDocs.consentForm && (
                <div style={{ color: '#38a169', fontSize: '12px', marginTop: '4px' }}>
                  ✓ {uploadedDocs.consentForm.name}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Payment Screenshot</label>
              <input
                type="file"
                name="paymentScreenshot"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <span className="helper-text">Proof of payment or transaction</span>
              {uploadedDocs.paymentScreenshot && (
                <div style={{ color: '#38a169', fontSize: '12px', marginTop: '4px' }}>
                  ✓ {uploadedDocs.paymentScreenshot.name}
                </div>
              )}
            </div>
          </div>

          <div className="card-title" style={{ marginTop: '24px' }}>Counselling & Education</div>
          <div style={{ padding: '8px 0' }}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="adherenceCounsellingProvided"
                  checked={formData.adherenceCounsellingProvided}
                  onChange={handleChange}
                />
                <span>Adherence Counselling Provided</span>
              </label>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="sideEffectsDiscussed"
                  checked={formData.sideEffectsDiscussed}
                  onChange={handleChange}
                />
                <span>Side Effects & Management Discussed</span>
              </label>
            </div>
          </div>

          <div className="whatsapp-box">
            <h4>📱 Auto-Reminders Will Be Sent</h4>
            <p>✓ Follow-up appointment reminder (3 days before)<br />
            ✓ Medication refill reminder (7 days before)<br />
            ✓ Daily adherence message (if opted-in)</p>
          </div>

          <div className="nav-buttons">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/hiv-testing')}>
              Previous
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save & Initiate PrEP'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PrEPInitiation;
