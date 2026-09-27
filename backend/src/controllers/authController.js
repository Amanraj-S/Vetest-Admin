const AdminUser = require('../models/AdminUser');
const jwt = require('jsonwebtoken');
const { logActivity } = require('../utils/logger');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'vtest_jwt_secret_key_987654321_secure_dev', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await AdminUser.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: 'Your account is currently inactive. Contact administrator.' });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    // Set HTTP-Only Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    await logActivity(user._id, 'LOGIN', 'AUTH', `User logged in from ${req.ip}`, req.ip);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      await logActivity(req.user._id, 'LOGOUT', 'AUTH', 'User logged out', req.ip);
    }
    res.cookie('token', 'none', {
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 1000)
    });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await AdminUser.findById(req.user.id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const user = await AdminUser.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    await logActivity(req.user.id, 'CHANGE_PASSWORD', 'AUTH', 'Password updated successfully', req.ip);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
