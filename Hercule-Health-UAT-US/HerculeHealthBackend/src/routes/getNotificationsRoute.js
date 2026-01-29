const express = require('express');
const { getUserNotifications } = require('../controllers/getNotificationsController');

const router = express.Router();

// Define the route
router.get('/:userId', getUserNotifications);

// Export the router properly
module.exports = router;