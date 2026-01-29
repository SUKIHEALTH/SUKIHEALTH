const express = require('express');
const { forgetPassword } = require('../controllers/forgetPawwordController');

const router = express.Router();

// Reset Password API
router.post('/', forgetPassword);

module.exports = router;
