const express = require('express');
const { shareLabResult } = require('../controllers/labResultShareController');

const router = express.Router();

// Share lab result route
router.post('/', shareLabResult);

module.exports = router;
