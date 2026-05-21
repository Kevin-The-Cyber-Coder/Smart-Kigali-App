const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User management routes
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Analytics routes
router.get('/analytics', adminController.getAnalytics);
router.get('/statistics', adminController.getSystemStatistics);
router.get('/reports-summary', adminController.getReportsSummary);

// System management
router.get('/dashboard', adminController.getAdminDashboard);
router.post('/broadcast', adminController.broadcastNotification);

module.exports = router;