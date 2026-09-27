const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Solution name is required'],
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
    features: [String],
    benefits: [String],
    applications: [String],
    cta: {
      text: { type: String, default: 'Request Demo' },
      link: { type: String, default: '/contact' }
    },
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

module.exports = mongoose.model('Solution', solutionSchema);
