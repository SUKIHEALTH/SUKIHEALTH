const express = require('express');
const patientProfileInformation = require('../controllers/getPatientProfileInformationController');

const router = express.Router();

// Define the route
router.get('/:id', patientProfileInformation.getPatientProfile);

// Export the router properly
module.exports = router;