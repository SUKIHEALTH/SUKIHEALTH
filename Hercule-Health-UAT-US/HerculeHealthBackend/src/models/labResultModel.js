const mongoose = require('mongoose');

const labResultSchema = new mongoose.Schema({
  labResultId: { type: Number, unique: true, required: true },
  patientId: { type: Number, ref: 'Patient', required: true },
  reportName: { type: String },
  resultData: {
      type: mongoose.Schema.Types.Mixed, // Allow any dynamic structure (encrypted data)
  },
  
  // NEW FIELDS FOR PDF FILE SUPPORT
  fileUrl: { 
    type: String, 
    required: true // S3 URL where the PDF is stored
  },
  s3Key: { 
    type: String, 
    required: true // S3 key for file management (deletion, etc.)
  },
  fileType: { 
    type: String, 
    required: true, 
    default: 'application/pdf' // MIME type
  },
  fileSize: { 
    type: Number, 
    required: true // File size in bytes
  },
  originalFileName: { 
    type: String, 
    required: true // Original filename when uploaded
  },
  
  notificationStatus: { type: String, enum: ['notified', 'viewed'], required: true },
  shared: [
    {
      sharedId: { 
        type: Number, // Use ObjectId for better consistency
        ref: 'User' // Reference the User model
      },
      sharedAt: { 
        type: Date, 
        default: Date.now // Track when the lab result was shared
      },
      status: { type: String }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to generate the reportName
labResultSchema.pre('save', function (next) {
  // Use original filename if available, otherwise generate one
  if (!this.reportName && this.originalFileName) {
    this.reportName = this.originalFileName;
  } else if (!this.reportName) {
    this.reportName = `lab_report_${this.patientId}_${this.labResultId}.pdf`;
  }
  next();
});

// Static method to clean expired lab results and their S3 files
labResultSchema.statics.cleanExpiredLabResults = async function () {
  const Setting = require('./settingModel');  // Import here to avoid circular dependency
  const settings = await Setting.findOne(); // Fetch settings

  if (settings && settings.labResultRetentionPeriod) {
    const { value, valueType } = settings.labResultRetentionPeriod;
    const expirationDate = new Date();
    
    // Calculate expiration date based on valueType
    if (valueType === 'day') {
      expirationDate.setDate(expirationDate.getDate() - value);
    } else if (valueType === 'week') {
      expirationDate.setDate(expirationDate.getDate() - value * 7);
    } else if (valueType === 'month') {
      expirationDate.setMonth(expirationDate.getMonth() - value);
    }

    // Find expired lab results before updating
    const expiredResults = await this.find({
      'shared.sharedAt': { $lt: expirationDate }, 
      'shared.status': { $ne: 'expired' }
    });

    // TODO: Add S3 file deletion logic here
    // for (const result of expiredResults) {
    //   if (result.s3Key) {
    //     await deleteFromS3(result.s3Key);
    //   }
    // }

    // Update expired lab results
    await this.updateMany(
      { 'shared.sharedAt': { $lt: expirationDate }, 'shared.status': { $ne: 'expired' } },
      { $set: { 'shared.$[].status': 'expired' } }
    );

    console.log('Expired lab results updated');
  } else {
    console.log('No valid lab result retention settings found');
  }
};

// Instance method to get file info
labResultSchema.methods.getFileInfo = function() {
  return {
    fileName: this.reportName,
    fileUrl: this.fileUrl,
    fileSize: this.fileSize,
    fileType: this.fileType,
    originalFileName: this.originalFileName
  };
};

// Instance method to check if file exists
labResultSchema.methods.hasFile = function() {
  return !!(this.fileUrl && this.s3Key);
};

const LabResult = mongoose.model('LabResult', labResultSchema);
module.exports = LabResult;