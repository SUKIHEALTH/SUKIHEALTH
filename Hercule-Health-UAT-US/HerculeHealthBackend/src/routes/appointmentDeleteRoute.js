const express = require('express');
const router = express.Router();
const { deleteAppointment, cancelAppointment } = require('../controllers/deleteAppointmentController');

// Route to cancel lab result request
router.post('/', deleteAppointment);
router.post('/cancel', cancelAppointment);

module.exports = router;
