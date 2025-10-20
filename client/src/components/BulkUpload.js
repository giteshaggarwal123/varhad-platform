import React, { useState } from 'react';

const BulkUpload = ({ onUpload, templateData, moduleName }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.ms-excel' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        alert('Please upload a valid Excel (.xlsx, .xls) or CSV file');
        e.target.value = null;
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      alert(`File "${file.name}" uploaded successfully! Processing ${moduleName} data...`);
      setFile(null);
      setUploading(false);
      if (onUpload) onUpload(file);
    }, 1500);
  };

  const downloadTemplate = () => {
    // Create CSV template
    const headers = Object.keys(templateData[0]).join(',');
    const rows = templateData.map(row => Object.values(row).join(',')).join('\n');
    const csv = headers + '\n' + rows;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${moduleName}_template.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card" style={{ background: '#f0f9ff', border: '2px dashed #3b82f6' }}>
      <div className="card-title" style={{ color: '#1e40af' }}>
        📤 Bulk Upload - {moduleName}
      </div>
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '14px', color: '#475569', marginBottom: '12px' }}>
          Upload multiple records at once using Excel or CSV file
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <input 
            type="file" 
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            style={{ flex: 1 }}
          />
          {file && (
            <span style={{ fontSize: '12px', color: '#059669' }}>
              ✓ {file.name}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload & Process'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={downloadTemplate}
          >
            Download Template
          </button>
        </div>
        <small style={{ display: 'block', marginTop: '12px', color: '#64748b', fontSize: '12px' }}>
          💡 Tip: Download the template first, fill in your data, then upload the completed file
        </small>
      </div>
    </div>
  );
};

export default BulkUpload;
