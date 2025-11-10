const mongoose = require('mongoose');

const prepSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    unique: true
  },
  willingToStart: {
    type: String,
    enum: ['Yes', 'No', 'Needs More Counselling'],
    required: true
  },
  consentSigned: {
    type: Boolean,
    default: false
  },
  artRegistrationNumber: String,
  prepInitiationDate: {
    type: Date,
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Medication Details
  medicineName: {
    type: String,
    enum: ['TDF/FTC (Truvada)', 'TAF/FTC (Descovy)'],
    required: true
  },
  dosage: {
    type: String,
    default: '1 tablet daily'
  },
  prescriptionDuration: {
    type: Number,  // in days
    enum: [30, 60, 90],
    default: 30
  },
  quantityDispensed: {
    type: Number,
    required: true
  },
  batchNumber: String,
  treatmentStartDate: Date,
  // Baseline Tests
  creatinineLevel: String,
  hepatitisBStatus: {
    type: String,
    enum: ['Negative', 'Positive', 'Not Tested']
  },
  nextFollowUpDate: {
    type: Date,
    required: true
  },
  adherenceCounsellingProvided: {
    type: Boolean,
    default: true
  },
  refillDueDate: Date,
  sideEffectsDiscussed: {
    type: Boolean,
    default: true
  },
  // Document Uploads for Initiation Stage
  documents: {
    testReport: String,  // File path for test report
    prescription: String,  // File path for prescription
    consentForm: String,  // File path for consent form
    paymentScreenshot: String  // File path for payment proof
  },
  // Doctor Consultation Dates
  doctorConsultations: [{
    consultationDate: {
      type: Date,
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String,
    prescriptionGiven: Boolean,
    nextConsultationDate: Date
  }],
  // Follow-up tracking
  followUps: [{
    date: Date,
    adherenceRate: Number,
    sideEffects: String,
    counsellor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Discontinued'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PrEP', prepSchema);
