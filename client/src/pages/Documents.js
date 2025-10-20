import React, { useState, useEffect } from 'react';

const Documents = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Guidelines',
    file: null
  });
  const [uploading, setUploading] = useState(false);
  
  // Load documents from localStorage or use default
  const loadDocuments = () => {
    const saved = localStorage.getItem('varhadDocuments');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, name: 'PrEP Guidelines 2024', type: 'PDF', size: '2.4 MB', uploadDate: '2024-01-15' },
      { id: 2, name: 'Consent Form Template', type: 'DOCX', size: '156 KB', uploadDate: '2024-01-10' },
      { id: 3, name: 'HIV Testing Protocol', type: 'PDF', size: '1.8 MB', uploadDate: '2024-01-05' },
      { id: 4, name: 'Client Registration Form', type: 'PDF', size: '245 KB', uploadDate: '2023-12-20' }
    ];
  };

  const [documents, setDocuments] = useState(loadDocuments);

  // Save to localStorage whenever documents change
  useEffect(() => {
    localStorage.setItem('varhadDocuments', JSON.stringify(documents));
  }, [documents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.file) {
      alert('Please enter document name and select a file');
      return;
    }

    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newDoc = {
        id: documents.length + 1,
        name: formData.name,
        type: formData.file.name.split('.').pop().toUpperCase(),
        size: `${(formData.file.size / 1024).toFixed(0)} KB`,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      
      setDocuments(prev => [newDoc, ...prev]);
      setFormData({ name: '', category: 'Guidelines', file: null });
      setUploading(false);
      alert('Document uploaded successfully!');
      
      // Reset file input
      document.querySelector('input[type="file"]').value = '';
    }, 1000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      alert('Document deleted successfully!');
    }
  };

  const handleDownload = (doc) => {
    // Create a dummy file content for demonstration
    const content = `Document: ${doc.name}\nType: ${doc.type}\nSize: ${doc.size}\nUploaded: ${doc.uploadDate}\n\nThis is a sample document from VARHAD PrEPARED system.`;
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.name}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`Downloaded: ${doc.name}`);
  };

  return (
    <div>
      <div className="alert alert-info">
        <strong>📁 Document Management:</strong> Store and manage all program-related documents, forms, and guidelines
      </div>

      <form onSubmit={handleUpload}>
        <div className="card">
          <div className="card-title">Upload New Document</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Document Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter document name" 
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option>Guidelines</option>
                <option>Forms</option>
                <option>Protocols</option>
                <option>Reports</option>
                <option>Training Materials</option>
              </select>
            </div>
            <div className="form-group">
              <label>Upload File *</label>
              <input 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                required
              />
              {formData.file && (
                <small style={{ color: '#059669', marginTop: '4px', display: 'block' }}>
                  ✓ Selected: {formData.file.name}
                </small>
              )}
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>

      <div className="card">
        <div className="card-title">Document Library</div>
        <table>
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td><span className="badge">{doc.type}</span></td>
                <td>{doc.size}</td>
                <td>{doc.uploadDate}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary" 
                    onClick={() => handleDownload(doc)}
                    style={{ marginRight: '4px' }}
                  >
                    Download
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
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

export default Documents;
