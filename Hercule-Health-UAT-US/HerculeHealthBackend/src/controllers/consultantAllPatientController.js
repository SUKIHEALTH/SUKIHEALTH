// const Appointment = require('../models/appointmentModel');
// const Patient = require('../models/patientModel');

// // Helper function to format the appointment time slot in 12-hour AM/PM format
// const formatTimeSlot = (date) => {
//   const appointmentDate = new Date(date);
//   let hours = appointmentDate.getHours();
//   const minutes = appointmentDate.getMinutes();
//   const ampm = hours >= 12 ? 'PM' : 'AM';

//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;

//   return `${hours}:${minutesFormatted} ${ampm}`;
// };

// const consultantAllPatients = async (req, res) => {
//   const { consultantId } = req.params;
//   let { page = 1, limit = 10 } = req.query; // Default pagination to 10 results per page

//   // Ensure 'page' and 'limit' are valid numbers
//   page = parseInt(page, 10);
//   limit = parseInt(limit, 10);

//   // If 'page' or 'limit' are NaN, set them to default values
//   if (isNaN(page) || page < 1) page = 1;
//   if (isNaN(limit) || limit < 1) limit = 10;

//   try {
//     // Ensure consultantId is a valid number
//     const consultantIdParsed = parseInt(consultantId);
//     if (isNaN(consultantIdParsed)) {
//       return res.status(400).json({ error: 'Invalid consultant ID' });
//     }

//     // Fetch patients for the consultant with pagination
//     const allPatients = await Appointment.aggregate([
//       {
//         $match: {
//           consultantId: consultantIdParsed,
//         },
//       },
//       {
//         $sort: {
//           appointmentDate: -1, // Sort appointments by date, most recent first
//         },
//       },
//       {
//         $skip: (page - 1) * limit, // Skipping for pagination
//       },
//       {
//         $limit: limit, // Limit the results
//       },
//       {
//         $lookup: {
//           from: 'payments',
//           localField: 'appointmentId',
//           foreignField: 'appointmentId',
//           as: 'paymentDetails',
//         },
//       },
//       {
//         $match: {
//           paymentDetails: {
//             $elemMatch: {
//               status: { $regex: '^paid$', $options: 'i' },
//             },
//           },
//         },
//       },
//       {
//         $group: {
//           _id: '$patientId', // Group by patientId to ensure unique patients
//           latestAppointment: { $first: '$appointmentDate' },
//           appointmentId: { $first: '$appointmentId' },
//         },
//       },
//       {
//         $lookup: {
//           from: 'patients', // Join with the patients collection
//           localField: '_id', // Match _id from the grouping stage (patientId)
//           foreignField: 'userId', // Match userId in patients collection
//           as: 'patientDetails',
//         },
//       },
//       {
//         $unwind: {
//           path: '$patientDetails',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $addFields: {
//           patientName: {
//             $concat: [
//               { $ifNull: ['$patientDetails.information.firstName', ''] },
//               ' ',
//               { $ifNull: ['$patientDetails.information.lastName', ''] },
//             ],
//           },
//         },
//       },
//       {
//         $project: {
//           patientId: '$_id',
//           patientName: 1,
//           patientAge: '$patientDetails.information.age',
//           patientDOB: '$patientDetails.information.dateOfBirth',
//           patientGender: '$patientDetails.information.gender',
//           patientAddress: '$patientDetails.address.country',
//           patientBloodGroup: '$patientDetails.healthData.bloodGroup',
//           patientImage: '$patientDetails.profileImage',
//           latestAppointment: 1,
//           appointmentId: 1,
//           _id: 0,
//         },
//       },
//     ]);

//     if (!allPatients || allPatients.length === 0) {
//       return res.status(404).json({ message: 'No patients found for this consultant.' });
//     }

//     // Format appointments into the response
//     const formattedPatients = allPatients.map((patient) => {
//       return {
//         patientId: patient.patientId,
//         patientName: patient.patientName,
//         patientImage: patient.patientImage,
//         patientAge: patient.patientAge,
//         patientDOB:patient.patientDOB,
//         patientAddress: patient.patientAddress,
//         patientGender: patient.patientGender,
//         patientBloodGroup: patient.patientBloodGroup,
//         latestAppointment: {
//           appointmentId: patient.appointmentId,
//           appointmentDate: patient.latestAppointment,
//           timeSlot: formatTimeSlot(patient.latestAppointment),
//         },
//       };
//     });

//     res.status(200).json(formattedPatients);
//   } catch (error) {
//     console.error('Error fetching all patients:', error);
//     res.status(500).json({ error: 'Failed to fetch all patients.' });
//   }
// };

// module.exports = { consultantAllPatients };



const Appointment = require('../models/appointmentModel');
const Patient = require('../models/patientModel');

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

const consultantAllPatients = async (req, res) => {
  const { consultantId } = req.params;
  let { page = 1, limit = 10 } = req.query;

  // Ensure 'page' and 'limit' are valid numbers
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  // If 'page' or 'limit' are NaN, set them to default values
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  try {
    // Ensure consultantId is a valid number
    const consultantIdParsed = parseInt(consultantId);
    if (isNaN(consultantIdParsed)) {
      return res.status(400).json({ error: 'Invalid consultant ID' });
    }

    // Fetch patients for the consultant with pagination
    const allPatients = await Appointment.aggregate([
      {
        $match: {
          consultantId: consultantIdParsed,
          $expr: {
            $in: [
              { $toLower: "$status" },
              ["rescheduled", "confirmed"]
            ]
          }
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
          $expr: {
            $anyElementTrue: {
              $map: {
                input: "$paymentDetails",
                as: "payment",
                in: { $eq: ["$$payment.status", "paid"] }
              }
            }
          }
        },
      },
      {
        $sort: {
          appointmentDate: -1, // Sort appointments by date, most recent first
        },
      },
      {
        $group: {
          _id: '$patientId', // Group by patientId to ensure unique patients
          latestAppointment: { $first: '$appointmentDate' },
          appointmentId: { $first: '$appointmentId' },
        },
      },
      {
        $skip: (page - 1) * limit, // Skipping for pagination
      },
      {
        $limit: limit, // Limit the results
      },
      {
        $lookup: {
          from: 'patients', // Join with the patients collection
          localField: '_id', // Match _id from the grouping stage (patientId)
          foreignField: 'userId', // Match userId in patients collection
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
          patientAge: '$patientDetails.information.age',
          patientDOB: '$patientDetails.information.dateOfBirth',
          patientGender: '$patientDetails.information.gender',
          patientAddress: '$patientDetails.address.country',
          patientBloodGroup: '$patientDetails.healthData.bloodGroup',
          patientImage: '$patientDetails.profileImage',
          latestAppointment: 1,
          appointmentId: 1,
          _id: 0,
        },
      },
    ]);

    if (!allPatients || allPatients.length === 0) {
      return res.status(404).json({ message: 'No patients found for this consultant.' });
    }

    // Format appointments into the response
    const formattedPatients = allPatients.map((patient) => {
      return {
        patientId: patient.patientId,
        patientName: patient.patientName,
        patientImage: patient.patientImage,
        patientAge: patient.patientAge,
        patientDOB: patient.patientDOB,
        patientAddress: patient.patientAddress,
        patientGender: patient.patientGender,
        patientBloodGroup: patient.patientBloodGroup,
        latestAppointment: {
          appointmentId: patient.appointmentId,
          appointmentDate: patient.latestAppointment,
          timeSlot: formatTimeSlot(patient.latestAppointment),
        },
      };
    });

    res.status(200).json(formattedPatients);
  } catch (error) {
    console.error('Error fetching all patients:', error);
    res.status(500).json({ error: 'Failed to fetch all patients.' });
  }
};

module.exports = { consultantAllPatients };