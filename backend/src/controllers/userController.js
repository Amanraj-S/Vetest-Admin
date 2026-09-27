const AdminUser = require('../models/AdminUser');
const { logActivity } = require('../utils/logger');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await AdminUser.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existing = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await AdminUser.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'ADMIN',
      status: status || 'ACTIVE'
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    await logActivity(req.user._id, 'CREATE', 'USER', `Created admin user: ${user.email} (${user.role})`, req.ip);

    res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, role, status, password } = req.body;
    const user = await AdminUser.findById(req.params.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Protect SUPER_ADMIN from demotion or deactivation
    if (user.role === 'SUPER_ADMIN') {
      if (role && role !== 'SUPER_ADMIN') {
        return res.status(400).json({ success: false, message: 'Cannot demote a SUPER_ADMIN account' });
      }
      if (status && status !== 'ACTIVE') {
        return res.status(400).json({ success: false, message: 'SUPER_ADMIN accounts must remain ACTIVE' });
      }
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (status) user.status = status;
    if (password) user.password = password; // Will be hashed by pre-save hook

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    await logActivity(req.user._id, 'UPDATE', 'USER', `Updated user: ${user.email}`, req.ip);

    res.json({ success: true, data: userResponse });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin user account' });
    }

    if (user.role === 'SUPER_ADMIN') {
      return res.status(400).json({ success: false, message: 'Primary SUPER_ADMIN accounts cannot be deleted' });
    }

    await user.deleteOne();
    await logActivity(req.user._id, 'DELETE', 'USER', `Deleted user: ${user.email}`, req.ip);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
