const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  clientID: {
    type: String,
    unique: true,
    sparse: true,  // Allow null values for clients not yet in engagement stage
    match: /^VH\d{5}$/  // Format: VH00001 to VH99999
  },
  // Reach Stage Fields
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Transgender', 'Other'],
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  typology: {
    type: String,
    enum: ['MSM (Men who have Sex with Men)', 'Transgender', 'FSW (Female Sex Workers)', 'PWID (People Who Inject Drugs)', 'Others'],
    required: true
  },
  district: {
    type: String,
    required: true
  },
  reachStageNotes: String,  // Special notes for reach stage

  // Engagement Stage Fields (filled when client moves to engagement)
  contactNumber: String,  // Not required in reach stage, required in engagement
  alternatePhone: String,
  email: String,
  preferredContactMethod: {
    type: String,
    enum: ['WhatsApp', 'Phone Call', 'SMS', 'Email'],
    default: 'WhatsApp'
  },
  maritalStatus: {
    type: String,
    enum: ['Unmarried', 'Married', 'Divorced', 'Widowed']
  },
  engagementStageNotes: String,  // Special instructions/notes for engagement stage

  // Common Fields
  specialNeeds: String,
  hivStatus: {
    type: String,
    enum: ['Negative', 'Positive', 'Pending', 'Not Tested'],
    default: 'Not Tested'
  },
  prepStatus: {
    type: String,
    enum: ['Active', 'Inactive', 'Completed', 'Referred'],
    default: 'Inactive'
  },
  artRegistrationNumber: String,
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-generate Client ID when contactNumber is provided (engagement stage)
clientSchema.pre('save', async function(next) {
  // Only generate clientID if contactNumber is provided and clientID doesn't exist
  if (this.contactNumber && !this.clientID) {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        // Find the highest client ID and increment
        const lastClient = await this.constructor.findOne({ clientID: { $exists: true } }, {}, { sort: { 'clientID': -1 } });
        if (lastClient && lastClient.clientID) {
          const lastNumber = parseInt(lastClient.clientID.substring(2));
          const newNumber = (lastNumber + 1).toString().padStart(5, '0');
          this.clientID = 'VH' + newNumber;
        } else {
          this.clientID = 'VH00001';
        }
        break; // Success, exit retry loop
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          return next(error);
        }
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
  next();
});

module.exports = mongoose.model('Client', clientSchema);
