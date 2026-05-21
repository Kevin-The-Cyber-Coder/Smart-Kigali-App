const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');
const upload = require('../middleware/upload.middleware');

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);
router.delete('/profile', userController.deleteUserAccount);
router.post('/profile/picture', upload.single('avatar'), userController.uploadProfilePicture);

// Report routes
router.get('/reports', userController.getUserReports);
router.get('/stats', userController.getUserStats);
router.get('/activity', userController.getActivityLog);

// Notification routes
router.get('/notifications', userController.getUserNotifications);
router.put('/notifications/:id/read', userController.markNotificationAsRead);
router.put('/notifications/read-all', userController.markAllNotificationsAsRead);

// Preference routes
router.put('/preferences', userController.updatePreferences);

// Account management
router.put('/email', userController.changeEmail);
router.post('/deactivate', userController.deactivateAccount);
router.post('/reactivate', userController.reactivateAccount);

// Admin only routes
router.get('/all', authorize('admin'), userController.getUsersByRole);
router.get('/role/:role', authorize('admin'), userController.getUsersByRole);

module.exports = router;