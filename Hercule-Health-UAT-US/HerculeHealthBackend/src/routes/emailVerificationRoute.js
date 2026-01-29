const express = require('express');
const { verifyEmail } = require('../controllers/emailVerificationController'); // Adjust the path as needed

const router = express.Router();

// Route to verify email
router.post('/', verifyEmail);

module.exports = router;
