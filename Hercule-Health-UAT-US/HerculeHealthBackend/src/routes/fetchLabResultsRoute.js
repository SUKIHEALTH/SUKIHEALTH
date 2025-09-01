const express = require('express');
const router = express.Router();
const { fetchLabResults } = require('../controllers/fetchLabResultsController'); // Import the controller

// Define the route to fetch lab results by patientId
router.get('/:patientId', fetchLabResults);

module.exports = router;
