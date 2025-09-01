const express = require('express');
const { getAllPayments } = require('../controllers/allPaymentsController');

const router = express.Router();

// Define the route to fetch all payments
router.post('/', getAllPayments);

module.exports = router;
