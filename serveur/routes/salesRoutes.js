const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");
const authorizeProvider = require("../middleware/authorizeProvider");

// Apply authorization middleware to all routes
router.use(authorizeProvider);

// Get all sales for provider
router.get("/sales", salesController.getProviderSales);

// Get specific sale details
router.get("/sales/:saleId", salesController.getSaleDetails);

// Get sales statistics
router.get("/sales-stats", salesController.getSalesStats);

module.exports = router;