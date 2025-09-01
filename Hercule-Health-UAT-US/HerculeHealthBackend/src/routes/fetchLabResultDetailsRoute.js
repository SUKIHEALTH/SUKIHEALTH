const express = require('express');
const router = express.Router();
const { fetchLabResultById } = require('../controllers/fetchLabResultDetailsController'); // Import the controller

// Define the route to fetch lab result by labResultId
router.get('/:labResultId', fetchLabResultById);

module.exports = router;
