const express = require('express');
const updatePatientInformation = require('../controllers/updatePatientInformationController');

const router = express.Router();

// Define the route
router.put('/:id', updatePatientInformation.updatePatient);

// Export the router properly
module.exports = router;