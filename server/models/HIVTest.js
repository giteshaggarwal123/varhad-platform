const mongoose = require('mongoose');

const hivTestSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  engagementDate: {
    type: Date,
    required: true
  },
  purposeOfEngagement: {
    type: String,
    enum: ['HIV Testing', 'STI Services', 'Counselling', 'PrEP Consultation', 'Doctor Consultation', 'Crisis Support', 'Others'],
    required: true
  },
  testDate: {
    type: Date,
    required: true
  },
  testResult: {
    type: String,
    enum: ['Negative', 'Positive', 'Pending'],
    required: true
  },
  testType: {
    type: String,
    enum: ['Rapid Test', 'ELISA', 'NAT', 'Western Blot'],
    default: 'Rapid Test'
  },
  testingLocation: String,
  previousHIVTesting: {
    type: Boolean,
    default: false
  },
  lastTestDate: Date,
  // Risk Assessment
  unprotectedSexualActivity: Boolean,
  numberOfPartners: Number,
  condomUsageFrequency: {
    type: String,
    enum: ['Always', 'Sometimes', 'Never']
  },
  alcoholDrugUse: {
    type: String,
    enum: ['No', 'Yes - Occasional', 'Yes - Frequent']
  },
  stiHistory: {
    type: String,
    enum: ['No', 'Yes - Current', 'Yes - Past']
  },
  partnerHIVStatus: {
    type: String,
    enum: ['Unknown', 'Negative', 'Positive']
  },
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HIVTest', hivTestSchema);
