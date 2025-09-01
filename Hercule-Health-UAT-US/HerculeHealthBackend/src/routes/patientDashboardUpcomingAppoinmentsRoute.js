const express = require('express');
const { getUpcomingAppointments } = require('../controllers/patientDashboardUpcomingAppoinmentsController');

const router = express.Router();

// GET: Dashboard data for a specific consultant
router.get('/:patientId', getUpcomingAppointments);

module.exports = router;