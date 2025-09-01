const express = require('express');
const router = express.Router();
const { fetchAllAppointments } = require('../controllers/getAllAppoinmentsController'); // Import the controller

// Define the route to fetch all appointments
router.post('/', fetchAllAppointments);

module.exports = router;
