const mongoose = require('mongoose');

const productSpecificationSchema = new mongoose.Schema(
  {
    groupName: { type: String, default: 'General' },
    specKey: { type: String, required: true },
    specValue: { type: String, required: true },
    unit: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 }
  },
  { _id: true, timestamps: true }
);

module.exports = mongoose.model('ProductSpecification', productSpecificationSchema);
