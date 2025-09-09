const mongoose = require('mongoose');
const { DateTime } = require('luxon'); // Install with `npm install luxon`
// const { createGoogleMeet } = require('../config/googleMeet'); 
// const { createTeamsMeet } = require('../config/teamsMeet'); 
// const Notification = require('../models/notificationModel');
//const Appointment = require('../models/appointmentModel');

 
// Controller to create an appointment
// Controller to create an appointment without appointmentLink or notifications
const createAppointment = async (req, res) => {
  const { patientId, consultantId, date, time, status, timeZone } = req.body;

  try {
    if (!patientId || !consultantId || !date || !time || !status || !timeZone) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const isValidTimeZone = (zone) => {
      try {
        return !!DateTime.now().setZone(zone).isValid;
      } catch {
        return false;
      }
    };
    if (!isValidTimeZone(timeZone)) {
      return res.status(400).json({ message: 'Invalid timeZone format.' });
    }

    const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
    const match = time.match(timeRegex);
    if (!match) {
      return res.status(400).json({ message: 'Invalid time format. Use hh:mm AM/PM.' });
    }

    const [_, hours, minutes, period] = match;
    let parsedHours = parseInt(hours, 10);
    if (period.toUpperCase() === 'PM' && parsedHours !== 12) parsedHours += 12;
    else if (period.toUpperCase() === 'AM' && parsedHours === 12) parsedHours = 0;

    const dateTime = DateTime.fromISO(date, { zone: timeZone })
      .set({ hour: parsedHours, minute: parseInt(minutes, 10), second: 0, millisecond: 0 })
      .toJSDate();

    if (dateTime < new Date()) {
      return res.status(400).json({ message: 'Appointment date and time must be in the future.' });
    }

    const latestAppointment = await mongoose.connection.db
      .collection('appointments')
      .find()
      .sort({ appointmentId: -1 })
      .limit(1)
      .toArray();

    const nextAppointmentId = latestAppointment.length > 0
      ? latestAppointment[0].appointmentId + 1
      : 1;

    const newAppointment = {
      appointmentId: nextAppointmentId,
      patientId: parseInt(patientId),
      consultantId: parseInt(consultantId),
      appointmentDate: dateTime,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await mongoose.connection.db
      .collection('appointments')
      .insertOne(newAppointment);

    if (!result.acknowledged) throw new Error('Failed to create appointment.');

    const createdAppointment = await mongoose.connection.db
      .collection('appointments')
      .findOne({ _id: result.insertedId });

    res.status(201).json({
      message: 'Appointment created successfully.',
      data: createdAppointment,
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment.' });
  }
};

// const createAppointment = async (req, res) => {
//   const { patientId, consultantId, date, time, status, patientEmail, consultantEmail, timeZone, appointmentType } = req.body;
//   try {
//     if (!patientId || !consultantId || !date || !time || !status || !patientEmail || !consultantEmail || !timeZone) {
//       return res.status(400).json({ message: 'Missing required fields.' });
//     }
//     const isValidTimeZone = (zone) => {
//       try {
//         return !!DateTime.now().setZone(zone).isValid;
//       } catch {
//         return false;
//       }
//     };

//     if (!isValidTimeZone(timeZone)) {
//       return res.status(400).json({ message: 'Invalid timeZone format.' });
//     }

//     const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
//     const match = time.match(timeRegex);

//     if (!match) {
//       return res.status(400).json({ message: 'Invalid time format. Use hh:mm AM/PM.' });
//     }

//     const [_, hours, minutes, period] = match;
//     let parsedHours = parseInt(hours, 10);
//     if (period.toUpperCase() === 'PM' && parsedHours !== 12) {
//       parsedHours += 12;
//     } else if (period.toUpperCase() === 'AM' && parsedHours === 12) {
//       parsedHours = 0;
//     }

//     const dateTime = DateTime.fromISO(date, { zone: timeZone })
//       .set({ hour: parsedHours, minute: parseInt(minutes, 10), second: 0, millisecond: 0 })
//       .toJSDate(); // Convert to native JavaScript Date object

//     if (dateTime < new Date()) {
//       return res.status(400).json({ message: 'Appointment date and time must be in the future.' });
//     }

//       // Check for existing appointments with "paid" status
//       const existingAppointment = await Appointment.aggregate([
//         {
//           $match: {
//             consultantId: parseInt(consultantId),
//             appointmentDate: dateTime,
//           },
//         },
//         {
//           $lookup: {
//             from: 'payments',
//             localField: 'appointmentId',
//             foreignField: 'appointmentId',
//             as: 'paymentDetails',
//           },
//         },
//         {
//           $match: {
//             'paymentDetails.status': 'paid',
//             // Case-insensitive check for status not being 'cancelled'
//             $expr: {
//               $ne: [
//                 { $toLower: "$status" },
//                 "cancelled"
//               ]
//             }
//           },
//         },
//       ]);

//       if (existingAppointment.length > 0) {
//         return res.status(400).json({
//           message: 'This time slot is already booked for this consultant with a paid appointment. Please select a different time.',
//         });
//       }

//     const latestAppointment = await mongoose.connection.db
//       .collection('appointments')
//       .find()
//       .sort({ appointmentId: -1 })
//       .limit(1)
//       .toArray();

//     const nextAppointmentId = latestAppointment.length > 0
//       ? latestAppointment[0].appointmentId + 1
//       : 1;
//     let appointmentLink;
//     if(appointmentType === 'googleMeet'){
//         appointmentLink = await createGoogleMeet(patientEmail, consultantEmail, date, time, timeZone);
//     } else if(appointmentType === 'teamsMeet'){
//       appointmentLink = await createTeamsMeet(patientEmail, consultantEmail, date, time, timeZone);
//     }
// console.log('this is the',appointmentType);

//     const newAppointment = {
//       appointmentId: nextAppointmentId,
//       patientId: parseInt(patientId),
//       consultantId: parseInt(consultantId),
//       appointmentDate: dateTime, // Save as Date object
//       status,
//       appointmentLink,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await mongoose.connection.db
//       .collection('appointments')
//       .insertOne(newAppointment);

//     if (!result.acknowledged) {
//       throw new Error('Failed to create appointment.');
//     }

//     const createdAppointment = await mongoose.connection.db
//       .collection('appointments')
//       .findOne({ _id: result.insertedId });

//     const timeSlot = DateTime.fromJSDate(createdAppointment.appointmentDate).setZone(timeZone).toFormat('h:mm a');

//     // Create notification for patient, consultant, and admin
//     const notificationMessage = `New appointment created. ID: ${createdAppointment.appointmentId}, Date: ${date}, Time: ${timeSlot}.`;
//     const userIds = [patientId, consultantId, 1]; // Assuming `1` is the admin ID

//     const notification = new Notification({
//       notificationId: Date.now(), // Unique notification ID
//       userId: userIds,
//       type: 'Appointment',
//       message: notificationMessage,
//       isRead: userIds.map(() => false),
//       relatedId: createdAppointment._id,
//     });

//     await notification.save();

//     res.status(201).json({
//       message: 'Appointment created successfully.',
//       data: {
//         ...createdAppointment,
//         timeSlot,
//       },
//     });
//   } catch (error) {
//     console.error('Error creating appointment:', error);
//     res.status(500).json({ error: 'Failed to create appointment.' });
//   }
// };

module.exports = { createAppointment };
