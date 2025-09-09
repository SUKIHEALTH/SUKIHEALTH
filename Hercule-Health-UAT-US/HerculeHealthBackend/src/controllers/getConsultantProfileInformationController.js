const Consultant = require('../models/consultantModel');
const User = require('../models/userModel');

// Fetch patient profile and user information by userId
const getConsultantProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Get userId from params

    // Fetch patient details by userId
    const consultant = await Consultant.findOne({ userId : userId }).lean(); // Use `lean()` for performance optimization

    // If no patient found
    if (!consultant) {
      return res.status(404).json({ message: 'consultant not found.' });
    }

    // Fetch user details by userId
    const user = await User.findOne({ userId : userId }).select('role access_type is_loggedIn is_active').lean();

    // If no user found
    if (!user) {
      return res.status(404).json({ message: 'User associated with the consultant not found.' });
    }

    return res.status(200).json({
      message: 'consultant profile fetched successfully.',
      consultant,
      user,
    });
  } catch (error) {
    console.error('Error fetching consultant profile:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { getConsultantProfile };
