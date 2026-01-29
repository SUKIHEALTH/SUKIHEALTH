const mongoose = require('mongoose');
const LabResult = require('./labResultModel'); 

const settingsSchema = new mongoose.Schema({
  messageLimit: { type: Number, min: 0, default: 100 }, // Default max messages allowed
  chatHistoryExpirePeriod: {
    value: { type: Number }, // Numeric value
    valueType: { type: String }, // Unit of time (e.g., 'day', 'week', 'month')
  },
  appointmentFee: { type: Number, min: 0, default: 50 }, // Default fee
  serviceCharge: { type: Number, min: 0, default: 0 }, // Service charge amount
  taxPercentage: { type: Number, min: 0, max: 100, default: 0 }, // Tax percentage
  
  // New consultation fee fields
  standardConsultationFee: { type: Number, min: 0, default: 55 }, // Standard 30min consultation fee
  extendedConsultationFee: { type: Number, min: 0, default: 95 }, // Extended 60min consultation fee
  followupConsultationFee: { type: Number, min: 0, default: 45 }, // Follow-up 20min consultation fee
  
  appointmentReminderPeriod: { type: Number, min: 0, default: 24 }, // Reminder period in hours
  labReportSharingPeriod: { type: Number, min: 0, default: 7 }, // Lab report sharing period in days
  patientCancellationDeadline: { type: Number, min: 0, default: 24 }, // Patient cancellation deadline in hours
  doctorCancellationDeadline: { type: Number, min: 0, default: 12 }, // Doctor cancellation deadline in hours
  patientReschedulingDeadline: { type: Number, min: 0, default: 24 }, // Patient rescheduling deadline in hours
  labResultRetentionPeriod: {
    value: { type: Number, min: 0 }, // Numeric value
    valueType: { type: String}, // Unit of time
  },
  labReportFields: [
    {
      mainValue: { type: String}, // Main value
      subValue: [{ type: String }] // Sub values
    }
  ],
  maintenanceMode: { type: Boolean, default: false }, // Maintenance mode toggle
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Watch for changes to the settings document
settingsSchema.post('save', async function (doc) { 

  const Chat = require('./chatModel'); 
  // Manually check if the fields have been updated
  if (
    doc.chatHistoryExpirePeriod.value !== doc._previousValues?.chatHistoryExpirePeriod?.value ||
    doc.chatHistoryExpirePeriod.valueType !== doc._previousValues?.chatHistoryExpirePeriod?.valueType
  ) {
    console.log('chatHistoryExpirePeriod value or valueType updated. Triggering cleanup.');
    
    // Call cleanup function
    try {
      await Chat.cleanExpiredMessages();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  // Check if the labResultRetentionPeriod has been updated
  if (
    doc.labResultRetentionPeriod.value !== doc._previousValues?.labResultRetentionPeriod?.value ||
    doc.labResultRetentionPeriod.valueType !== doc._previousValues?.labResultRetentionPeriod?.valueType
  ) {
    console.log('labResultRetentionPeriod value or valueType updated. Triggering cleanup.');
    
    // Call cleanup function for LabResult
    try {
      await LabResult.cleanExpiredLabResults();
    } catch (error) {
      console.error('Error during lab result cleanup:', error);
    }
  }
});

// Ensure the `updatedAt` field is updated when any field is modified
settingsSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now(); // Update `updatedAt` field whenever the document is modified
  }
  next();
});

const Setting = mongoose.model('Setting', settingsSchema);
module.exports = Setting;