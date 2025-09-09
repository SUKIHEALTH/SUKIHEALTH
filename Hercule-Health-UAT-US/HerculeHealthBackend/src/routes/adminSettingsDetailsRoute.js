const express = require('express');
const { fetchAllSettings } = require('../controllers/adminSettingsDetailsController');

const router = express.Router();

// Route to fetch all settings
router.get('/', fetchAllSettings);

module.exports = router;
