const express = require('express');
const router = express.Router();
const { updateSlotStatus } = require('../controllers/availablesSlotsStatusChangingController'); // Import the controller

// Route to update the status of an available slot
router.patch('/:consultantId', updateSlotStatus);

module.exports = router;