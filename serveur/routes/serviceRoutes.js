const express = require("express");
const router = express.Router();
const authorizeProvider = require("../middleware/authorizeProvider");
const {
  createService,
  updateService,
  deleteService,
  getServicesByProvider,
  getCategories,
} = require("../controllers/serviceController");

// Public routes
router.get("/categories", getCategories);
router.get("/provider/:providerId", getServicesByProvider);

// Protected routes
router.post("/create",authorizeProvider, createService);
// router.put("/update/:serviceId", authorizeProvider, updateService);
// router.delete("/delete/:serviceId", authorizeProvider, deleteService);

module.exports = router;
