const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const ResponseHandler = require('../utils/responseHandler');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 'Validation error', 400, errors.array());
    }

    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ResponseHandler.error(res, 'User already exists with this email', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      lastLogin: new Date()
    });

    // Generate token
    const token = generateToken(user._id);

    ResponseHandler.success(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    }, 'Registration successful', 201);
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 'Validation error', 400, errors.array());
    }

    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return ResponseHandler.error(res, 'Invalid credentials', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ResponseHandler.error(res, 'Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return ResponseHandler.error(res, 'Your account has been deactivated. Please contact support.', 401);
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user._id);

    ResponseHandler.success(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences
      }
    }, 'Login successful');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return ResponseHandler.error(res, 'User not found', 404);
    }
    ResponseHandler.success(res, user, 'Profile fetched successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'address'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    ResponseHandler.success(res, user, 'Profile updated successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return ResponseHandler.error(res, 'Current password and new password are required', 400);
    }
    
    if (newPassword.length < 6) {
      return ResponseHandler.error(res, 'New password must be at least 6 characters', 400);
    }
    
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return ResponseHandler.error(res, 'Current password is incorrect', 401);
    }
    
    user.password = newPassword;
    await user.save();
    
    ResponseHandler.success(res, null, 'Password changed successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // This endpoint exists for consistency
    ResponseHandler.success(res, null, 'Logged out successfully');
  } catch (error) {
    ResponseHandler.error(res, error.message);
  }
};