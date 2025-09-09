// src/routes/refundRoutes.js
const express = require("express");
const { refundPayment } = require("../controllers/paymentRefundController");

const router = express.Router();

router.post("/", refundPayment);

module.exports = router;
