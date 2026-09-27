const Technology = require('../models/Technology');
const slugify = require('slugify');
const { logActivity } = require('../utils/logger');

const makeSlug = (text) => slugify(text || '', { lower: true, strict: true });

exports.getTechnologies = async (req, res, next) => {
  try {
    const tech = await Technology.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, count: tech.length, data: tech });
  } catch (error) {
    next(error);
  }
};

exports.getTechnologyById = async (req, res, next) => {
  try {
    const tech = await Technology.findById(req.params.id);
    if (!tech) return res.status(404).json({ success: false, message: 'Technology not found' });
    res.json({ success: true, data: tech });
  } catch (error) {
    next(error);
  }
};

exports.createTechnology = async (req, res, next) => {
  try {
    let { technologyName, slug, description, technologyCategory, image, icon, features, applications, status, displayOrder, seoTitle, metaDescription } = req.body;
    if (!technologyName) return res.status(400).json({ success: false, message: 'Technology name is required' });

    slug = makeSlug(slug || technologyName);
    const existing = await Technology.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const tech = await Technology.create({
      technologyName,
      slug,
      description,
      technologyCategory: technologyCategory || 'General',
      image,
      icon,
      features: Array.isArray(features) ? features : [],
      applications: Array.isArray(applications) ? applications : [],
      status: status || 'PUBLISHED',
      displayOrder: displayOrder || 0,
      seoTitle: seoTitle || technologyName,
      metaDescription
    });

    await logActivity(req.user._id, 'CREATE', 'TECHNOLOGY', `Created technology: ${technologyName}`, req.ip);
    res.status(201).json({ success: true, data: tech });
  } catch (error) {
    next(error);
  }
};

exports.updateTechnology = async (req, res, next) => {
  try {
    let tech = await Technology.findById(req.params.id);
    if (!tech) return res.status(404).json({ success: false, message: 'Technology not found' });

    if (req.body.technologyName && !req.body.slug) req.body.slug = makeSlug(req.body.technologyName);
    else if (req.body.slug) req.body.slug = makeSlug(req.body.slug);

    tech = await Technology.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await logActivity(req.user._id, 'UPDATE', 'TECHNOLOGY', `Updated technology: ${tech.technologyName}`, req.ip);

    res.json({ success: true, data: tech });
  } catch (error) {
    next(error);
  }
};

exports.deleteTechnology = async (req, res, next) => {
  try {
    const tech = await Technology.findById(req.params.id);
    if (!tech) return res.status(404).json({ success: false, message: 'Technology not found' });

    await tech.deleteOne();
    await logActivity(req.user._id, 'DELETE', 'TECHNOLOGY', `Deleted technology: ${tech.technologyName}`, req.ip);

    res.json({ success: true, message: 'Technology deleted' });
  } catch (error) {
    next(error);
  }
};
