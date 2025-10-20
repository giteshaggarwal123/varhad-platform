const mongoose = require('mongoose');

const artReferralSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  hivTestDate: {
    type: Date,
    required: true
  },
  confirmatoryTestDone: {
    type: Boolean,
    default: false
  },
  clientInformed: {
    type: Boolean,
    required: true
  },
  referredToART: {
    type: Boolean,
    required: true
  },
  artCenterName: {
    type: String,
    enum: ['District Hospital ART Center', 'Medical College ART Center', 'Community Health Center', 'Other']
  },
  artRegistrationNumber: String,
  referralDate: {
    type: Date,
    required: true
  },
  artDoctor: String,
  followUpAppointmentDate: Date,
  // Support Services
  postTestCounsellingProvided: {
    type: String,
    enum: ['Yes - Comprehensive', 'Yes - Basic', 'No']
  },
  psychosocialSupportNeeded: Boolean,
  partnerNotification: {
    type: String,
    enum: ['Client will inform', 'Assisted partner notification', 'Declined']
  },
  tbScreeningDone: {
    type: String,
    enum: ['Yes - Negative', 'Yes - Positive (Refer)', 'No']
  },
  cd4Count: String,
  viralLoad: String,
  additionalNotes: String,
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ARTReferral', artReferralSchema);
