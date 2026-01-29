const express = require("express");
const multer = require("multer");
const { processFile } = require("../controllers/uploadLabResultsController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/:id", upload.single("file"), processFile);

module.exports = router;
