const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/ControllerAdmin/analyticsController');
router.get('/categories',analyticsController.allCategories)
router.get('/total-users', analyticsController.getTotalUsers);
router.get('/services-by-category', analyticsController.getServicesByCategory);
router.get('/total-revenue', analyticsController.getTotalRevenue);
router.get('/bookings-by-status', analyticsController.getBookingsByStatus);


module.exports = router;