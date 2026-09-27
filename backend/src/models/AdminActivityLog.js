const mongoose = require('mongoose');

const adminActivityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true
    },
    action: {
      type: String,
      required: true
    },
    module: {
      type: String,
      required: true
    },
    details: {
      type: String,
      default: ''
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AdminActivityLog', adminActivityLogSchema);
