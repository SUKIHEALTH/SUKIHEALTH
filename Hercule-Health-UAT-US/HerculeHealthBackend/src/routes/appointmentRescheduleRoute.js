const express = require('express');
const router = express.Router();
const { rescheduleAppointment } = require('../controllers/appointmentRescheduleController');

// Route to cancel lab result request
router.put('/:appointmentId', rescheduleAppointment);

module.exports = router;
