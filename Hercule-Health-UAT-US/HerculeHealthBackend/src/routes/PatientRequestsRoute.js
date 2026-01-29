const express = require('express');
const { getPatientRequests } = require('../controllers/PatientRequestsController');

const router = express.Router();

// Route to fetch patient requests with consultant details
router.get('/:patientId', getPatientRequests);

module.exports = router;
