const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    shortDescription: {
      type: String,
      default: ''
    },
    fullDescription: {
      type: String,
      default: ''
    },
    productType: {
      type: String,
      enum: ['SOFTWARE', 'HARDWARE'],
      default: 'HARDWARE'
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    heroContent: {
      type: String,
      default: ''
    },
    features: [
      {
        title: String,
        description: String,
        icon: String
      }
    ],
    applications: [String],
    specifications: [
      {
        groupName: String,
        specKey: String,
        specValue: String,
        unit: String
      }
    ],
    integrations: [String],
    heroImage: {
      type: String,
      default: ''
    },
    gallery: [String],
    brochure: {
      type: String,
      default: ''
    },
    datasheet: {
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
      default: 'DRAFT'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
