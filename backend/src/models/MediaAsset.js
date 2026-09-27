const mongoose = require('mongoose');

const mediaAssetSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    altText: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      default: ''
    },
    storageType: {
      type: String,
      enum: ['LOCAL', 'CLOUDINARY', 'S3'],
      default: 'LOCAL'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MediaAsset', mediaAssetSchema);
