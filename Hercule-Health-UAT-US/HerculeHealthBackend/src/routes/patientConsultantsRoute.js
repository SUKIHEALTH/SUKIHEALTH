const express = require('express');
const { getPatientConsultantDetails } = require('../controllers/patientConsultantsController');
const router = express.Router();

// Route to fetch consultant details based on patientId
router.get('/:patientId', getPatientConsultantDetails);

module.exports = router;
