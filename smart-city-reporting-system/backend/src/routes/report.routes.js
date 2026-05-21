const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const reportController = require('../controllers/report.controller');
const { uploadMultiple } = require('../middleware/upload.middleware');

// All report routes require authentication
router.use(protect);

// Report CRUD operations
router.route('/')
  .get(reportController.getReports)
  .post(uploadMultiple, reportController.createReport);

// Nearby reports
router.get('/nearby', reportController.getNearbyReports);

// Report statistics
router.get('/statistics', reportController.getReportStatistics);

// Individual report operations
router.route('/:id')
  .get(reportController.getReportById)
  .put(reportController.updateReport)
  .delete(reportController.deleteReport);

// Status update
router.put('/:id/status', authorize('admin', 'worker'), reportController.updateStatus);

// Comments
router.post('/:id/comments', reportController.addComment);
router.delete('/:id/comments/:commentId', reportController.deleteComment);

// Assignment
router.put('/:id/assign', authorize('admin', 'worker'), reportController.assignReport);

// Media
router.post('/:id/media', uploadMultiple, reportController.addMedia);
router.delete('/:id/media/:mediaId', reportController.deleteMedia);

module.exports = router;