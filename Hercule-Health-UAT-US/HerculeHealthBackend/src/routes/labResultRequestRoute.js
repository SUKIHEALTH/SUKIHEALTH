const express = require('express');
const { requestLabResult } = require('../controllers/labResultRequestController');

const router = express.Router();

// Route to request a lab result
router.post('/', requestLabResult);

module.exports = router;
