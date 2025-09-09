const express = require('express');
const router = express.Router();
const createPatientController = require('../controllers/createPatientController');
// Ensure this POST route is defined
router.post('/', createPatientController.createPatient);

module.exports = router;


