const mongoose = require('mongoose');

const productFeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 }
  },
  { _id: true, timestamps: true }
);

module.exports = mongoose.model('ProductFeature', productFeatureSchema);
