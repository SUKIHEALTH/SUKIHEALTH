// routes/consultantRoutes.js
const express = require('express');
const consultantController = require('../controllers/createConsultantController');  // Import controller

const router = express.Router();

// Define the POST route for creating a consultant
router.post('/', consultantController.createConsultant);

module.exports = router;  // Correct export

