const Consultant = require('../models/consultantModel');

// Update ConsultantApprovalRequired for a consultant
const updateApprovalStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { ConsultantApprovalRequired } = req.body;
    // Validate required fields
    if (userId === undefined || ConsultantApprovalRequired === undefined) {
      return res.status(400).json({ message: 'userId and ConsultantApprovalRequired are required' });
    }

    // Find the consultant by userId
    const consultant = await Consultant.findOne({ userId: userId  });
    if (!consultant) {
      return res.status(404).json({ message: 'Consultant not found' });
    }

    // Update the ConsultantApprovalRequired field
    consultant.ConsultantApprovalRequired = ConsultantApprovalRequired;
    consultant.updatedAt = new Date(); // Update the timestamp
    await consultant.save();

    return res.status(200).json({ message: 'Consultant approval status updated successfully', consultant });
  } catch (error) {
    console.error('Error updating ConsultantApprovalRequired:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { updateApprovalStatus };
