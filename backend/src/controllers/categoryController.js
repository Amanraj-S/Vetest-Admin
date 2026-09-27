const Category = require('../models/Category');
const slugify = require('slugify');
const { logActivity } = require('../utils/logger');

const makeSlug = (text) => slugify(text || '', { lower: true, strict: true });

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    let { name, slug, description, image, status, displayOrder, seoTitle, metaDescription } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });

    slug = makeSlug(slug || name);
    const existing = await Category.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      status: status || 'PUBLISHED',
      displayOrder: displayOrder || 0,
      seoTitle: seoTitle || name,
      metaDescription
    });

    await logActivity(req.user._id, 'CREATE', 'CATEGORY', `Created category: ${name}`, req.ip);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    if (req.body.name && !req.body.slug) req.body.slug = makeSlug(req.body.name);
    else if (req.body.slug) req.body.slug = makeSlug(req.body.slug);

    if (req.body.slug && req.body.slug !== category.slug) {
      const existing = await Category.findOne({ slug: req.body.slug, _id: { $ne: category._id } });
      if (existing) return res.status(400).json({ success: false, message: 'Slug already in use' });
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await logActivity(req.user._id, 'UPDATE', 'CATEGORY', `Updated category: ${category.name}`, req.ip);

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await category.deleteOne();
    await logActivity(req.user._id, 'DELETE', 'CATEGORY', `Deleted category: ${category.name}`, req.ip);

    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
