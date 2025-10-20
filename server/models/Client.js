const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  clientID: {
    type: String,
    unique: true,
    match: /^VH\d{5}$/  // Format: VH00001 to VH99999
  },
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
  contactNumber: {
    type: String,
    required: true
  },
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
  district: {
    type: String,
    required: true
  },
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

// Auto-generate Client ID before saving with retry logic for race conditions
clientSchema.pre('save', async function(next) {
  if (!this.clientID) {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        // Find the highest client ID and increment
        const lastClient = await this.constructor.findOne({}, {}, { sort: { 'clientID': -1 } });
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
