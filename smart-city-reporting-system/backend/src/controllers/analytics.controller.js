const Report = require('../models/Report');
const User = require('../models/User');
const ResponseHandler = require('../utils/responseHandler');

// @desc    Get report statistics
// @route   GET /api/analytics/statistics
// @access  Private
exports.getStatistics = async (req, res) => {
  try {
    const stats = await Report.aggregate([
      {
        $facet: {
          totalReports: [{ $count: 'count' }],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } }
          ],
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ],
          avgResolutionTime: [
            { $match: { status: 'resolved', resolvedAt: { $exists: true } } },
            {
              $project: {
                resolutionTime: {
                  $divide: [
                    { $subtract: ['$resolvedAt', '$createdAt'] },
                    1000 * 60 * 60 * 24 // Convert to days
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                avgTime: { $avg: '$resolutionTime' }
              }
            }
          ]
        }
      }
    ]);
    
    ResponseHandler.success(res, stats[0], 'Statistics fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get trends over time
// @route   GET /api/analytics/trends
// @access  Private
exports.getTrends = async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }
    
    let groupBy = {};
    let dateFormat = '';
    
    switch (period) {
      case 'day':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        dateFormat = '%Y-W%V';
        break;
      case 'month':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        dateFormat = '%Y-%m';
        break;
      case 'year':
        groupBy = {
          year: { $year: '$createdAt' }
        };
        dateFormat = '%Y';
        break;
      default:
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
    }
    
    const trends = await Report.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupBy,
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    ResponseHandler.success(res, trends, 'Trends fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    const [
      totalReports,
      reportsToday,
      reportsThisWeek,
      reportsThisMonth,
      resolvedThisMonth,
      topCategories,
      recentActivity
    ] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ createdAt: { $gte: today } }),
      Report.countDocuments({ createdAt: { $gte: weekAgo } }),
      Report.countDocuments({ createdAt: { $gte: monthAgo } }),
      Report.countDocuments({ 
        createdAt: { $gte: monthAgo },
        status: 'resolved'
      }),
      Report.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Report.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: 'reportedBy',
            foreignField: '_id',
            as: 'reporter'
          }
        },
        { $unwind: '$reporter' },
        {
          $project: {
            title: 1,
            status: 1,
            createdAt: 1,
            'reporter.name': 1
          }
        }
      ])
    ]);
    
    const dashboardStats = {
      overview: {
        totalReports,
        reportsToday,
        reportsThisWeek,
        reportsThisMonth,
        resolutionRate: reportsThisMonth > 0 
          ? ((resolvedThisMonth / reportsThisMonth) * 100).toFixed(2) 
          : 0
      },
      topCategories,
      recentActivity,
      timestamp: new Date()
    };
    
    ResponseHandler.success(res, dashboardStats, 'Dashboard stats fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get category statistics
// @route   GET /api/analytics/categories
// @access  Private
exports.getCategoryStats = async (req, res) => {
  try {
    const categoryStats = await Report.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          resolved: 1,
          pending: 1,
          inProgress: 1,
          resolutionRate: {
            $multiply: [
              { $divide: ['$resolved', '$total'] },
              100
            ]
          }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    ResponseHandler.success(res, categoryStats, 'Category stats fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get performance metrics
// @route   GET /api/analytics/performance
// @access  Private
exports.getPerformanceMetrics = async (req, res) => {
  try {
    const { workerId } = req.query;
    
    const filter = {};
    if (workerId) {
      filter.assignedTo = workerId;
    }
    
    const performance = await Report.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$assignedTo',
          totalAssigned: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          avgCompletionTime: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'resolved'] },
                { $subtract: ['$resolvedAt', '$createdAt'] },
                null
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'worker'
        }
      },
      { $unwind: { path: '$worker', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          workerName: '$worker.name',
          workerEmail: '$worker.email',
          totalAssigned: 1,
          completed: 1,
          completionRate: {
            $multiply: [
              { $divide: ['$completed', '$totalAssigned'] },
              100
            ]
          },
          avgCompletionTimeDays: {
            $divide: ['$avgCompletionTime', 1000 * 60 * 60 * 24]
          }
        }
      }
    ]);
    
    ResponseHandler.success(res, performance, 'Performance metrics fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};