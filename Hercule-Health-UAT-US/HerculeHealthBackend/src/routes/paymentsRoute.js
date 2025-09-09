// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { paymentWebhook } = require('../controllers/paymentController');

// Webhook route to handle Mollie payment updates
router.post('/webhook', paymentWebhook);

module.exports = router;
