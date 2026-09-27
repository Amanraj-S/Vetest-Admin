const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'global_settings',
      unique: true
    },
    general: {
      siteName: { type: String, default: 'Vtest Vehicle Inspection Systems' },
      logo: { type: String, default: '' },
      favicon: { type: String, default: '' },
      tagline: { type: String, default: 'Smart Vehicle Inspection & Compliance Platform' },
      copyrightText: { type: String, default: '© 2026 Vtest Technologies. All rights reserved.' }
    },
    seo: {
      defaultSeoTitle: { type: String, default: 'Vtest | Smart Vehicle Inspection & Compliance Solutions' },
      defaultMetaDescription: { type: String, default: 'End-to-end periodic, compliance-based, and line-end vehicle safety inspection management system.' },
      metaKeywords: { type: String, default: 'vehicle inspection, automotive testing, IoT, automation, computer vision' },
      googleAnalyticsId: { type: String, default: '' }
    },
    contact: {
      email: { type: String, default: 'contact@vtest.local' },
      phone: { type: String, default: '+1 (800) 555-VTEST' },
      address: { type: String, default: '100 Automotive Tech Way, Suite 400, Detroit, MI' },
      workingHours: { type: String, default: 'Mon - Fri: 8:00 AM - 6:00 PM EST' }
    },
    socialMedia: {
      linkedin: { type: String, default: 'https://linkedin.com/company/vtest' },
      twitter: { type: String, default: 'https://twitter.com/vtest_tech' },
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' }
    },
    storage: {
      activeDriver: { type: String, enum: ['LOCAL', 'CLOUDINARY', 'S3'], default: 'LOCAL' },
      maxUploadSizeBytes: { type: Number, default: 10485760 } // 10MB
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
