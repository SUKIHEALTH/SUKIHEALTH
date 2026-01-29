const Appointment = require('../models/appointmentModel'); // Appointment model
const Consultant = require('../models/consultantModel'); // Consultant model

// Fetch consultant details based on patientId
const getPatientConsultantDetails = async (req, res) => {
  const { patientId } = req.params;

  try {
    // Find all appointments for the given patientId
    const appointments = await Appointment.find({ patientId }).select('consultantId');

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ error: 'No appointments found for the given patient.' });
    }

    // Extract unique consultantIds from the appointments
    const consultantIds = [...new Set(appointments.map(app => app.consultantId))];

    // Fetch consultant details for the consultantIds
    const consultants = await Consultant.find(
      { userId: { $in: consultantIds } },
      { userId: 1, 'information.displayName': 1, 'information.designation': 1, profileImage: 1, _id: 0 } // Select necessary fields
    );

    res.status(200).json({
      message: 'Consultant details fetched successfully.',
      consultants,
    });
  } catch (error) {
    console.error('Error fetching consultant details:', error);
    res.status(500).json({ error: 'Failed to fetch consultant details.' });
  }
};

module.exports = { getPatientConsultantDetails };
