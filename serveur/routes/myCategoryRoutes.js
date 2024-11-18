const express = require("express");
const router = express.Router();
const {
  fetchCategories,
  fetchAvailableCities,
  fetchProvidersByFilters,
} = require("../controllers/myCategoryController");

// Public routes
router.get("/", fetchCategories); // Fetch all categories
router.get("/cities", fetchAvailableCities); // Fetch all available cities
router.get("/providers", fetchProvidersByFilters); // Fetch providers by category and city

module.exports = router;
