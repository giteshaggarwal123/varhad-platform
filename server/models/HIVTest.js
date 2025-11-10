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
    enum: ['HIV Testing', 'STI Services', 'Counselling', 'PrEP Consultation', 'PEP', 'Doctor Consultation', 'Crisis Support', 'Others'],
    required: true
  },
  engagementStageNotes: String,  // Special instructions/notes for engagement stage

  // HIV Testing Details
  testingID: String,  // Testing ID from lab
  testDate: {
    type: Date,
    required: true
  },
  testResult: {
    type: String,
    enum: ['Negative', 'Positive', 'Pending'],
    required: true
  },
  hivTestType: {
    type: String,
    enum: ['Screening Test', 'Confirmatory Test'],
    required: true
  },
  testType: {
    type: String,
    enum: ['Rapid Test', 'ELISA', 'NAT', 'Western Blot'],
    default: 'Rapid Test'
  },
  testingLab: {
    type: String,
    enum: ['Redcliffe', 'Thyrocare', 'Govt. ICTC Testing Centre', 'Others'],
    required: true
  },
  testingLabOther: String,  // If 'Others' is selected
  testResultDetails: String,  // Complete testing result details
  previousHIVTesting: {
    type: Boolean,
    default: false
  },
  lastTestDate: Date,
  // Enhanced Risk Assessment
  riskAssessment: {
    unprotectedSexualActivity: Boolean,
    numberOfPartners: Number,
    condomUsageFrequency: {
      type: String,
      enum: ['Always', 'Sometimes', 'Rarely', 'Never']
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
    injectionDrugUse: Boolean,
    shareNeedles: Boolean,
    commercialSexWork: Boolean,
    multipleConcurrentPartners: Boolean,
    recentSTISymptoms: Boolean,
    hivPositivePartner: Boolean,
    riskScore: {
      type: String,
      enum: ['Low', 'Medium', 'High']
    },
    assessmentNotes: String
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
