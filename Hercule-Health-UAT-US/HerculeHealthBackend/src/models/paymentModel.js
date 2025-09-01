// src/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transactionId:{ type: String, unique: true, required: true},
  invoiceNumber:{ type: Number, unique: true, required: true},
  appointmentId: { type: Number, required: true },
  paymentId: { type: String, required: true }, // Mollie's payment ID
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'EUR' },
  paymentMethod: { type: String},
  status: { type: String, required: true },
  transactionDate: { type: Date, default: Date.now },
  patientId: { type: Number, required: true },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
