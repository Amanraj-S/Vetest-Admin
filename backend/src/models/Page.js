const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      required: [true, 'Page name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    heroImage: {
      type: String,
      default: ''
    },
    seoTitle: {
      type: String,
      default: ''
    },
    metaDescription: {
      type: String,
      default: ''
    },
    socialImage: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'],
      default: 'PUBLISHED'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Page', pageSchema);
