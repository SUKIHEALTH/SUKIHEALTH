const express = require('express');
const getAllApprovedConsultants = require('../controllers/getAllApprovedConsultantsController');

const router = express.Router();

// Define the route
router.post('/', getAllApprovedConsultants.getAllApprovedConsultants);

// Export the router properly
module.exports = router;

