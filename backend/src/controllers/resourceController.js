const Resource = require('../models/Resource');
const slugify = require('slugify');
const { logActivity } = require('../utils/logger');

const makeSlug = (text) => slugify(text || '', { lower: true, strict: true });

exports.getResources = async (req, res, next) => {
  try {
    const { type, search, status } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(query).sort({ publishDate: -1, createdAt: -1 });
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

exports.createResource = async (req, res, next) => {
  try {
    let { title, slug, type, description, content, thumbnail, file, author, publishDate, status, featured, seoTitle, metaDescription } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Resource title is required' });

    slug = makeSlug(slug || title);
    const existing = await Resource.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const resource = await Resource.create({
      title,
      slug,
      type: type || 'ARTICLE',
      description,
      content,
      thumbnail,
      file,
      author: author || 'Vtest Editorial',
      publishDate: publishDate || new Date(),
      status: status || 'PUBLISHED',
      featured: Boolean(featured),
      seoTitle: seoTitle || title,
      metaDescription
    });

    await logActivity(req.user._id, 'CREATE', 'RESOURCE', `Created resource: ${title} (${type})`, req.ip);
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

exports.updateResource = async (req, res, next) => {
  try {
    let resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    if (req.body.title && !req.body.slug) req.body.slug = makeSlug(req.body.title);
    else if (req.body.slug) req.body.slug = makeSlug(req.body.slug);

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await logActivity(req.user._id, 'UPDATE', 'RESOURCE', `Updated resource: ${resource.title}`, req.ip);

    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    await resource.deleteOne();
    await logActivity(req.user._id, 'DELETE', 'RESOURCE', `Deleted resource: ${resource.title}`, req.ip);

    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    next(error);
  }
};
