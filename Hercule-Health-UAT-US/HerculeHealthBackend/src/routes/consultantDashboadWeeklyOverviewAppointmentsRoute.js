const express = require('express');
const { getWeeklyOverview } = require('../controllers/consultantDashboadWeeklyOverviewAppointmentsController');

const router = express.Router();

// GET: Dashboard data for a specific consultant
router.get('/:consultantId', getWeeklyOverview);

module.exports = router;