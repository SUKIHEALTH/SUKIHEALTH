const Patient = require('../models/patientModel');
const User = require('../models/userModel');

// Fetch patient profile and user information by userId
const getPatientProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Get userId from params

    // Fetch patient details by userId
    const patient = await Patient.findOne({ userId : userId }).lean(); // Use `lean()` for performance optimization

    // If no patient found
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Fetch user details by userId
    const user = await User.findOne({ userId : userId }).select('role access_type is_loggedIn is_active').lean();

    // If no user found
    if (!user) {
      return res.status(404).json({ message: 'User associated with the patient not found.' });
    }

    return res.status(200).json({
      message: 'Patient profile fetched successfully.',
      patient,
      user,
    });
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { getPatientProfile };
