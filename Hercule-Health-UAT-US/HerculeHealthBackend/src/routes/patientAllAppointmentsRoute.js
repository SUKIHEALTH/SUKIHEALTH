const express = require('express');
const { patientAllAppointments } = require('../controllers/patientAllAppointmentsController');

const router = express.Router();

// Define the route
router.post('/:patientId', patientAllAppointments);

// Export the router properly
module.exports = router;