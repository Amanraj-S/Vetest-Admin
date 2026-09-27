const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['WHITEPAPER', 'BROCHURE'],
      default: 'WHITEPAPER'
    },
    description: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    thumbnail: {
      type: String,
      default: ''
    },
    file: {
      type: String,
      default: ''
    },
    author: {
      type: String,
      default: 'Vtest Editorial Team'
    },
    publishDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'],
      default: 'PUBLISHED'
    },
    featured: {
      type: Boolean,
      default: false
    },
    seoTitle: {
      type: String,
      default: ''
    },
    metaDescription: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Resource', resourceSchema);
