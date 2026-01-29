const express = require('express');
const { checkEmail } = require('../controllers/emailCheckingController'); // Adjust the path as needed

const router = express.Router();

// Route to check email
router.post('/', checkEmail);

module.exports = router;
