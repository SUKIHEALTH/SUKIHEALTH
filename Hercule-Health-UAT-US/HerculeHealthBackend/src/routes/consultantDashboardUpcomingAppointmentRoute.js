const express = require('express');
const { getFirstUpcomingAppointment } = require('../controllers/consultantDashboardUpcomingAppointmentController');

const router = express.Router();

// GET: Dashboard data for a specific consultant
router.get('/:consultantId', getFirstUpcomingAppointment);

module.exports = router;