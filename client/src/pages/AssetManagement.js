import React, { useState, useEffect } from 'react';

const AssetManagement = () => {
  // Load assets from localStorage or use default
  const loadAssets = () => {
    const saved = localStorage.getItem('varhadAssets');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, name: 'Laptop - Dell Latitude', assetId: 'AST001', assignedTo: 'Aparna Banerjee', condition: 'Good', location: 'Lucknow Office', purchaseDate: '2024-01-15', value: 45000 },
      { id: 2, name: 'Mobile Phone - Samsung', assetId: 'AST002', assignedTo: 'Dr. Sharma', condition: 'Excellent', location: 'Field Office', purchaseDate: '2024-03-20', value: 25000 },
      { id: 3, name: 'Projector - Epson', assetId: 'AST003', assignedTo: 'Training Room', condition: 'Good', location: 'Main Office', purchaseDate: '2023-11-10', value: 35000 },
      { id: 4, name: 'Vehicle - Mahindra Bolero', assetId: 'AST004', assignedTo: 'Field Team', condition: 'Fair', location: 'Varanasi', purchaseDate: '2023-06-05', value: 850000 }
    ];
  };

  const [assets, setAssets] = useState(loadAssets);

  // Save to localStorage whenever assets change
  useEffect(() => {
    localStorage.setItem('varhadAssets', JSON.stringify(assets));
  }, [assets]);

  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [viewingAsset, setViewingAsset] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    assetId: '',
    assignedTo: '',
    condition: 'Good',
    location: '',
    purchaseDate: '',
    value: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAsset) {
      // Update existing asset
      setAssets(prev => prev.map(asset => 
        asset.id === editingAsset.id 
          ? { ...formData, id: editingAsset.id }
          : asset
      ));
      alert('Asset updated successfully!');
    } else {
      // Add new asset
      const newAsset = {
        ...formData,
        id: assets.length + 1
      };
      setAssets(prev => [...prev, newAsset]);
      alert('Asset added successfully!');
    }
    
    resetForm();
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      assetId: asset.assetId,
      assignedTo: asset.assignedTo,
      condition: asset.condition,
      location: asset.location,
      purchaseDate: asset.purchaseDate,
      value: asset.value
    });
    setShowForm(true);
  };

  const handleView = (asset) => {
    setViewingAsset(asset);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(prev => prev.filter(asset => asset.id !== id));
      alert('Asset deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      assetId: '',
      assignedTo: '',
      condition: 'Good',
      location: '',
      purchaseDate: '',
      value: ''
    });
    setShowForm(false);
    setEditingAsset(null);
  };

  const stats = {
    total: assets.length,
    inUse: assets.filter(a => a.assignedTo && !a.assignedTo.includes('Room')).length,
    maintenance: assets.filter(a => a.condition === 'Fair').length,
    available: assets.filter(a => a.assignedTo.includes('Room') || !a.assignedTo).length
  };

  return (
    <div>
      <div className="alert alert-success">
        <strong>🏢 Asset Management:</strong> Track and manage all organizational assets including equipment, vehicles, and technology
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Assets</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-trend">Registered</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Use</div>
          <div className="stat-value">{stats.inUse}</div>
          <div className="stat-trend">Assigned</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Under Maintenance</div>
          <div className="stat-value">{stats.maintenance}</div>
          <div className="stat-trend">Servicing</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Available</div>
          <div className="stat-value">{stats.available}</div>
          <div className="stat-trend">Ready to assign</div>
        </div>
      </div>

      {/* Add Asset Button */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Asset'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-title">{editingAsset ? 'Edit Asset' : 'Add New Asset'}</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Asset Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Laptop - Dell Latitude"
                  required
                />
              </div>
              <div className="form-group">
                <label>Asset ID *</label>
                <input
                  type="text"
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleInputChange}
                  placeholder="e.g., AST001"
                  required
                />
              </div>
              <div className="form-group">
                <label>Assigned To</label>
                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  placeholder="Person or Department"
                />
              </div>
              <div className="form-group">
                <label>Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Poor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Lucknow Office"
                  required
                />
              </div>
              <div className="form-group">
                <label>Purchase Date</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Value (₹)</label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="Asset value"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary">
                {editingAsset ? 'Update Asset' : 'Add Asset'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* View Modal */}
      {viewingAsset && (
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
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '24px', color: '#2d3748' }}>Asset Details</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <strong>Asset ID:</strong> {viewingAsset.assetId}
              </div>
              <div>
                <strong>Name:</strong> {viewingAsset.name}
              </div>
              <div>
                <strong>Assigned To:</strong> {viewingAsset.assignedTo}
              </div>
              <div>
                <strong>Condition:</strong> 
                <span className={`status-badge ${
                  viewingAsset.condition === 'Excellent' ? 'status-completed' :
                  viewingAsset.condition === 'Good' ? 'status-pending' : 'status-overdue'
                }`}>
                  {viewingAsset.condition}
                </span>
              </div>
              <div>
                <strong>Location:</strong> {viewingAsset.location}
              </div>
              <div>
                <strong>Purchase Date:</strong> {viewingAsset.purchaseDate}
              </div>
              <div>
                <strong>Value:</strong> ₹{viewingAsset.value?.toLocaleString()}
              </div>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={() => setViewingAsset(null)}
              style={{ marginTop: '24px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">Asset Register</div>
        <table>
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Asset Name</th>
              <th>Assigned To</th>
              <th>Condition</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td><strong>{asset.assetId}</strong></td>
                <td>{asset.name}</td>
                <td>{asset.assignedTo}</td>
                <td>
                  <span className={`status-badge ${
                    asset.condition === 'Excellent' ? 'status-completed' :
                    asset.condition === 'Good' ? 'status-pending' : 'status-overdue'
                  }`}>
                    {asset.condition}
                  </span>
                </td>
                <td>{asset.location}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary" 
                    onClick={() => handleView(asset)}
                    style={{ marginRight: '4px' }}
                  >
                    View
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleEdit(asset)}
                    style={{ marginRight: '4px' }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleDelete(asset.id)}
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

export default AssetManagement;
