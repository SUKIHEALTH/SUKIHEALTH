// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { getChatsByPatientId } = require('../controllers/chatHistoryPatientController');

// Route to get chat history between two users
router.get('/:patientId', getChatsByPatientId);

module.exports = router;
