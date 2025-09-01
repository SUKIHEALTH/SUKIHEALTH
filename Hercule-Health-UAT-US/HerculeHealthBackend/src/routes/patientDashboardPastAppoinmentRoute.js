const express = require('express');
const { getRecentPastAppointment } = require('../controllers/patientDashboardPastAppoinmentController');

const router = express.Router();

// Route to fetch the most recent past appointment for a patient
router.get('/:patientId', getRecentPastAppointment);

module.exports = router;
