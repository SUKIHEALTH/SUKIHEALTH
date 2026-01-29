// src/controllers/paymentController.js
const mollieClient = require('../config/mollieService');
const Payment = require('../models/paymentModel');

// Generate a unique transaction ID (helper function)
const generateTransactionId = () => {
  return `tr_${Math.floor(100000000 + Math.random() * 900000000)}`; // Random 9-digit number with 'tr_' prefix
};

// Get the next invoice number, starting from 100001
const getNextInvoiceNumber = async () => {
  const latestPayment = await Payment.findOne().sort({ invoiceNumber: -1 }); // Find the latest invoice number
  return latestPayment ? latestPayment.invoiceNumber + 1 : 100001; // Increment by 1 or start from 100001
};

// Create Payment
const createPayment = async (req, res) => {
  try {
    const { amount, currency, appointmentId, consultantId, patientId } = req.body;

    let existingPayment = await Payment.findOne({ appointmentId });

    const transactionId = generateTransactionId();
    const webhookUrl = `${process.env.BACKEND_URL}/api/payment-update/webhook`;

    const payment = await mollieClient.payments.create({
      amount: { value: amount.toFixed(2), currency },
      description: `Appointment #${appointmentId}`,
      redirectUrl: `${process.env.FRONTEND_URL}/booking-success?appointmentId=${appointmentId}&consultantId=${consultantId}`,
      webhookUrl, // Use verified webhook URL
      
    });
    
    // const transactionId = generateTransactionId();
    if (existingPayment) {
      // Update existing payment record
      existingPayment.transactionId = transactionId;
      existingPayment.paymentId = payment.id;
      existingPayment.amount = amount;
      existingPayment.currency = currency;
      existingPayment.status = payment.status;
      existingPayment.patientId = patientId;

      await existingPayment.save();
    } else {
      // Create new payment record
      const invoiceNumber = await getNextInvoiceNumber(); // Fetch or generate the next invoice number

      const newPayment = new Payment({
        transactionId,
        invoiceNumber,
        appointmentId,
        paymentId: payment.id,
        amount,
        currency,
        status: payment.status,
        patientId,
      });

      await newPayment.save();
    }

    // Use the checkout URL from the payment response
    res.status(200).json({ paymentUrl: payment._links.checkout.href });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Failed to create payment.' });
  }
};

module.exports = { createPayment };
