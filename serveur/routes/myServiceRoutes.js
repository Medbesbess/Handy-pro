const express = require("express");
const router = express.Router();
const {
  fetchAllServices,
  fetchServiceDetails,
  createBooking,
} = require("../controllers/myServiceController");
const authorizeUser = require("../middleware/authorizeUser");

// Public routes
router.get("/", fetchAllServices);
router.get("/:id", fetchServiceDetails);

// Protected booking route
router.post("/bookings", authorizeUser, createBooking);

module.exports = router;
