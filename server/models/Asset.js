const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetID: {
    type: String,
    required: true,
    unique: true
  },
  assetType: {
    type: String,
    enum: ['Medical Equipment', 'Computer & IT', 'Furniture', 'Vehicle', 'Building & Infrastructure', 'Office Supplies', 'Other'],
    required: true
  },
  assetName: {
    type: String,
    required: true
  },
  serialNumber: String,
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  purchaseCost: {
    type: Number,
    required: true
  },
  supplier: String,
  warrantyExpiry: Date,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: String,
  district: String,
  condition: {
    type: String,
    enum: ['New', 'Good', 'Fair', 'Poor', 'Damaged'],
    default: 'New'
  },
  maintenanceHistory: [{
    date: Date,
    type: String,
    cost: Number,
    performedBy: String,
    notes: String
  }],
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-generate Asset ID before saving
assetSchema.pre('save', async function(next) {
  if (!this.assetID) {
    const year = new Date().getFullYear();
    const lastAsset = await this.constructor.findOne({
      assetID: new RegExp(`^AST-${year}-`)
    }, {}, { sort: { 'assetID': -1 } });

    if (lastAsset && lastAsset.assetID) {
      const lastNumber = parseInt(lastAsset.assetID.split('-')[2]);
      const newNumber = (lastNumber + 1).toString().padStart(3, '0');
      this.assetID = `AST-${year}-${newNumber}`;
    } else {
      this.assetID = `AST-${year}-001`;
    }
  }
  next();
});

module.exports = mongoose.model('Asset', assetSchema);
