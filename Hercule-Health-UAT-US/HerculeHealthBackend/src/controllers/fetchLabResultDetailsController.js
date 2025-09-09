const LabResult = require('../models/labResultModel'); // Import the model
const crypto = require("crypto");
const ENCRYPTION_KEY = process.env.LABRESULT_ENCRYPTION_KEY || "your-32-byte-key-1234567890123456"; // 32 bytes for aes-256
const IV_LENGTH = 16;
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
}
// Controller to fetch all data based on labResultId
const fetchLabResultById = async (req, res) => {
  try {
    const { labResultId } = req.params;

    // Find the lab result by labResultId
    const labResult = await LabResult.findOne({ labResultId }).lean();

    if (!labResult) {
      return res.status(404).json({ message: 'Lab result not found for the provided labResultId.' });
    }

    // Decrypt resultData before sending
    let decryptedResultData = null;
    try {
      decryptedResultData = decrypt(labResult.resultData);
    } catch (e) {
      return res.status(500).json({ message: 'Failed to decrypt lab result data.' });
    }

    // Send the decrypted result
    res.status(200).json({
      ...labResult,
      resultData: decryptedResultData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching lab result.' });
  }
};

module.exports = { fetchLabResultById };