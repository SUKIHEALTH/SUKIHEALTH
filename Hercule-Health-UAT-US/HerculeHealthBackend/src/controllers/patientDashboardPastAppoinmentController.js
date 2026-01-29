const mongoose = require('mongoose');
 
const getRecentPastAppointment = async (req, res) => {
  const { patientId } = req.params;

  try {
    const now = new Date();

    // Fetch the most recent past appointment
    const recentAppointments = await mongoose.connection.db.collection('appointments').aggregate([
      {
        $match: {
          patientId: parseInt(patientId), // Match patientId
          appointmentDate: { $lt: now }, // Only past appointments
          status: { $in: ["confirmed", "rescheduled"] },
        }
      },
      {
        $lookup: {
          from: 'payments',
          localField: 'appointmentId',
          foreignField: 'appointmentId',
          as: 'paymentDetails',
        },
      },
      {
        $unwind: {
          path: '$paymentDetails',
          preserveNullAndEmptyArrays: false,  // only keep if a payment exists
        },
      },
      {
        $match: {
          'paymentDetails.status': 'paid',   // ✅ only where payment is paid
        },
      },
      {
        $lookup: {
          from: 'consultants', // Join consultants collection
          localField: 'consultantId', // Match consultantId in appointments
          foreignField: 'userId', // Match consultantId in consultants
          as: 'consultantDetails' // Consultant info will be here
        }
      },
      {
        $unwind: {
          path: '$consultantDetails',
          preserveNullAndEmptyArrays: false // Only include if consultant data is available
        }
      },
      {
        $project: {
          appointmentId: 1,
          patientId: 1,
          consultantId: 1,
          appointmentDate: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          // Include consultant details
          'consultantDetails.information.displayName': 1,
          'consultantDetails.information.designation': 1,
          'consultantDetails.profileImage': 1
        }
      },
      {
        $sort: { appointmentDate: -1 } // Sort appointments by date descending
      },
      { $limit: 1 } // Limit to the most recent past appointment
    ]).toArray();

    if (recentAppointments.length === 0) {
      return res.status(404).json({ message: 'No past appointments found for this patient.' });
    }

    // Format the timeSlot in the backend
    const recentAppointment = recentAppointments[0];
    const appointmentDate = new Date(recentAppointment.appointmentDate);
    const timeSlot = appointmentDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Add the formatted timeSlot to the response
    recentAppointment.timeSlot = timeSlot;

    res.status(200).json(recentAppointment);
  } catch (error) {
    console.error('Error fetching recent past appointment:', error);
    res.status(500).json({ error: 'Failed to fetch recent past appointment.' });
  }
};

module.exports = { getRecentPastAppointment };
