const express = require('express');
const router = express.Router();
const LabResult = require('../models/labResultModel'); // Replace with your Mongoose model
const crypto = require("crypto");
const Setting = require('../models/settingModel');
const ENCRYPTION_KEY = process.env.LABRESULT_ENCRYPTION_KEY || "your-32-byte-key-1234567890123456"; // 32 bytes for aes-256
const IV_LENGTH = 16;

function decrypt(text) {
    if (typeof text !== "string") return text; // Only decrypt if it's a string
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
}
// Get shared lab results by patientId and doctorId
const getPatientReports = async (req, res) => {
    try {
        const { patientId, doctorId } = req.body;

        if (!patientId || !doctorId) {
            return res.status(400).json({ message: 'Patient ID and Doctor ID are required.' });
        }
        const settings = await Setting.findOne();
        const sharingPeriodDays = settings?.labReportSharingPeriod || 9; // Default to 7 days if not set
        const labResults = await LabResult.find({
            patientId: parseInt(patientId),
            shared: {
                $elemMatch: {
                    sharedId: parseInt(doctorId),
                    status: "Shared",
                },
            },
        });

        // Filter shared results based on sharedAt date
        const now = new Date();
        const filteredLabResults = labResults.filter(labResult => {
            // Find the matching shared entry for this doctor
            const sharedEntry = labResult.shared.find(
                s => s.sharedId === parseInt(doctorId) && s.status === "Shared"
            );
            if (!sharedEntry) return false;
            const sharedAt = new Date(sharedEntry.sharedAt);
            const diffDays = (now - sharedAt) / (1000 * 60 * 60 * 24);
            return diffDays <= sharingPeriodDays;
        });

        // Decrypt resultData for each lab result if needed
        const decryptedLabResults = filteredLabResults.map(labResult => ({
            ...labResult.toObject(),
            resultData: labResult.resultData ? decrypt(labResult.resultData) : null
        }));

        res.json({ message: "Fetched successfully", labResults: decryptedLabResults });
    } catch (error) {
        console.error('Error fetching shared lab results:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { getPatientReports };
