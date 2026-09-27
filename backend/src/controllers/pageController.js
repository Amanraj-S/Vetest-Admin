const Page = require('../models/Page');
const slugify = require('slugify');
const { logActivity } = require('../utils/logger');

const makeSlug = (text) => slugify(text || '', { lower: true, strict: true });

exports.getPages = async (req, res, next) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json({ success: true, count: pages.length, data: pages });
  } catch (error) {
    next(error);
  }
};

exports.getPageById = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

exports.createPage = async (req, res, next) => {
  try {
    let { pageName, slug, title, subtitle, content, heroImage, seoTitle, metaDescription, socialImage, status } = req.body;
    if (!pageName || !title) return res.status(400).json({ success: false, message: 'Page name and title are required' });

    slug = makeSlug(slug || pageName);
    const existing = await Page.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const page = await Page.create({
      pageName,
      slug,
      title,
      subtitle,
      content,
      heroImage,
      seoTitle: seoTitle || title,
      metaDescription,
      socialImage,
      status: status || 'PUBLISHED'
    });

    await logActivity(req.user._id, 'CREATE', 'PAGE', `Created page: ${pageName}`, req.ip);
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

exports.updatePage = async (req, res, next) => {
  try {
    let page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });

    if (req.body.pageName && !req.body.slug) req.body.slug = makeSlug(req.body.pageName);
    else if (req.body.slug) req.body.slug = makeSlug(req.body.slug);

    page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await logActivity(req.user._id, 'UPDATE', 'PAGE', `Updated page: ${page.pageName}`, req.ip);

    res.json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

exports.deletePage = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });

    await page.deleteOne();
    await logActivity(req.user._id, 'DELETE', 'PAGE', `Deleted page: ${page.pageName}`, req.ip);

    res.json({ success: true, message: 'Page deleted' });
  } catch (error) {
    next(error);
  }
};
