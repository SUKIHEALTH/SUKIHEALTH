const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fetchFileDataFromS3Controller');

// Route to fetch data from S3 based on file URL
router.post('/', fileController.fetchFileData);

module.exports = router;
