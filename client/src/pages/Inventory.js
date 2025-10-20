import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BulkUpload from '../components/BulkUpload';

const Inventory = () => {
  const bulkUploadTemplate = [
    { itemName: 'PrEP Tablets', category: 'PrEP Medication', quantity: 100, batchNumber: 'BT2025-001', expiryDate: '2026-12-31', reorderLevel: 50, unitPrice: 150, supplier: 'Pharma Corp' }
  ];
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'PrEP Medication',
    quantity: '',
    batchNumber: '',
    expiryDate: '',
    reorderLevel: '',
    unitPrice: '',
    supplier: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('/api/inventory');
      setInventory(res.data.data);
    } catch (err) {
      // Error fetching inventory - handle silently
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (item) => {
    if (item.quantity === 0) return { text: 'Out of Stock', class: 'status-overdue' };
    if (item.quantity <= item.reorderLevel) return { text: 'Low Stock - Reorder', class: 'status-pending' };
    return { text: 'In Stock', class: 'status-completed' };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        // Update existing item
        await axios.put(`/api/inventory/${editingItem._id}`, formData);
        alert('Inventory item updated successfully!');
      } else {
        // Add new item
        await axios.post('/api/inventory', formData);
        alert('Inventory item added successfully!');
      }
      
      fetchInventory();
      resetForm();
    } catch (err) {
      alert('Error saving inventory item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity,
      batchNumber: item.batchNumber,
      expiryDate: item.expiryDate,
      reorderLevel: item.reorderLevel,
      unitPrice: item.unitPrice || '',
      supplier: item.supplier || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/inventory/${id}`);
        alert('Item deleted successfully!');
        fetchInventory();
      } catch (err) {
        alert('Error deleting item');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      category: 'PrEP Medication',
      quantity: '',
      batchNumber: '',
      expiryDate: '',
      reorderLevel: '',
      unitPrice: '',
      supplier: ''
    });
    setShowForm(false);
    setEditingItem(null);
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
        <strong>✓ Auto-Sync Enabled:</strong> Inventory automatically updates when medication is dispensed during PrEP initiation
      </div>

      <BulkUpload
        moduleName="Inventory"
        templateData={bulkUploadTemplate}
        onUpload={(file) => {
          fetchInventory();
        }}
      />

      {/* Add Item Button */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Item'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-title">{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  placeholder="e.g., PrEP Tablets"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option>PrEP Medication</option>
                  <option>HIV Test Kits</option>
                  <option>Condoms</option>
                  <option>Medical Supplies</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Current quantity"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Batch Number</label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., BT2025-001"
                />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Reorder Level *</label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleInputChange}
                  placeholder="Minimum quantity"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit Price (₹)</label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  placeholder="Price per unit"
                />
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  placeholder="Supplier name"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary">
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="stats-grid">
        {inventory.map((item) => {
          const status = getStockStatus(item);
          return (
            <div key={item._id} className="stat-card">
              <div className="stat-label">{item.itemName}</div>
              <div className="stat-value">{item.quantity}</div>
              <div className={`stat-trend ${status.class === 'status-overdue' || status.class === 'status-pending' ? 'status-low' : ''}`}>
                {status.text}
              </div>
              {item.batchNumber && (
                <p style={{ fontSize: '11px', color: '#718096', marginTop: '4px' }}>
                  Batch: {item.batchNumber}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 10px' }}>
          <h3 style={{ margin: 0 }}>Inventory Items</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Batch Number</th>
              <th>Expiry Date</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const status = getStockStatus(item);
              return (
                <tr key={item._id}>
                  <td><strong>{item.itemName}</strong></td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.batchNumber || 'N/A'}</td>
                  <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{item.reorderLevel}</td>
                  <td>
                    <span className={`status-badge ${status.class}`}>{status.text}</span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEdit(item)}
                      style={{ marginRight: '4px' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
