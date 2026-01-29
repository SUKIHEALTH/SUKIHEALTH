const express = require('express');
const consultantProfileInformation = require('../controllers/getConsultantProfileInformationController');

const router = express.Router();

// Define the route
router.get('/:id', consultantProfileInformation.getConsultantProfile);

// Export the router properly
module.exports = router;