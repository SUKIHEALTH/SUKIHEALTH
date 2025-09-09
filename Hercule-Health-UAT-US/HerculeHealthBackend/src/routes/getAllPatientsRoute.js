const express = require('express');
const getAllPatients = require('../controllers/getAllPatientsController');

const router = express.Router();

// Define the route
router.post('/', getAllPatients.getAllPatients);

// Export the router properly
module.exports = router;