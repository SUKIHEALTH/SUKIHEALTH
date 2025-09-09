const LabResult = require('../models/labResultModel'); // Import the model
const crypto = require("crypto");

const ENCRYPTION_KEY = process.env.LABRESULT_ENCRYPTION_KEY || "your-32-byte-key-1234567890123456";

// Decrypt function to handle encrypted resultData
function decrypt(text) {
  try {
    if (!text) return {};
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
  } catch (error) {
    console.error('Decryption failed:', error);
    return {};
  }
}

// Controller to fetch lab results based on patientId
const fetchLabResults = async (req, res) => {
  try {
    const { patientId } = req.params; // Get patientId from request params

    // Find lab results by patientId and include all necessary fields for PDF support
    const labResults = await LabResult.find({ patientId })
      .select('labResultId patientId reportName createdAt resultData fileUrl s3Key fileType fileSize originalFileName') // Include new PDF fields
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    // If no results are found
    if (!labResults || labResults.length === 0) {
      return res.status(404).json({ message: 'No lab results found for this patient.' });
    }

    // Process each result to include PDF support and maintain existing description logic
    const formattedResults = labResults.map(result => {
      // Decrypt resultData to get the description
      let description = '';
      try {
        const decryptedData = decrypt(result.resultData);
        if (decryptedData && typeof decryptedData === 'object') {
          description = Object.keys(decryptedData).join(', '); // Combine names into description
        }
      } catch (error) {
        console.error('Error processing resultData for lab result:', result.labResultId, error);
        description = 'Data processing error';
      }

      return {
        labResultId: result.labResultId,
        patientId: result.patientId,
        reportName: result.reportName || result.originalFileName || `lab_report_${result.labResultId}.pdf`,
        createdAt: result.createdAt,
        description: description, // Keep your existing description logic
        
        // New PDF-related fields
        fileUrl: result.fileUrl || null,
        s3Key: result.s3Key || null,
        fileType: result.fileType || 'application/pdf',
        fileSize: result.fileSize || 0,
        originalFileName: result.originalFileName || null,
        
        // Helper properties for frontend
        hasFile: !!(result.fileUrl && result.s3Key),
        fileSizeFormatted: result.fileSize ? formatFileSize(result.fileSize) : 'N/A'
      };
    });

    // Send the formatted results as the response
    res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Error fetching lab results:', error);
    res.status(500).json({ 
      message: 'Server error while fetching lab results.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to format file size
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Additional function to get a specific lab result with full decrypted data (for detail view)
const getLabResultDetails = async (req, res) => {
  try {
    const { labResultId } = req.params;

    const labResult = await LabResult.findOne({ labResultId }).lean();

    if (!labResult) {
      return res.status(404).json({ message: 'Lab result not found.' });
    }

    // Decrypt the full result data for detailed view
    const decryptedData = decrypt(labResult.resultData);

    const detailedResult = {
      labResultId: labResult.labResultId,
      patientId: labResult.patientId,
      reportName: labResult.reportName || labResult.originalFileName || `lab_report_${labResult.labResultId}.pdf`,
      createdAt: labResult.createdAt,
      updatedAt: labResult.updatedAt,
      
      // Full decrypted data for detailed display
      resultData: decryptedData,
      
      // PDF file information
      fileInfo: {
        fileUrl: labResult.fileUrl,
        s3Key: labResult.s3Key,
        fileType: labResult.fileType,
        fileSize: labResult.fileSize,
        fileSizeFormatted: formatFileSize(labResult.fileSize),
        originalFileName: labResult.originalFileName,
        hasFile: !!(labResult.fileUrl && labResult.s3Key)
      },
      
      // Sharing information
      shared: labResult.shared || [],
      notificationStatus: labResult.notificationStatus
    };

    res.status(200).json(detailedResult);
  } catch (error) {
    console.error('Error fetching lab result details:', error);
    res.status(500).json({ 
      message: 'Server error while fetching lab result details.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { 
  fetchLabResults,
  getLabResultDetails 
};