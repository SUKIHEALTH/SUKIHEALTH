const express = require('express');
const router = express.Router();
const { getBookingDetails } = require('../controllers/bookingDetailsController');

// Route to fetch payment and consultant details
router.post('/:appointmentId', getBookingDetails);

module.exports = router;
