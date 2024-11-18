// paymentroutes
const express = require("express");
const router = express.Router();
const { 
  initiatePayment, 
  verifyPayment, 
  getPaymentHistory 
} = require("../controllers/paymentController");
const authorizeUser = require("../middleware/authorizeUser");

router.post("/payments/initiate/:bookingId", authorizeUser, initiatePayment);
router.post("/payments/verify/:bookingId", authorizeUser, verifyPayment);
router.get("/payments/history/:bookingId", authorizeUser, getPaymentHistory);

module.exports = router;