const express = require('express');
const { createAppointment } = require('../controllers/appoinmentCreateController');

const router = express.Router();

// POST route to create a new appointment
router.post('/', createAppointment);

module.exports = router;
