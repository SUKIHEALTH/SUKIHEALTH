const mongoose = require('mongoose');
const Appointment = require('../models/appointmentModel');
const Patient = require('../models/patientModel'); // Assuming the patients collection is in patientModel.js
 
const getRecentPatients = async (req, res) => {
  const { consultantId } = req.params;

  try {
    const recentPatients = await Appointment.aggregate([
      {
        $match: {
          consultantId: parseInt(consultantId),
          appointmentDate: { $lt: new Date() },
          status: { $in: ['confirmed', 'rescheduled'] },
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
        $match: {
          paymentDetails: {
            $elemMatch: {
              status: { $regex: '^paid$', $options: 'i' },
            },
          },
        },
      },
      {
        $sort: {
          appointmentDate: -1,
        },
      },
      {
        $group: {
          _id: '$patientId',
          latestAppointment: {
            $first: {
              appointmentId: '$_id',
              appointmentDate: '$appointmentDate',
            },
          },
        },
      },
      {
        $sort: {
          'latestAppointment.appointmentDate': -1,
        },
      },
      {
        $limit: 2,
      },
      {
        $lookup: {
          from: 'patients',
          localField: '_id',
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
        $addFields: {
          patientName: {
            $concat: [
              { $ifNull: ['$patientDetails.information.firstName', ''] },
              ' ',
              { $ifNull: ['$patientDetails.information.lastName', ''] },
            ],
          },
        },
      },
      {
        $project: {
          patientId: '$_id',
          patientName: 1,
          patientImage: '$patientDetails.profileImage',
          latestAppointment: 1,
          _id: 0,
        },
      },
    ]);

    if (!recentPatients || recentPatients.length === 0) {
      return res.status(404).json({ message: 'No recent paid patients found for this consultant.' });
    }

    const formattedPatients = recentPatients.map(patient => ({
      patientId: patient.patientId,
      patientName: patient.patientName,
      patientImage: patient.patientImage,
      latestAppointment: {
        appointmentId: patient.latestAppointment.appointmentId,
        appointmentDate: patient.latestAppointment.appointmentDate,
        timeSlot: formatTimeSlot(patient.latestAppointment.appointmentDate),
      },
    }));

    res.status(200).json(formattedPatients);

  } catch (error) {
    console.error('Error fetching recent patients:', error);
    res.status(500).json({ error: 'Failed to fetch recent patients.' });
  }
};

 
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
 
module.exports = { getRecentPatients };
