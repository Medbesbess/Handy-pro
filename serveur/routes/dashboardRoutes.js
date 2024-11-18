const express = require("express");
const router = express.Router();
const authorizeUser = require("../middleware/authorizeUser");
const {
  getUserBookings,
  getBookingDetails,
  getDashboardSummary,
} = require("../controllers/dashboardController");

// Dashboard summary
router.get("/summary", authorizeUser, getDashboardSummary);

// Existing routes
router.get("/bookings", authorizeUser, getUserBookings);
router.get("/bookings/:bookingId", authorizeUser, getBookingDetails);

module.exports = router;
