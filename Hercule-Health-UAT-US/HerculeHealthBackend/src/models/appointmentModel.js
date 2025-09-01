// models/appointmentModel.js
// const mongoose = require('../db/mongoose');
// const mongoose = require('mongoose');
// const appointmentSchema = new mongoose.Schema({
//   appointmentId: { type: Number, unique: true, required: true},
//   patientId: { type: Number, ref: 'Patient', required: true },
//   consultantId: { type: Number, ref: 'Consultant', required: true },
//   appointmentDate: { type: Date, required: true },
//   timeSlot: {
//     startTime: { type: String, required: true }, // Format: "HH:MM AM/PM"
//     endTime: { type: String, required: true },   // Format: "HH:MM AM/PM"
//   },
//   status: { 
//     type: String, 
//     enum: ['Scheduled', 'Completed', 'Cancelled'], 
//     required: true 
//   },
//   appointmentLink: { type: String, required: true }, 
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// const Appointment = mongoose.model('Appointment', appointmentSchema);
// module.exports = Appointment;

const mongoose = require('mongoose');
const Notification = require('./notificationModel'); // Assuming Notification model exists
const Patient = require('./patientModel'); // Assuming Patient model exists
const Consultant = require('./consultantModel'); // Assuming Consultant model exists
const Settings = require('./settingModel'); // Assuming Settings model exists
const { sendEmail } = require('../config/emailService'); // Email service function
const nodeSchedule = require('node-schedule'); // For scheduling reminders

const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: Number, unique: true, required: true },
  patientId: { type: Number, ref: 'Patient', required: true },
  consultantId: { type: Number, ref: 'Consultant', required: true },
  appointmentDate: { type: Date, required: true },
  timeSlot: {
    startTime: { type: String, required: true }, // Format: "HH:MM AM/PM"
    endTime: { type: String, required: true },   // Format: "HH:MM AM/PM"
  },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Cancelled'], 
    required: true 
  },
  appointmentLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Automatically schedule reminders when a new appointment is created
appointmentSchema.post('save', async function (doc) {
  const appointment = doc;
  console.log('reminder scheduller');
  try {
    const settings = await Settings.findOne({ key: 'appointmentReminderPeriod' });
    const reminderPeriod = settings ? settings.value : 1;

    console.log('Fetched Reminder Period:', reminderPeriod);

    const reminderTime = new Date(appointment.appointmentDate);
    reminderTime.setHours(reminderTime.getHours() - reminderPeriod);

    console.log('Calculated Reminder Time:', reminderTime);

    const job = nodeSchedule.scheduleJob(reminderTime, async () => {
      console.log('Reminder job triggered at:', new Date());

      const patient = await Patient.findOne({ userId: appointment.patientId });
      const consultant = await Consultant.findOne({ userId: appointment.consultantId });

      if (!patient || !consultant) {
        console.error('Patient or Consultant not found:', appointment.appointmentId);
        return;
      }

      const notificationMessage = `Reminder: You have an appointment scheduled at ${appointment.timeSlot.startTime} on ${appointment.appointmentDate.toDateString()}.`;

      try {
        const notification = new Notification({
          notificationId: Date.now(),
          userId: [appointment.patientId, appointment.consultantId],
          type: 'AppointmentReminder',
          message: notificationMessage,
          isRead: [false, false],
          relatedId: appointment.appointmentId,
        });
        await notification.save();
        console.log('Notification saved:', notification);
      } catch (err) {
        console.error('Failed to save notification:', err);
      }

      try {
        await sendEmail({
          mail_type: 'appointment_reminder',
          name: `${patient.information.firstName} ${patient.information.lastName}`,
          email: patient.information.email,
          subject: 'Appointment Reminder',
          message: notificationMessage,
        });
        console.log('Reminder email sent to patient');
      } catch (err) {
        console.error('Failed to send email to patient:', err);
      }

      try {
        await sendEmail({
          mail_type: 'appointment_reminder',
          name: `${consultant.firstName} ${consultant.lastName}`,
          email: consultant.information.email,
          subject: 'Appointment Reminder',
          message: notificationMessage,
        });
        console.log('Reminder email sent to consultant');
      } catch (err) {
        console.error('Failed to send email to consultant:', err);
      }
    });

    if (!job) {
      console.error('Failed to schedule reminder job');
    }
  } catch (error) {
    console.error('Error scheduling appointment reminder:', error);
  }
});


const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;



