const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['PrEP Medication', 'HIV Test Kits', 'Condoms', 'Syringes', 'Lubricants', 'Gloves', 'Other Medical Supplies'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  batchNumber: String,
  expiryDate: Date,
  reorderLevel: {
    type: Number,
    default: 50
  },
  unitPrice: Number,
  supplier: String,
  lastRestockDate: Date,
  // Transaction history
  transactions: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['Received', 'Dispensed', 'Adjustment', 'Expired'],
      required: true
    },
    quantity: Number,
    balanceAfter: Number,
    clientID: String,
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    purpose: String,
    notes: String
  }]
}, {
  timestamps: true
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.quantity === 0) return 'Out of Stock';
  if (this.quantity <= this.reorderLevel) return 'Low Stock';
  return 'In Stock';
});

module.exports = mongoose.model('Inventory', inventorySchema);
