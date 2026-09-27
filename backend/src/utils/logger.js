const AdminActivityLog = require('../models/AdminActivityLog');

const logActivity = async (userId, action, moduleName, details = '', ipAddress = '') => {
  try {
    if (!userId) return;
    await AdminActivityLog.create({
      user: userId,
      action,
      module: moduleName,
      details,
      ipAddress
    });
  } catch (err) {
    console.error('Failed to log admin activity:', err.message);
  }
};

module.exports = { logActivity };
