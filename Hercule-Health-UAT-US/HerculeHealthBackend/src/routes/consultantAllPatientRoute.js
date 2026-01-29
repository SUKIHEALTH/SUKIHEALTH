const express = require('express');
const { consultantAllPatients } = require('../controllers/consultantAllPatientController');

const router = express.Router();

// Define the route
router.post('/:consultantId', consultantAllPatients);

// Export the router properly
module.exports = router;