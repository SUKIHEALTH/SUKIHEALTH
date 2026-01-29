// models/notificationModel.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId:{ type: Number, unique: true, required: true},
  userId: [{ type: Number, ref: 'User', required: true }], // Array to handle multiple users
  type: { type: String, enum: ['Appointment', 'LabResultRequest', 'LabResultShare', 'AppointmentReminder', 'Appointment Rescheduled', 'Appointment Cancelled'], required: true },
  message: { type: String, required: true },
  isRead: [{ type: Boolean, default: false }], // Track read status for each user
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;




