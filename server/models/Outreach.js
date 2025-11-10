const mongoose = require('mongoose');

const outreachSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  outreachDate: {
    type: Date,
    required: true
  },
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  district: {
    type: String,
    required: true
  },
  outreachType: {
    type: String,
    enum: ['Virtual Outreach', 'Physical Outreach'],
    required: true
  },
  contactInitiatedBy: {
    type: String,
    enum: ['Outreach Worker', 'Client Reached Out'],
    default: 'Outreach Worker'
  },
  referralMethod: {
    type: String,
    enum: ['One to One', 'Instagram', 'Grindr', 'Blued', 'Tinder', 'Facebook', 'WhatsApp', 'Website', 'Ad Leads', 'Others'],
    required: true
  },
  additionalDetails: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Outreach', outreachSchema);
