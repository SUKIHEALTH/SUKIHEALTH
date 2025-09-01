const express = require('express');
const { fetchAllRefundRequests } = require('../controllers/refundRequestsController');

const router = express.Router();

// Route to fetch all refund requests
router.get('/', fetchAllRefundRequests);

module.exports = router;
