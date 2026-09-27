const SiteSetting = require('../models/SiteSetting');
const { logActivity } = require('../utils/logger');

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSetting.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = await SiteSetting.create({ key: 'global_settings' });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const { general, seo, contact, socialMedia, storage } = req.body;
    let settings = await SiteSetting.findOne({ key: 'global_settings' });

    if (!settings) {
      settings = new SiteSetting({ key: 'global_settings' });
    }

    if (general) settings.general = { ...settings.general.toObject(), ...general };
    if (seo) settings.seo = { ...settings.seo.toObject(), ...seo };
    if (contact) settings.contact = { ...settings.contact.toObject(), ...contact };
    if (socialMedia) settings.socialMedia = { ...settings.socialMedia.toObject(), ...socialMedia };
    if (storage) settings.storage = { ...settings.storage.toObject(), ...storage };

    await settings.save();
    await logActivity(req.user._id, 'UPDATE', 'SETTINGS', 'Updated site global settings', req.ip);

    res.json({ success: true, message: 'Settings saved successfully', data: settings });
  } catch (error) {
    next(error);
  }
};
