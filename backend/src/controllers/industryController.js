const Industry = require('../models/Industry');
const slugify = require('slugify');
const { logActivity } = require('../utils/logger');

const makeSlug = (text) => slugify(text || '', { lower: true, strict: true });

exports.getIndustries = async (req, res, next) => {
  try {
    const industries = await Industry.find().populate('relatedProducts', 'name slug heroImage').sort({ createdAt: -1 });
    res.json({ success: true, count: industries.length, data: industries });
  } catch (error) {
    next(error);
  }
};

exports.getIndustryById = async (req, res, next) => {
  try {
    const industry = await Industry.findById(req.params.id).populate('relatedProducts');
    if (!industry) return res.status(404).json({ success: false, message: 'Industry not found' });
    res.json({ success: true, data: industry });
  } catch (error) {
    next(error);
  }
};

exports.createIndustry = async (req, res, next) => {
  try {
    let { industryName, slug, description, heroImage, applications, benefits, relatedProducts, status, seoTitle, metaDescription } = req.body;
    if (!industryName) return res.status(400).json({ success: false, message: 'Industry name is required' });

    slug = makeSlug(slug || industryName);
    const existing = await Industry.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const industry = await Industry.create({
      industryName,
      slug,
      description,
      heroImage,
      applications: Array.isArray(applications) ? applications : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      relatedProducts: Array.isArray(relatedProducts) ? relatedProducts : [],
      status: status || 'PUBLISHED',
      seoTitle: seoTitle || industryName,
      metaDescription
    });

    await logActivity(req.user._id, 'CREATE', 'INDUSTRY', `Created industry: ${industryName}`, req.ip);
    res.status(201).json({ success: true, data: industry });
  } catch (error) {
    next(error);
  }
};

exports.updateIndustry = async (req, res, next) => {
  try {
    let industry = await Industry.findById(req.params.id);
    if (!industry) return res.status(404).json({ success: false, message: 'Industry not found' });

    if (req.body.industryName && !req.body.slug) req.body.slug = makeSlug(req.body.industryName);
    else if (req.body.slug) req.body.slug = makeSlug(req.body.slug);

    industry = await Industry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await logActivity(req.user._id, 'UPDATE', 'INDUSTRY', `Updated industry: ${industry.industryName}`, req.ip);

    res.json({ success: true, data: industry });
  } catch (error) {
    next(error);
  }
};

exports.deleteIndustry = async (req, res, next) => {
  try {
    const industry = await Industry.findById(req.params.id);
    if (!industry) return res.status(404).json({ success: false, message: 'Industry not found' });

    await industry.deleteOne();
    await logActivity(req.user._id, 'DELETE', 'INDUSTRY', `Deleted industry: ${industry.industryName}`, req.ip);

    res.json({ success: true, message: 'Industry deleted' });
  } catch (error) {
    next(error);
  }
};
