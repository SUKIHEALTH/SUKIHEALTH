const Consultant = require('../models/consultantModel'); // Import the Consultant model

const updateSlotStatus = async (req, res) => {
  const consultantId = req.params.consultantId; // Extract consultantId from the URL parameters
  const { time, status } = req.body; // Extract time and status from the request body

  console.log('Consultant ID:', consultantId);
  console.log('Time:', time);
  console.log('Status:', status);

  // Validate inputs
  if (!consultantId) {
    return res.status(400).json({ message: 'Consultant ID is required' });
  }
  if (!time || !status) {
    return res.status(400).json({ message: 'Time and status are required' });
  }

  try {
    // Find the consultant by userId (Number)
    const consultant = await Consultant.findOne({ userId: Number(consultantId) });
    if (!consultant) {
      return res.status(404).json({ message: 'Consultant not found' });
    }

    // Find the slot in the availableSlots array by matching the time
    const slot = consultant.availableSlots.find(
      (slot) => new Date(slot.time).getTime() === new Date(time).getTime()
    );

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found for the given time' });
    }

    // Update the slot's status
    slot.status = status;

    // Save the updated consultant document
    await consultant.save();

    // Send success response with the updated slot
    res.status(200).json({
      message: 'Slot status updated successfully',
      updatedSlot: slot,
    });
  } catch (error) {
    console.error('Error updating slot status:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { updateSlotStatus };
