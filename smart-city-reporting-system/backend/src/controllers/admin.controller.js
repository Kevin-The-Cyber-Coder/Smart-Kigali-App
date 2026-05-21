const User = require('../models/User');
const Report = require('../models/Report');
const ResponseHandler = require('../utils/responseHandler');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== 'all') {
      filter.role = role;
    }
    
    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');
    
    const total = await User.countDocuments(filter);
    
    ResponseHandler.paginated(res, users, page, limit, total, 'Users fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['citizen', 'admin', 'worker'].includes(role)) {
      return ResponseHandler.error(res, 'Invalid role', 400);
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return ResponseHandler.error(res, 'User not found', 404);
    }
    
    ResponseHandler.success(res, user, 'User role updated successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return ResponseHandler.error(res, 'User not found', 404);
    }
    
    // Delete all user's reports
    await Report.deleteMany({ reportedBy: req.params.id });
    
    ResponseHandler.success(res, null, 'User deleted successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalReports = await Report.countDocuments();
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const inProgressReports = await Report.countDocuments({ status: 'in-progress' });
    const rejectedReports = await Report.countDocuments({ status: 'rejected' });
    
    const reportsByCategory = await Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const reportsByPriority = await Report.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    const recentReports = await Report.find()
      .sort('-createdAt')
      .limit(10)
      .populate('reportedBy', 'name email');
    
    const analytics = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        citizens: await User.countDocuments({ role: 'citizen' }),
        workers: await User.countDocuments({ role: 'worker' }),
        admins: await User.countDocuments({ role: 'admin' })
      },
      reports: {
        total: totalReports,
        resolved: resolvedReports,
        pending: pendingReports,
        inProgress: inProgressReports,
        rejected: rejectedReports,
        resolutionRate: totalReports > 0 ? ((resolvedReports / totalReports) * 100).toFixed(2) : 0
      },
      reportsByCategory,
      reportsByPriority,
      recentReports,
      timestamp: new Date()
    };
    
    ResponseHandler.success(res, analytics, 'Analytics fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get system statistics
// @route   GET /api/admin/statistics
// @access  Private/Admin
exports.getSystemStatistics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const stats = await Report.aggregate([
      {
        $facet: {
          totalStats: [
            {
              $group: {
                _id: null,
                avgResolutionTime: {
                  $avg: {
                    $cond: [
                      { $eq: ['$status', 'resolved'] },
                      { $subtract: ['$resolvedAt', '$createdAt'] },
                      null
                    ]
                  }
                }
              }
            }
          ],
          monthlyTrend: [
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
              $group: {
                _id: { $dayOfMonth: '$createdAt' },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id': 1 } }
          ]
        }
      }
    ]);
    
    ResponseHandler.success(res, stats[0], 'Statistics fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get reports summary
// @route   GET /api/admin/reports-summary
// @access  Private/Admin
exports.getReportsSummary = async (req, res) => {
  try {
    const { startDate, endDate, category, status } = req.query;
    const filter = {};
    
    if (startDate) filter.createdAt = { $gte: new Date(startDate) };
    if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
    if (category) filter.category = category;
    if (status) filter.status = status;
    
    const reports = await Report.find(filter)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort('-createdAt');
    
    const summary = {
      total: reports.length,
      byStatus: {
        pending: reports.filter(r => r.status === 'pending').length,
        inProgress: reports.filter(r => r.status === 'in-progress').length,
        resolved: reports.filter(r => r.status === 'resolved').length,
        rejected: reports.filter(r => r.status === 'rejected').length
      },
      byCategory: {},
      reports
    };
    
    reports.forEach(report => {
      if (!summary.byCategory[report.category]) {
        summary.byCategory[report.category] = 0;
      }
      summary.byCategory[report.category]++;
    });
    
    ResponseHandler.success(res, summary, 'Reports summary fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getAdminDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const [totalUsers, newUsersToday, totalReports, newReportsToday, reportsByDay] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      Report.countDocuments(),
      Report.countDocuments({ createdAt: { $gte: today } }),
      Report.aggregate([
        { $match: { createdAt: { $gte: weekAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);
    
    const dashboardData = {
      metrics: {
        totalUsers,
        newUsersToday,
        totalReports,
        newReportsToday,
        activeUsers: await User.countDocuments({ isActive: true }),
        pendingReports: await Report.countDocuments({ status: 'pending' })
      },
      recentActivity: {
        users: await User.find().sort('-createdAt').limit(5).select('name email role createdAt'),
        reports: await Report.find().sort('-createdAt').limit(5).populate('reportedBy', 'name')
      },
      reportsByDay,
      timestamp: new Date()
    };
    
    ResponseHandler.success(res, dashboardData, 'Dashboard data fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Broadcast notification to all users
// @route   POST /api/admin/broadcast
// @access  Private/Admin
exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, userRole } = req.body;
    
    if (!title || !message) {
      return ResponseHandler.error(res, 'Title and message are required', 400);
    }
    
    const filter = userRole && userRole !== 'all' ? { role: userRole } : {};
    const users = await User.find(filter);
    
    let notificationCount = 0;
    for (const user of users) {
      await user.addNotification(title, message, 'system', { broadcast: true });
      notificationCount++;
    }
    
    ResponseHandler.success(res, { notificationCount }, `Notification broadcast to ${notificationCount} users`);
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};