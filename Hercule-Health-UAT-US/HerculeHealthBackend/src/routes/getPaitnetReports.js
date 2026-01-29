const express = require('express');
const labResultGetPatient = require('../controllers/labResultgetPatientController');

const router = express.Router();

// Define the route
router.post('/', labResultGetPatient.getPatientReports);

// Export the router properly
module.exports = router;