const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['PUBLISHED', 'DRAFT', 'UNPUBLISHED'],
      default: 'PUBLISHED'
    },
    displayOrder: {
      type: Number,
      default: 0
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

module.exports = mongoose.model('Category', categorySchema);
