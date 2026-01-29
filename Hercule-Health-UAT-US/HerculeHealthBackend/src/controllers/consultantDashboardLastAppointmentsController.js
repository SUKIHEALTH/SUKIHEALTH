const Appointment = require('../models/appointmentModel');

// Helper function to format the appointment time slot in 12-hour AM/PM format
const formatTimeSlot = (date) => {
  const appointmentDate = new Date(date);
  let hours = appointmentDate.getHours();
  const minutes = appointmentDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutesFormatted} ${ampm}`;
};

const getLastAppointments = async (req, res) => {
  const { consultantId } = req.params;
  const { timePeriod } = req.body;

  try {
    const now = new Date();
    let startDate;

    // Determine the start date based on the time period
    if (timePeriod === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (timePeriod === '7 days') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (timePeriod === 'this month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    }

    const pastAppointments = await Appointment.aggregate([
      {
        $match: {
          consultantId: parseInt(consultantId),
          appointmentDate: {
            $lt: now,
            $gte: startDate,
          },
          status: { $in: ["confirmed", "rescheduled"] },
        },
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
        $sort: {
          appointmentDate: -1,
        },
      },
      {
        $limit: 7,
      },
      {
        $lookup: {
          from: 'patients',
          localField: 'patientId',
          foreignField: 'userId',
          as: 'patientDetails',
        },
      },
      {
        $unwind: {
          path: '$patientDetails',
          preserveNullAndEmptyArrays: true,
        },
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
          'patientDetails.information.firstName': 1,
          'patientDetails.information.lastName': 1,
          'patientDetails.profileImage': 1,
        },
      },
    ]);

    // Format the timeSlot for each appointment
    const formattedAppointments = pastAppointments.map((appointment) => ({
      ...appointment,
      timeSlot: formatTimeSlot(appointment.appointmentDate),
    }));

    if (!formattedAppointments || formattedAppointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this consultant.' });
    }

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching past appointments:', error);
    res.status(500).json({ error: 'Failed to fetch past appointments.' });
  }
};

module.exports = { getLastAppointments };
