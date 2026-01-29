const express = require('express');
const { resetPassword } = require('../controllers/resetPasswordController');

const router = express.Router();

// Reset Password API
router.post('/', resetPassword);

module.exports = router;
