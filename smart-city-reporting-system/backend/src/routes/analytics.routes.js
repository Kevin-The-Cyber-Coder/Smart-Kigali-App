const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const analyticsController = require('../controllers/analytics.controller');

// All analytics routes require authentication
router.use(protect);

router.get('/statistics', analyticsController.getStatistics);
router.get('/trends', analyticsController.getTrends);
router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/categories', analyticsController.getCategoryStats);
router.get('/performance', analyticsController.getPerformanceMetrics);

module.exports = router;