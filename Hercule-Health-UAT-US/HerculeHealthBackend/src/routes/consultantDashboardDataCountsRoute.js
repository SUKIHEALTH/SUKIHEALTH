const express = require('express');
const { getConsultantDashboardData } = require('../controllers/consultantDashboardDataCountsController');

const router = express.Router();

// GET: Dashboard data for a specific consultant
router.get('/:consultantId', getConsultantDashboardData);

module.exports = router;
