const express = require('express');
const getAllConsultants = require('../controllers/getAllConsultantsController');

const router = express.Router();

// Define the route
router.post('/', getAllConsultants.getAllConsultants);

// Export the router properly
module.exports = router;

