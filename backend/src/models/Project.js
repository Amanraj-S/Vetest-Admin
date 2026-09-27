const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    clientName: {
      type: String,
      default: 'Confidential OEM Client'
    },
    industry: {
      type: String,
      default: 'Automotive Inspection'
    },
    location: {
      type: String,
      default: ''
    },
    summary: {
      type: String,
      default: ''
    },
    challenge: {
      type: String,
      default: ''
    },
    solution: {
      type: String,
      default: ''
    },
    implementation: {
      type: String,
      default: ''
    },
    results: [String],
    technologies: [String],
    heroImage: {
      type: String,
      default: ''
    },
    pdfUrl: {
      type: String,
      default: ''
    },
    gallery: [String],
    documents: [String],
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

module.exports = mongoose.model('Project', projectSchema);
