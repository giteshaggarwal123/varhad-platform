import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HIVTesting = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [clientDetails, setClientDetails] = useState(null);
  const [formData, setFormData] = useState({
    // Engagement Stage Fields
    contactNumber: '',
    alternatePhone: '',
    email: '',
    preferredContactMethod: 'WhatsApp',
    maritalStatus: '',
    engagementStageNotes: '',

    // Engagement Details
    engagementDate: new Date().toISOString().split('T')[0],
    purposeOfEngagement: 'HIV Testing',

    // HIV Testing Details
    testingID: '',
    testDate: new Date().toISOString().split('T')[0],
    testResult: '',
    hivTestType: '',
    testType: 'Rapid Test',
    testingLab: '',
    testingLabOther: '',
    testResultDetails: '',

    // Risk Assessment
    unprotectedSexualActivity: false,
    numberOfPartners: 0,
    condomUsageFrequency: 'Sometimes',
    alcoholDrugUse: 'No',
    stiHistory: 'No',
    partnerHIVStatus: 'Unknown',
    injectionDrugUse: false,
    shareNeedles: false,
    commercialSexWork: false,
    multipleConcurrentPartners: false,
    recentSTISymptoms: false,
    hivPositivePartner: false,
    riskScore: 'Medium',
    assessmentNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedClientID, setGeneratedClientID] = useState('');

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

  const handleClientSelect = async (clientId) => {
    setSelectedClient(clientId);
    if (clientId) {
      try {
        const res = await axios.get(`/api/clients/${clientId}`);
        setClientDetails(res.data.data);
        // Pre-fill contact info if already exists
        if (res.data.data.contactNumber) {
          setFormData({
            ...formData,
            contactNumber: res.data.data.contactNumber || '',
            alternatePhone: res.data.data.alternatePhone || '',
            email: res.data.data.email || '',
            preferredContactMethod: res.data.data.preferredContactMethod || 'WhatsApp',
            maritalStatus: res.data.data.maritalStatus || ''
          });
          setGeneratedClientID(res.data.data.clientID || '');
        }
      } catch (err) {
        console.error('Error fetching client details');
      }
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleContactNumberUpdate = async () => {
    if (!selectedClient || !formData.contactNumber) {
      setError('Please select a client and enter contact number');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`/api/clients/${selectedClient}`, {
        contactNumber: formData.contactNumber,
        alternatePhone: formData.alternatePhone,
        email: formData.email,
        preferredContactMethod: formData.preferredContactMethod,
        maritalStatus: formData.maritalStatus,
        engagementStageNotes: formData.engagementStageNotes
      });

      setGeneratedClientID(res.data.data.clientID);
      setClientDetails(res.data.data);
      alert(`Contact details saved! Client ID generated: ${res.data.data.clientID}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating client');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      setError('Please select a client');
      return;
    }

    if (!generatedClientID) {
      setError('Please add contact number and generate Client ID first');
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
        client: selectedClient,
        engagementDate: formData.engagementDate,
        purposeOfEngagement: formData.purposeOfEngagement,
        engagementStageNotes: formData.engagementStageNotes,
        testingID: formData.testingID,
        testDate: formData.testDate,
        testResult: formData.testResult,
        hivTestType: formData.hivTestType,
        testType: formData.testType,
        testingLab: formData.testingLab,
        testingLabOther: formData.testingLabOther,
        testResultDetails: formData.testResultDetails,
        riskAssessment: {
          unprotectedSexualActivity: formData.unprotectedSexualActivity,
          numberOfPartners: formData.numberOfPartners,
          condomUsageFrequency: formData.condomUsageFrequency,
          alcoholDrugUse: formData.alcoholDrugUse,
          stiHistory: formData.stiHistory,
          partnerHIVStatus: formData.partnerHIVStatus,
          injectionDrugUse: formData.injectionDrugUse,
          shareNeedles: formData.shareNeedles,
          commercialSexWork: formData.commercialSexWork,
          multipleConcurrentPartners: formData.multipleConcurrentPartners,
          recentSTISymptoms: formData.recentSTISymptoms,
          hivPositivePartner: formData.hivPositivePartner,
          riskScore: formData.riskScore,
          assessmentNotes: formData.assessmentNotes
        }
      });

      // Auto-navigate based on result
      if (formData.testResult === 'Negative') {
        alert('Client tested HIV Negative. Redirecting to PrEP Initiation module.');
        navigate('/prep');
      } else if (formData.testResult === 'Positive') {
        alert('Client tested HIV Positive. Please provide ART linkage and referral.');
        navigate('/art-referrals');
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
      <div className="alert alert-info">
        <strong>Engagement Stage:</strong> Add contact details to generate unique Client ID, then complete HIV testing
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-title">Select Client from Reach Stage</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Client <span className="required">*</span></label>
              <select value={selectedClient} onChange={(e) => handleClientSelect(e.target.value)} required>
                <option value="">-- Select Client --</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.clientID || 'No ID'} - {client.name} ({client.gender}, {client.age})
                  </option>
                ))}
              </select>
            </div>
            {clientDetails && (
              <div className="form-group">
                <label>Client Details</label>
                <div style={{ padding: '8px', background: '#f7fafc', borderRadius: '4px', fontSize: '14px' }}>
                  <strong>{clientDetails.name}</strong><br />
                  {clientDetails.typology} | District: {clientDetails.district}
                  {clientDetails.reachStageNotes && (
                    <div style={{ marginTop: '4px', color: '#718096' }}>
                      Notes: {clientDetails.reachStageNotes}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="card-title" style={{ marginTop: '24px' }}>Engagement Stage - Contact Information</div>
          <div className="alert alert-warning">
            <strong>Important:</strong> Client ID will be auto-generated when you save contact number
          </div>

          {generatedClientID && (
            <div className="alert alert-success">
              <strong>✓ Client ID Generated: {generatedClientID}</strong>
            </div>
          )}

          <div className="form-grid">
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
              <label>Alternate Phone</label>
              <input
                type="tel"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                placeholder="Alternative contact number"
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
                <option value="">-- Select --</option>
                <option>Unmarried</option>
                <option>Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label>Special Instructions/Notes (Engagement Stage)</label>
            <textarea
              name="engagementStageNotes"
              value={formData.engagementStageNotes}
              onChange={handleChange}
              placeholder="Any special instructions or notes for this engagement stage"
              rows="2"
            />
          </div>

          {!generatedClientID && (
            <button type="button" className="btn btn-success" onClick={handleContactNumberUpdate} style={{ marginTop: '12px' }}>
              Save Contact Info & Generate Client ID
            </button>
          )}

          <div className="card-title" style={{ marginTop: '24px' }}>Engagement Details</div>
          <div className="form-grid">
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
                <option>PEP</option>
                <option>Doctor Consultation</option>
                <option>Crisis Support</option>
                <option>Others</option>
              </select>
            </div>
          </div>

          <div className="card-title" style={{ marginTop: '24px' }}>HIV Testing Details</div>
          <div className="alert alert-info">
            Based on test result, system will automatically navigate to appropriate module
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Testing ID</label>
              <input
                type="text"
                name="testingID"
                value={formData.testingID}
                onChange={handleChange}
                placeholder="Lab testing ID/Reference number"
              />
            </div>
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
              <label>Type of HIV Test <span className="required">*</span></label>
              <select name="hivTestType" value={formData.hivTestType} onChange={handleChange} required>
                <option value="">-- Select Test Type --</option>
                <option>Screening Test</option>
                <option>Confirmatory Test</option>
              </select>
            </div>
            <div className="form-group">
              <label>Test Method</label>
              <select name="testType" value={formData.testType} onChange={handleChange}>
                <option>Rapid Test</option>
                <option>ELISA</option>
                <option>NAT</option>
                <option>Western Blot</option>
              </select>
            </div>
            <div className="form-group">
              <label>Testing Lab <span className="required">*</span></label>
              <select name="testingLab" value={formData.testingLab} onChange={handleChange} required>
                <option value="">-- Select Testing Lab --</option>
                <option>Redcliffe</option>
                <option>Thyrocare</option>
                <option>Govt. ICTC Testing Centre</option>
                <option>Others</option>
              </select>
            </div>
            {formData.testingLab === 'Others' && (
              <div className="form-group">
                <label>Specify Other Lab</label>
                <input
                  type="text"
                  name="testingLabOther"
                  value={formData.testingLabOther}
                  onChange={handleChange}
                  placeholder="Enter lab name"
                />
              </div>
            )}
            <div className="form-group">
              <label>Test Result <span className="required">*</span></label>
              <select name="testResult" value={formData.testResult} onChange={handleChange} required>
                <option value="">-- Select Result --</option>
                <option value="Negative">Negative (Proceed to PrEP)</option>
                <option value="Positive">Positive (Proceed to ART Linkage)</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Test Result Details</label>
              <textarea
                name="testResultDetails"
                value={formData.testResultDetails}
                onChange={handleChange}
                placeholder="Complete testing result details, observations, recommendations from lab"
                rows="3"
              />
            </div>
          </div>

          <div className="card-title" style={{ marginTop: '24px' }}>Enhanced Risk Assessment</div>
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="multipleConcurrentPartners"
                  checked={formData.multipleConcurrentPartners}
                  onChange={handleChange}
                />
                <span>Multiple Concurrent Partners</span>
              </label>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="hivPositivePartner"
                  checked={formData.hivPositivePartner}
                  onChange={handleChange}
                />
                <span>HIV Positive Partner</span>
              </label>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="injectionDrugUse"
                  checked={formData.injectionDrugUse}
                  onChange={handleChange}
                />
                <span>Injection Drug Use</span>
              </label>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="shareNeedles"
                  checked={formData.shareNeedles}
                  onChange={handleChange}
                />
                <span>Share Needles</span>
              </label>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="commercialSexWork"
                  checked={formData.commercialSexWork}
                  onChange={handleChange}
                />
                <span>Commercial Sex Work</span>
              </label>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="recentSTISymptoms"
                  checked={formData.recentSTISymptoms}
                  onChange={handleChange}
                />
                <span>Recent STI Symptoms</span>
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
                <option>Rarely</option>
                <option>Never</option>
              </select>
            </div>
            <div className="form-group">
              <label>Alcohol/Drug Use</label>
              <select name="alcoholDrugUse" value={formData.alcoholDrugUse} onChange={handleChange}>
                <option>No</option>
                <option>Yes - Occasional</option>
                <option>Yes - Frequent</option>
              </select>
            </div>
            <div className="form-group">
              <label>STI History</label>
              <select name="stiHistory" value={formData.stiHistory} onChange={handleChange}>
                <option>No</option>
                <option>Yes - Current</option>
                <option>Yes - Past</option>
              </select>
            </div>
            <div className="form-group">
              <label>Partner HIV Status</label>
              <select name="partnerHIVStatus" value={formData.partnerHIVStatus} onChange={handleChange}>
                <option>Unknown</option>
                <option>Negative</option>
                <option>Positive</option>
              </select>
            </div>
            <div className="form-group">
              <label>Overall Risk Score</label>
              <select name="riskScore" value={formData.riskScore} onChange={handleChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Risk Assessment Notes</label>
              <textarea
                name="assessmentNotes"
                value={formData.assessmentNotes}
                onChange={handleChange}
                placeholder="Additional notes about risk factors and assessment"
                rows="2"
              />
            </div>
          </div>

          <div className="nav-buttons">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/outreach')}>
              Previous
            </button>
            <button type="submit" className="btn btn-success" disabled={loading || !generatedClientID}>
              {loading ? 'Saving...' : 'Save & Continue (Auto-Navigate Based on Result)'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HIVTesting;
