// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { getChatsByConsultantId } = require('../controllers/chatHistoryConsultantController');

// Route to get chat history between two users
router.post('/:consultantId', getChatsByConsultantId);

module.exports = router;
