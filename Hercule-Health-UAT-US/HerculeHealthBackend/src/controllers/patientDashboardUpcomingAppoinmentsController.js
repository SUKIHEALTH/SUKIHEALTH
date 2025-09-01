const mongoose = require('mongoose');
const Payment = require('../models/paymentModel'); // Import the payment model

const getUpcomingAppointments = async (req, res) => {
  const { patientId } = req.params;

  try {
    // Validate patientId
    if (!patientId || isNaN(patientId)) {
      return res.status(400).json({ error: 'Invalid patientId' });
    }

    const now = new Date(); // Current date-time

    // Step 1: Find all paid appointment IDs for the patient
    const paidAppointments = await Payment.find({
      patientId: parseInt(patientId),
      status: "paid",
    }).select("appointmentId");

    // Extract paid appointment IDs
    const paidAppointmentIds = new Set(paidAppointments.map((p) => p.appointmentId));

    // Step 2: Fetch only paid upcoming appointments
    const appointments = await mongoose.connection.db
      .collection('appointments')
      .aggregate([
        {
          $match: {
            appointmentId: { $in: Array.from(paidAppointmentIds) }, // Filter only paid appointments
            appointmentDate: { $gte: now }, // Filter for upcoming appointments
            status: { $in: ["confirmed", "rescheduled"] },
          },
        },
        {
          $lookup: {
            from: 'consultants', // The consultants collection
            localField: 'consultantId', // Field in appointments
            foreignField: 'userId', // Field in consultants
            as: 'consultantDetails', // Field to store matched consultant info
          },
        },
        {
          $unwind: {
            path: '$consultantDetails',
            preserveNullAndEmptyArrays: true, // Include appointments even if no consultant is found
          },
        },
        {
          $project: {
            appointmentId: 1,
            patientId: 1,
            consultantId: 1,
            appointmentDate: 1,
            appointmentLink: 1,
            status: 1,
            'consultantDetails.information.displayName': 1,
            'consultantDetails.information.designation': 1,
            'consultantDetails.profileImage': 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        {
          $sort: { appointmentDate: 1 }, // Sort by appointmentDate ascending
        },
      ])
      .toArray();

    // Format the time slot in the backend
    const formattedAppointments = appointments.map((appointment) => {
      const date = new Date(appointment.appointmentDate);
      const timeSlot = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return { ...appointment, timeSlot }; // Add formatted timeSlot to each appointment
    });

    // Check if appointments were found
    if (!formattedAppointments || formattedAppointments.length === 0) {
      return res.status(404).json({ message: 'No upcoming paid appointments found' });
    }

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error.message);
    res.status(500).json({ error: 'Failed to fetch upcoming appointments.' });
  }
};

module.exports = { getUpcomingAppointments };