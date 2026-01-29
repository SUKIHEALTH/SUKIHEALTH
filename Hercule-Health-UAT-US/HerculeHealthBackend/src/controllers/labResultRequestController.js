const Patient = require('../models/patientModel'); // Assuming this is the Patient model
const Consultant = require('../models/consultantModel'); // Assuming this is the Consultant model
const Notification = require('../models/notificationModel'); // Assuming this is the Notification model

// Request a lab result and save the request to the Patient table
const requestLabResult = async (req, res) => {
  const { patientId, requestedId } = req.body;

  try {
    // Find the patient by patientId
    const patient = await Patient.findOne({ userId: patientId });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    // Find the consultant by requestedId
    const consultant = await Consultant.findOne({ userId: requestedId });

    if (!consultant) {
      return res.status(404).json({ error: 'Consultant not found.' });
    }

    const consultantDisplayName = consultant.information.displayName || 'Unknown Consultant';

    // Add the request to the patient's record
    patient.requests = patient.requests || []; // Ensure the field exists
    patient.requests.push({
      requestedId: requestedId,
      requestedAt: Date.now(),
      status: 'Requested',
    });

    // Save the updated patient record
    await patient.save();

    // Create notification for patient, consultant, and admin
    const notificationMessage = `New lab report request from ${consultantDisplayName}. Date: ${new Date().toLocaleDateString()}, Time: ${new Date().toLocaleTimeString()}.`;
    const userIds = [patientId]; // Assuming `1` is the admin ID

    const notification = new Notification({
      notificationId: Date.now(), // Unique notification ID
      userId: userIds,
      type: 'LabResultRequest',
      message: notificationMessage,
      isRead: userIds.map(() => false),
      relatedId: patientId, // Reference to the patient
    });

    await notification.save();

    res.status(200).json({
      message: 'Lab result request saved to patient successfully.',
    });
  } catch (error) {
    console.error('Error requesting lab result:', error);
    res.status(500).json({ error: 'Failed to request lab result.' });
  }
};

module.exports = { requestLabResult };
