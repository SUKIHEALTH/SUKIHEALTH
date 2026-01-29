const express = require('express');
const { createOrUpdateSetting } = require('../controllers/adminSettingsAddController');

const router = express.Router();

// Route to create or update settings
router.post('/', createOrUpdateSetting);

module.exports = router;
