const Report = require('../models/Report');
const User = require('../models/User');
const ResponseHandler = require('../utils/responseHandler');
const aiClassifier = require('../services/aiClassifier.service');
const notificationService = require('../services/notification.service');

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    const { title, description, category, priority, location, address } = req.body;
    
    // Use AI to classify if not provided
    let finalCategory = category;
    let finalPriority = priority;
    
    if (!category || !priority) {
      const classification = await aiClassifier.classifyIssue(title, description);
      finalCategory = finalCategory || classification.category;
      finalPriority = finalPriority || classification.priority;
    }
    
    const reportData = {
      title,
      description,
      category: finalCategory,
      priority: finalPriority,
      location: location ? JSON.parse(location) : null,
      'location.address': address,
      reportedBy: req.user.id,
      media: req.files ? req.files.map(file => ({ url: `/uploads/${file.filename}`, type: 'image' })) : []
    };
    
    const report = await Report.create(reportData);
    
    // Populate user info
    await report.populate('reportedBy', 'name email');
    
    // Notify admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await admin.addNotification(
        'New Report Submitted',
        `${req.user.name} submitted a new report: ${title}`,
        'report_update',
        { reportId: report._id }
      );
    }
    
    ResponseHandler.success(res, report, 'Report created successfully', 201);
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get all reports with filters
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const { status, category, priority, district, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (district) filter['location.district'] = district;
    
    // If user is citizen, only show their reports
    if (req.user.role === 'citizen') {
      filter.reportedBy = req.user.id;
    }
    
    const reports = await Report.find(filter)
      .populate('reportedBy', 'name email avatar')
      .populate('assignedTo', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Report.countDocuments(filter);
    
    ResponseHandler.paginated(res, reports, page, limit, total);
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reportedBy', 'name email phone avatar')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name avatar');
    
    if (!report) {
      return ResponseHandler.error(res, 'Report not found', 404);
    }
    
    // Check authorization
    if (req.user.role === 'citizen' && report.reportedBy._id.toString() !== req.user.id) {
      return ResponseHandler.error(res, 'Not authorized to view this report', 403);
    }
    
    ResponseHandler.success(res, report);
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return ResponseHandler.error(res, 'Report not found', 404);
    }
    
    // Only reporter or admin can update
    if (report.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return ResponseHandler.error(res, 'Not authorized to update this report', 403);
    }
    
    const allowedUpdates = ['title', 'description', 'category', 'priority', 'location'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        report[field] = req.body[field];
      }
    });
    
    await report.save();
    await report.populate('reportedBy', 'name email');
    
    ResponseHandler.success(res, report, 'Report updated successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return ResponseHandler.error(res, 'Report not found', 404);
    }
    
    // Only reporter or admin can delete
    if (report.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return ResponseHandler.error(res, 'Not authorized to delete this report', 403);
    }
    
    await report.deleteOne();
    
    ResponseHandler.success(res, null, 'Report deleted successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Update report status
// @route   PUT /api/reports/:id/status
// @access  Private (Admin/Worker)
exports.updateStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    const report = await Report.findById(req.params.id).populate('reportedBy', 'name email');
    
    if (!report) {
      return ResponseHandler.error(res, 'Report not found', 404);
    }
    
    const oldStatus = report.status;
    report.status = status;
    
    if (status === 'resolved') {
      report.resolvedAt = Date.now();
    }
    
    if (comment) {
      report.comments.push({
        user: req.user.id,
        text: comment
      });
    }
    
    await report.save();
    
    // Send notification to reporter
    await notificationService.sendStatusUpdate(report.reportedBy, report);
    
    // Add notification for reporter
    await report.reportedBy.addNotification(
      'Report Status Updated',
      `Your report "${report.title}" status changed from ${oldStatus} to ${status}`,
      'report_update',
      { reportId: report._id, oldStatus, newStatus: status }
    );
    
    ResponseHandler.success(res, report, 'Status updated successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Add comment to report
// @route   POST /api/reports/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return ResponseHandler.error(res, 'Comment text is required', 400);
    }
    
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return ResponseHandler.error(res, 'Report not found', 404);
    }
    
    report.comments.push({
      user: req.user.id,
      text
    });
    
    await report.save();
    
    const updatedReport = await Report.findById(req.params.id)
      .populate('comments.user', 'name avatar');
    
    ResponseHandler.success(res, updatedReport.comments, 'Comment added successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Delete comment
// @route   DELETE /api/reports/:id/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return ResponseHandler.error(res, 'Report not found', 404);
    }
    
    const comment = report.comments.id(req.params.commentId);
    
    if (!comment) {
      return ResponseHandler.error(res, 'Comment not found', 404);
    }
    
    // Only comment author or admin can delete
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return ResponseHandler.error(res, 'Not authorized to delete this comment', 403);
    }
    
    comment.deleteOne();
    await report.save();
    
    ResponseHandler.success(res, null, 'Comment deleted successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Assign report to worker
// @route   PUT /api/reports/:id/assign
// @access  Private (Admin/Worker)
exports.assignReport = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return ResponseHandler.error(res, 'Report not found', 404);
    }
    
    const worker = await User.findById(assignedTo);
    
    if (!worker || worker.role !== 'worker') {
      return ResponseHandler.error(res, 'Invalid worker assigned', 400);
    }
    
    report.assignedTo = assignedTo;
    report.status = 'in-progress';
    await report.save();
    
    // Notify worker
    await notificationService.sendAssignmentNotification(worker, report);
    await worker.addNotification(
      'New Report Assigned',
      `You have been assigned to report: ${report.title}`,
      'assignment',
      { reportId: report._id }
    );
    
    ResponseHandler.success(res, report, 'Report assigned successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get nearby reports
// @route   GET /api/reports/nearby
// @access  Private
exports.getNearbyReports = async (req, res) => {
  try {
    const { lat, lng, distance = 5 } = req.query;
    
    if (!lat || !lng) {
      return ResponseHandler.error(res, 'Latitude and longitude are required', 400);
    }
    
    const reports = await Report.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: distance * 1000
        }
      },
      status: { $ne: 'resolved' }
    })
    .limit(20)
    .populate('reportedBy', 'name');
    
    ResponseHandler.success(res, reports, 'Nearby reports fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get report statistics
// @route   GET /api/reports/statistics
// @access  Private
exports.getReportStatistics = async (req, res) => {
  try {
    const stats = await Report.aggregate([
      {
        $facet: {
          totalCount: [{ $count: 'count' }],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } }
          ],
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ]
        }
      }
    ]);
    
    ResponseHandler.success(res, stats[0], 'Statistics fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Add media to report
// @route   POST /api/reports/:id/media
// @access  Private
exports.addMedia = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return ResponseHandler.error(res, 'Report not found', 404);
    }
    
    if (report.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return ResponseHandler.error(res, 'Not authorized', 403);
    }
    
    const media = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      type: 'image',
      uploadedAt: new Date()
    }));
    
    report.media.push(...media);
    await report.save();
    
    ResponseHandler.success(res, report.media, 'Media added successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Delete media from report
// @route   DELETE /api/reports/:id/media/:mediaId
// @access  Private
exports.deleteMedia = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return ResponseHandler.error(res, 'Report not found', 404);
    }
    
    const media = report.media.id(req.params.mediaId);
    
    if (!media) {
      return ResponseHandler.error(res, 'Media not found', 404);
    }
    
    media.deleteOne();
    await report.save();
    
    ResponseHandler.success(res, null, 'Media deleted successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};