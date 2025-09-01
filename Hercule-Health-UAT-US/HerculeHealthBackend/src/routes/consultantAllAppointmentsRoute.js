const express = require('express');
const { consultantAllAppointments } = require('../controllers/consultantAllAppointmentsController');

const router = express.Router();

// Define the route
router.post('/:consultantId', consultantAllAppointments);

// Export the router properly
module.exports = router;