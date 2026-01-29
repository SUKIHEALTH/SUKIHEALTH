const Patient = require('../models/patientModel'); // Assuming this is the Patient model

// Cancel a lab result request and update the status in the patient's requests array
const cancelLabResultRequest = async (req, res) => {
  const { patientId, requestedId } = req.body;

  try {
    console.log("patientId", patientId)
    // Find the patient by patientId
    const patient = await Patient.findOne({ userId: patientId });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    // Find the requested entry in the requests array
    const requestedEntry = patient.requests.find(
      (req) => req._id.toString() === requestedId.toString()
    );

    if (requestedEntry) {
      // Update the requested status to 'Cancelled'
      requestedEntry.status = 'Cancelled';
    } else {
      return res.status(400).json({ error: 'Requested ID not found in patient requests.' });
    }

    // Save the updated patient record
    await patient.save();

    res.status(200).json({
      message: 'Lab result request cancelled successfully.',
    });
  } catch (error) {
    console.error('Error cancelling lab result request:', error);
    res.status(500).json({ error: 'Failed to cancel lab result request.' });
  }
};

module.exports = { cancelLabResultRequest };
