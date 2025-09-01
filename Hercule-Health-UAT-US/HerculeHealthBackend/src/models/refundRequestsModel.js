const mongoose = require('mongoose');

const refundRequestSchema = new mongoose.Schema({
  refundRequestId: { type: Number, unique: true, required: true }, // unique refund request identifier
  paymentId: { type: String, required: true }, // reference to Mollie paymentId or your Payment
  appointmentId: { type: Number, required: true }, // linked appointment
  patientId: { type: Number, required: true }, // who requested refund (patient)
  refundStatus: { 
    type: String, 
    enum: ['initiated', 'refunded', 'refund_pending'], 
    default: 'initiated' 
  },
  refundInitiatedBy: { 
    userId: {  type: Number, required: true },
    userType: { type: String, enum: ['patient', 'admin', 'doctor'], required: true }
  },
  refundRequestDate: { type: Date, default: Date.now },
  refundProcessedDate: { type: Date },
  refundTransactionId: { type: String }, // payment gateway refund transaction id if any
  notes: { type: String }
});

const RefundRequest = mongoose.model('RefundRequest', refundRequestSchema);
module.exports = RefundRequest;
