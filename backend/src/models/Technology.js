const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema(
  {
    technologyName: {
      type: String,
      required: [true, 'Technology name is required'],
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
    technologyCategory: {
      type: String,
      default: 'General'
    },
    image: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    features: [String],
    applications: [String],
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'],
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

module.exports = mongoose.model('Technology', technologySchema);
