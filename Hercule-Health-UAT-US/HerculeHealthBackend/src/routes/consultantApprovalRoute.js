const express = require('express');
const updateConsultantApproval = require('../controllers/consultantApprovalController');

const router = express.Router();

// Define the route
router.put('/:id', updateConsultantApproval.updateApprovalStatus);

// Export the router properly
module.exports = router;



