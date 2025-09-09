const express = require('express');
const { getPaymentDetailsByPatientId } = require('../controllers/patientPaymentsController');

const router = express.Router();

// Define the route
router.post('/:patientId', getPaymentDetailsByPatientId);

module.exports = router;
