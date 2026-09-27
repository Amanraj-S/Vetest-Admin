const Solution = require('../models/Solution');
const slugify = require('slugify');
const { logActivity } = require('../utils/logger');

const makeSlug = (text) => slugify(text || '', { lower: true, strict: true });

exports.getSolutions = async (req, res, next) => {
  try {
    const solutions = await Solution.find().sort({ createdAt: -1 });
    res.json({ success: true, count: solutions.length, data: solutions });
  } catch (error) {
    next(error);
  }
};

exports.getSolutionById = async (req, res, next) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found' });
    res.json({ success: true, data: solution });
  } catch (error) {
    next(error);
  }
};

exports.createSolution = async (req, res, next) => {
  try {
    let { name, slug, description, heroImage, features, benefits, applications, cta, status, seoTitle, metaDescription } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Solution name is required' });

    slug = makeSlug(slug || name);
    const existing = await Solution.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const solution = await Solution.create({
      name,
      slug,
      description,
      heroImage,
      features: Array.isArray(features) ? features : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      applications: Array.isArray(applications) ? applications : [],
      cta,
      status: status || 'PUBLISHED',
      seoTitle: seoTitle || name,
      metaDescription
    });

    await logActivity(req.user._id, 'CREATE', 'SOLUTION', `Created solution: ${name}`, req.ip);
    res.status(201).json({ success: true, data: solution });
  } catch (error) {
    next(error);
  }
};

exports.updateSolution = async (req, res, next) => {
  try {
    let solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found' });

    if (req.body.name && !req.body.slug) req.body.slug = makeSlug(req.body.name);
    else if (req.body.slug) req.body.slug = makeSlug(req.body.slug);

    solution = await Solution.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await logActivity(req.user._id, 'UPDATE', 'SOLUTION', `Updated solution: ${solution.name}`, req.ip);

    res.json({ success: true, data: solution });
  } catch (error) {
    next(error);
  }
};

exports.deleteSolution = async (req, res, next) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found' });

    await solution.deleteOne();
    await logActivity(req.user._id, 'DELETE', 'SOLUTION', `Deleted solution: ${solution.name}`, req.ip);

    res.json({ success: true, message: 'Solution deleted' });
  } catch (error) {
    next(error);
  }
};
