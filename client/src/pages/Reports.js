import React, { useState } from 'react';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';

const Reports = () => {
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState('This Month');
  const [district, setDistrict] = useState('All Districts');
  const [generatedReport, setGeneratedReport] = useState(null);

  const sampleReportData = [
    { date: '2025-10-20', clientId: 'VH02847', clientName: 'Neeta K.', activity: 'Virtual Outreach', counsellor: 'Aparna Banerjee', status: 'Completed' },
    { date: '2025-10-17', clientId: 'VH02846', clientName: 'Rahul M.', activity: 'PrEP Initiation', counsellor: 'Sita Sharma', status: 'Completed' },
    { date: '2025-10-17', clientId: 'VH02845', clientName: 'Amit P.', activity: 'HIV Testing', counsellor: 'Aparna Banerjee', status: 'Completed' }
  ];

  const handleExportCSV = () => {
    exportToCSV(sampleReportData, 'varhad_report');
  };

  const handleExportExcel = () => {
    exportToExcel(sampleReportData, 'varhad_report');
  };

  const handleExportPDF = () => {
    exportToPDF('report-content', 'varhad_report');
  };

  const handleGenerateReport = () => {
    // Generate report based on selected filters
    const report = {
      type: reportType,
      dateRange: dateRange,
      district: district,
      generatedOn: new Date().toLocaleString(),
      data: sampleReportData,
      summary: {
        totalRecords: sampleReportData.length,
        completed: sampleReportData.filter(r => r.status === 'Completed').length,
        pending: sampleReportData.filter(r => r.status === 'Pending').length
      }
    };

    setGeneratedReport(report);
    alert(`${reportType} report generated successfully!\nDate Range: ${dateRange}\nDistrict: ${district}\nTotal Records: ${report.summary.totalRecords}`);
  };

  return (
    <div>
      <div className="alert alert-info">
        <strong>📊 Reports & Analytics:</strong> Generate comprehensive reports for program monitoring and evaluation
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Reports Generated</div>
          <div className="stat-value">156</div>
          <div className="stat-trend">This year</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Data Points</div>
          <div className="stat-value">45,892</div>
          <div className="stat-trend">Tracked metrics</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Export Formats</div>
          <div className="stat-value">3</div>
          <div className="stat-trend">PDF, Excel, CSV</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Scheduled Reports</div>
          <div className="stat-value">8</div>
          <div className="stat-trend">Auto-generated</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Generate Report</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="monthly">Monthly Summary Report</option>
              <option value="client">Client Registration Report</option>
              <option value="prep">PrEP Initiation Report</option>
              <option value="hiv">HIV Testing Report</option>
              <option value="inventory">Inventory Status Report</option>
              <option value="followup">Follow-up Adherence Report</option>
              <option value="staff">Staff Performance Report</option>
              <option value="financial">Financial Summary Report</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date Range</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div className="form-group">
            <label>District Filter</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option>All Districts</option>
              <option>Lucknow</option>
              <option>Varanasi</option>
              <option>Kanpur</option>
              <option>Allahabad</option>
            </select>
          </div>
          <div className="form-group">
            <label>Export Format</label>
            <select>
              <option>PDF</option>
              <option>Excel (XLSX)</option>
              <option>CSV</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button className="btn btn-primary" onClick={handleGenerateReport}>Generate Report</button>
          <button className="btn btn-secondary" onClick={handleExportCSV}>Export CSV</button>
          <button className="btn btn-secondary" onClick={handleExportExcel}>Export Excel</button>
          <button className="btn btn-secondary" onClick={handleExportPDF}>Export PDF</button>
        </div>
        
        {generatedReport && (
          <div style={{ marginTop: '20px', padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '2px solid #3b82f6' }}>
            <h4 style={{ color: '#1e40af', marginBottom: '12px' }}>✓ Report Generated</h4>
            <p style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>
              <strong>Type:</strong> {generatedReport.type}<br/>
              <strong>Date Range:</strong> {generatedReport.dateRange}<br/>
              <strong>District:</strong> {generatedReport.district}<br/>
              <strong>Generated On:</strong> {generatedReport.generatedOn}<br/>
              <strong>Total Records:</strong> {generatedReport.summary.totalRecords}
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Quick Stats Overview</div>
        <div style={{ padding: '20px' }}>
          <h4 style={{ marginBottom: '16px', color: '#2d3748' }}>Program Performance Metrics</h4>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">New Clients (This Month)</div>
              <div className="stat-value">124</div>
              <div className="stat-trend">+12% from last month</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">PrEP Initiations</div>
              <div className="stat-value">89</div>
              <div className="stat-trend">71.8% conversion rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">HIV Tests Conducted</div>
              <div className="stat-value">156</div>
              <div className="stat-trend">All results documented</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Follow-up Compliance</div>
              <div className="stat-value">91%</div>
              <div className="stat-trend">Above target (85%)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recent Reports</div>
        <table>
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Generated On</th>
              <th>Period</th>
              <th>Format</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monthly Summary - October 2025</td>
              <td>2025-10-20</td>
              <td>Oct 1-20, 2025</td>
              <td><span className="badge">PDF</span></td>
              <td>
                <button className="btn btn-sm btn-primary">Download</button>
                <button className="btn btn-sm btn-secondary">View</button>
              </td>
            </tr>
            <tr>
              <td>PrEP Initiation Report - Q3 2025</td>
              <td>2025-09-30</td>
              <td>Jul-Sep 2025</td>
              <td><span className="badge">Excel</span></td>
              <td>
                <button className="btn btn-sm btn-primary">Download</button>
                <button className="btn btn-sm btn-secondary">View</button>
              </td>
            </tr>
            <tr>
              <td>Inventory Status - September</td>
              <td>2025-09-28</td>
              <td>September 2025</td>
              <td><span className="badge">PDF</span></td>
              <td>
                <button className="btn btn-sm btn-primary">Download</button>
                <button className="btn btn-sm btn-secondary">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
