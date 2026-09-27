const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema(
  {
    industryName: {
      type: String,
      required: [true, 'Industry name is required'],
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
    heroImage: {
      type: String,
      default: ''
    },
    applications: [String],
    benefits: [String],
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'],
      default: 'PUBLISHED'
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

module.exports = mongoose.model('Industry', industrySchema);
