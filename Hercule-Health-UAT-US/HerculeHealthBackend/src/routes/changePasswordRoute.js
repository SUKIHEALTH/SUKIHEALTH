const express = require('express');
const router = express.Router();
const {changePassword} = require('../controllers/changePasswordController');

// Change Password Route
router.post('/', changePassword);

module.exports = router;
