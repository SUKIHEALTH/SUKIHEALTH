const Payment = require('../models/paymentModel');

// Controller function to get payment details by invoice number
const getPaymentByInvoiceNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;

    // Fetch payment details from the database
    const payment = await Payment.findOne({ invoiceNumber });

    if (!payment) {
      return res.status(404).json({ message: 'Payment details not found' });
    }

    return res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPaymentByInvoiceNumber };
