const express = require('express');
const router = express.Router();
const { cancelLabResultRequest } = require('../controllers/labResultCancelRequestController');

// Route to cancel lab result request
router.post('/', cancelLabResultRequest);

module.exports = router;
