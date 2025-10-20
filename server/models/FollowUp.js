const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['Adherence Check', 'PrEP Refill', 'HIV Re-test', 'Side Effect Review', 'Doctor Consultation', 'General Follow-up'],
    required: true
  },
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adherenceRate: {
    type: Number,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'Completed', 'Overdue', 'Cancelled'],
    default: 'Pending'
  },
  whatsappReminderSent: {
    type: Boolean,
    default: false
  },
  whatsappReminderCount: {
    type: Number,
    default: 0
  },
  completionDate: Date,
  notes: String,
  outcome: String
}, {
  timestamps: true
});

// Check if follow-up is overdue
followUpSchema.virtual('isOverdue').get(function() {
  return this.status !== 'Completed' && this.dueDate < new Date();
});

module.exports = mongoose.model('FollowUp', followUpSchema);
