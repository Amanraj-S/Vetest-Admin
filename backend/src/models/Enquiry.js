const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: ''
    },
    company: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    },
    enquiryType: {
      type: String,
      default: 'General Inquiry'
    },
    message: {
      type: String,
      required: [true, 'Message is required']
    },
    source: {
      type: String,
      default: 'Website'
    },
    status: {
      type: String,
      enum: ['NEW', 'IN_PROGRESS', 'CONTACTED', 'CLOSED'],
      default: 'NEW'
    },
    internalNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
