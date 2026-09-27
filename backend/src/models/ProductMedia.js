const mongoose = require('mongoose');

const productMediaSchema = new mongoose.Schema(
  {
    mediaType: { type: String, enum: ['IMAGE', 'BROCHURE', 'DATASHEET', 'VIDEO', 'DOCUMENT'], default: 'IMAGE' },
    url: { type: String, required: true },
    title: { type: String, default: '' },
    altText: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false }
  },
  { _id: true, timestamps: true }
);

module.exports = mongoose.model('ProductMedia', productMediaSchema);
