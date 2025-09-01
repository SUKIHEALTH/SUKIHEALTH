const LabResult = require('../models/labResultModel');
const Patient = require('../models/patientModel'); // Assuming this is the Patient model
const Notification = require('../models/notificationModel'); // Assuming this is the Notification model

// Share a lab result and save the sharedId, update requested status to approved if applicable
const shareLabResult = async (req, res) => {
  const { labResultId, sharedId, patientId } = req.body;

  try {
    // Find the lab result by labResultId
    const labResult = await LabResult.findOne({ labResultId });

    if (!labResult) {
      return res.status(404).json({ error: 'Lab result not found.' });
    }

    // Find the patient by patientId
    const patient = await Patient.findOne({ userId: patientId });

    if (patient) {
      // Check if the patient has requests and update the status if a matching request is found
      const requestedEntry = patient.requests?.find(
        (req) =>
          req.requestedId.toString() === sharedId.toString() && req.status === 'Requested'
      );

      if (requestedEntry) {
        requestedEntry.status = 'Approved'; // Update the requested status to 'Approved'
        await patient.save(); // Save the updated patient record
      }
    }

    // Add sharedId to the shared array
    labResult.shared.push({
      sharedId,
      sharedAt: Date.now(),
      status: 'Shared', // Set status to 'Shared' for the shared entry
    });

    // Save the updated lab result
    labResult.updatedAt = Date.now();
    await labResult.save();

    // Create a notification for the sharedId user
    const notificationMessage = patient
      ? `A new lab result has been shared with you by Patient ${patient.information.firstName} ${patient.information.lastName}.`
      : 'A new lab result has been shared with you.';

    const notification = new Notification({
      notificationId: Date.now(), // Unique notification ID
      userId: [sharedId], // Notification for the sharedId user
      type: 'LabResultRequest',
      message: notificationMessage,
      isRead: [false], // Mark as unread
      relatedId: labResultId, // Reference to the lab result
    });

    await notification.save();

    res.status(200).json({
      message: 'Lab result shared successfully. Notification created.',
      labResult,
    });
  } catch (error) {
    console.error('Error sharing lab result:', error);
    res.status(500).json({ error: 'Failed to share lab result.' });
  }
};

module.exports = { shareLabResult };
