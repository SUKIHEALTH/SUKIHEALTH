// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPayment } = require('../controllers/paymentBookingController');

// Route to create a new payment
router.post('/create', createPayment);

module.exports = router;