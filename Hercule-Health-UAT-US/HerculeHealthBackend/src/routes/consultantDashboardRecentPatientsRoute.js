const express = require('express');
const { getRecentPatients } = require('../controllers/consultantDashboardRecentPatientsController');

const router = express.Router();

// GET: Dashboard data for a specific consultant
router.get('/:consultantId', getRecentPatients);

module.exports = router;