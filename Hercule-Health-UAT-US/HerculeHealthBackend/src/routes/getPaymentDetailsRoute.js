const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/getPaymentDetailsController');

// Route to get payment details by invoice number
router.get('/:invoiceNumber', paymentController.getPaymentByInvoiceNumber);

module.exports = router;
