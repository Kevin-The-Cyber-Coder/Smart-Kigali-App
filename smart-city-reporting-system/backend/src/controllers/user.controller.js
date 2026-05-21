const User = require('../models/User');
const Report = require('../models/Report');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ResponseHandler = require('../utils/responseHandler');
const notificationService = require('../services/notification.service');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('notifications');
    
    if (!user) {
      return ResponseHandler.error(res, 'User not found', 404);
    }
    
    ResponseHandler.success(res, user, 'Profile fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const updates = ['name', 'phone', 'address'];
    const updateData = {};
    
    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    // Handle nested address object
    if (req.body.address) {
      updateData.address = {
        street: req.body.address.street || req.user.address?.street,
        city: req.body.address.city || req.user.address?.city,
        district: req.body.address.district || req.user.address?.district,
        pincode: req.body.address.pincode || req.user.address?.pincode
      };
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    ResponseHandler.success(res, user, 'Profile updated successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
exports.deleteUserAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Verify password before deletion
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return ResponseHandler.error(res, 'Invalid password', 401);
    }
    
    // Delete all user's reports
    await Report.deleteMany({ reportedBy: req.user.id });
    
    // Delete user
    await User.findByIdAndDelete(req.user.id);
    
    ResponseHandler.success(res, null, 'Account deleted successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get current user's reports
// @route   GET /api/users/reports
// @access  Private
exports.getUserReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { reportedBy: req.user.id };
    if (status) filter.status = status;
    
    const reports = await Report.find(filter)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('assignedTo', 'name email');
    
    const total = await Report.countDocuments(filter);
    
    ResponseHandler.paginated(res, reports, page, limit, total);
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments({ reportedBy: req.user.id });
    const resolvedReports = await Report.countDocuments({ 
      reportedBy: req.user.id, 
      status: 'resolved' 
    });
    const pendingReports = await Report.countDocuments({ 
      reportedBy: req.user.id, 
      status: 'pending' 
    });
    const inProgressReports = await Report.countDocuments({ 
      reportedBy: req.user.id, 
      status: 'in-progress' 
    });
    
    // Get reports by category
    const reportsByCategory = await Report.aggregate([
      { $match: { reportedBy: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Get monthly activity
    const last6Months = await Report.aggregate([
      { $match: { reportedBy: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);
    
    const stats = {
      totalReports,
      resolvedReports,
      pendingReports,
      inProgressReports,
      resolutionRate: totalReports > 0 ? ((resolvedReports / totalReports) * 100).toFixed(2) : 0,
      reportsByCategory,
      monthlyActivity: last6Months,
      memberSince: req.user.createdAt
    };
    
    ResponseHandler.success(res, stats);
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
exports.getUserNotifications = async (req, res) => {
  try {
    const { unreadOnly = false, page = 1, limit = 20 } = req.query;
    
    let notifications = req.user.notifications || [];
    
    if (unreadOnly === 'true') {
      notifications = notifications.filter(n => !n.read);
    }
    
    // Sort by newest first
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Paginate
    const start = (page - 1) * limit;
    const paginated = notifications.slice(start, start + limit);
    
    res.json({
      success: true,
      data: paginated,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: notifications.length,
        pages: Math.ceil(notifications.length / limit)
      }
    });
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
// @access  Private
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    
    const notification = req.user.notifications.id(notificationId);
    if (!notification) {
      return ResponseHandler.error(res, 'Notification not found', 404);
    }
    
    notification.read = true;
    await req.user.save();
    
    ResponseHandler.success(res, notification, 'Notification marked as read');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    const { theme, language, notifications, privacy } = req.body;
    
    if (theme) req.user.preferences.theme = theme;
    if (language) req.user.preferences.language = language;
    
    if (notifications) {
      if (notifications.email !== undefined) req.user.preferences.notifications.email = notifications.email;
      if (notifications.push !== undefined) req.user.preferences.notifications.push = notifications.push;
      if (notifications.sms !== undefined) req.user.preferences.notifications.sms = notifications.sms;
    }
    
    if (privacy) {
      if (privacy.showLocation !== undefined) req.user.preferences.privacy.showLocation = privacy.showLocation;
      if (privacy.analytics !== undefined) req.user.preferences.privacy.analytics = privacy.analytics;
    }
    
    await req.user.save();
    
    ResponseHandler.success(res, req.user.preferences, 'Preferences updated successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get users by role (Admin only)
// @route   GET /api/users/all OR /api/users/role/:role
// @access  Private/Admin
exports.getUsersByRole = async (req, res) => {
  try {
    const role = req.params.role;
    const { page = 1, limit = 20, search } = req.query;
    
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');
    
    const total = await User.countDocuments(filter);
    
    ResponseHandler.paginated(res, users, page, limit, total);
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get user activity log
// @route   GET /api/users/activity
// @access  Private
exports.getActivityLog = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    // Get recent reports
    const recentReports = await Report.find({ reportedBy: req.user.id })
      .sort('-createdAt')
      .limit(limit)
      .select('title status createdAt updatedAt');
    
    // Get recent comments
    const reportsWithComments = await Report.find({
      'comments.user': req.user.id
    })
      .sort('-updatedAt')
      .limit(limit)
      .select('title comments');
    
    const comments = reportsWithComments.flatMap(report => 
      report.comments
        .filter(c => c.user.toString() === req.user.id.toString())
        .map(c => ({
          type: 'comment',
          reportTitle: report.title,
          comment: c.text,
          createdAt: c.createdAt
        }))
    );
    
    // Combine and sort activities
    const activities = [
      ...recentReports.map(r => ({
        type: 'report',
        title: r.title,
        status: r.status,
        createdAt: r.createdAt
      })),
      ...comments
    ];
    
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    ResponseHandler.success(res, activities.slice(0, limit));
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Change email address
// @route   PUT /api/users/email
// @access  Private
exports.changeEmail = async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    
    // Verify password
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return ResponseHandler.error(res, 'Invalid password', 401);
    }
    
    // Check if email is already taken
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return ResponseHandler.error(res, 'Email already in use', 400);
    }
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    user.email = newEmail;
    user.emailVerified = false;
    user.emailVerificationToken = verificationToken;
    await user.save();
    
    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/api/users/verify-email/${verificationToken}`;
    await notificationService.sendEmail(
      newEmail,
      'Verify Your New Email Address',
      `<p>Please click <a href="${verificationLink}">here</a> to verify your new email address.</p>`
    );
    
    ResponseHandler.success(res, null, 'Verification email sent to new address');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Verify email address
// @route   GET /api/users/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return ResponseHandler.error(res, 'Invalid or expired verification token', 400);
    }
    
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: 'Email verified successfully. You can now login.'
    });
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Deactivate user account
// @route   POST /api/users/deactivate
// @access  Private
exports.deactivateAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return ResponseHandler.error(res, 'Invalid password', 401);
    }
    
    user.isActive = false;
    user.deactivatedAt = new Date();
    await user.save();
    
    ResponseHandler.success(res, null, 'Account deactivated successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Reactivate user account
// @route   POST /api/users/reactivate
// @access  Private
exports.reactivateAccount = async (req, res) => {
  try {
    req.user.isActive = true;
    req.user.deactivatedAt = undefined;
    await req.user.save();
    
    ResponseHandler.success(res, null, 'Account reactivated successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Request password reset
// @route   POST /api/users/reset-password/request
// @access  Public
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return ResponseHandler.success(res, null, 'If an account exists, a reset link has been sent');
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await notificationService.sendEmail(
      email,
      'Password Reset Request',
      `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`
    );
    
    ResponseHandler.success(res, null, 'If an account exists, a reset link has been sent');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Reset password with token
// @route   POST /api/users/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return ResponseHandler.error(res, 'Invalid or expired reset token', 400);
    }
    
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    ResponseHandler.success(res, null, 'Password reset successfully. Please login with your new password.');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile/picture
// @access  Private
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return ResponseHandler.error(res, 'No file uploaded', 400);
    }
    
    // In production, upload to Cloudinary or similar service
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    req.user.avatar = avatarUrl;
    await req.user.save();
    
    ResponseHandler.success(res, { avatar: avatarUrl }, 'Profile picture updated');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};
// Add this function to user.controller.js

// @desc    Mark all notifications as read
// @route   PUT /api/users/notifications/read-all
// @access  Private
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    req.user.notifications.forEach(notification => {
      notification.read = true;
    });
    await req.user.save();
    
    ResponseHandler.success(res, null, 'All notifications marked as read');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};