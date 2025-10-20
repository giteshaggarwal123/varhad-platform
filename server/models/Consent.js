const mongoose = require('mongoose');

const consentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  consentType: {
    type: String,
    enum: ['PrEP Initiation Consent', 'Counselling & Disclosure Consent', 'HIV Testing Consent', 'Data Privacy Consent'],
    required: true
  },
  signingMethod: {
    type: String,
    enum: ['Digital Signature via Email', 'Mobile OTP Verification', 'WhatsApp Digital Consent', 'Physical Signature'],
    required: true
  },
  sentDate: {
    type: Date,
    default: Date.now
  },
  signedDate: Date,
  status: {
    type: String,
    enum: ['Pending', 'Signed', 'Declined', 'Expired'],
    default: 'Pending'
  },
  documentPath: String,
  ipAddress: String,
  deviceInfo: String,
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Consent', consentSchema);
