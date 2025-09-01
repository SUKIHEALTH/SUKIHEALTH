const express = require('express');
const { updateAppointment } = require('../controllers/appoinmentUpdateController');

const router = express.Router();

// POST route to create a new appointment
router.post('/:appointmentId', updateAppointment);

module.exports = router;
