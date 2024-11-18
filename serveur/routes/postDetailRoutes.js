const express = require("express");
const router = express.Router();
const {
  fetchAllServices,
  updateService,
  fetchServiceDetails,
  deleteService,
} = require("../controllers/postDetailController");

router.get("/", fetchAllServices); 
router.get("/:id", fetchServiceDetails); 
router.put("/:id", updateService); 
router.delete('/:id', deleteService)
module.exports = router;
