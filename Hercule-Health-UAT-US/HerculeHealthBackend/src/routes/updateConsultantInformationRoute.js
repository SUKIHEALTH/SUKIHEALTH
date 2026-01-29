const express = require('express');
const updateConsultantInformation = require('../controllers/updateConsultantInformationController');

const router = express.Router();

// Define the route
router.put('/:id', updateConsultantInformation.updateConsultant);

// Export the router properly
module.exports = router;