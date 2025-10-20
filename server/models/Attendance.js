const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'On Leave', 'Half Day', 'Holiday'],
    required: true
  },
  checkInTime: String,
  checkOutTime: String,
  hoursWorked: Number,
  leaveType: {
    type: String,
    enum: ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Other']
  },
  leaveApproved: Boolean,
  notes: String
}, {
  timestamps: true
});

// Compound index to ensure one record per staff per day
attendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
