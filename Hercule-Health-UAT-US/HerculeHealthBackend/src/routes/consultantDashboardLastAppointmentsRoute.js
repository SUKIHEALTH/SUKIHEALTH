const express = require('express');
const { getLastAppointments } = require('../controllers/consultantDashboardLastAppointmentsController');

const router = express.Router();

// GET: Dashboard data for a specific consultant
router.get('/:consultantId', getLastAppointments);

module.exports = router;