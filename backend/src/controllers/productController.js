const Product = require('../models/Product');
const slugify = require('slugify');
const { logActivity } = require('../utils/logger');

// Helper to generate slug
const makeSlug = (text) => slugify(text || '', { lower: true, strict: true });

// @desc    Get all products (Admin - search, filter, pagination)
// @route   GET /api/admin/products
// @access  Private
exports.getAdminProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, category, status, productType } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (status) query.status = status;
    if (productType) query.productType = productType;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID (Admin)
// @route   GET /api/admin/products/:id
// @access  Private
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private
exports.createProduct = async (req, res, next) => {
  try {
    let { name, slug, shortDescription, fullDescription, productType, category, heroContent, features, applications, specifications, integrations, heroImage, gallery, brochure, datasheet, seoTitle, metaDescription, socialImage, status } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Product name and category are required' });
    }

    if (!slug) {
      slug = makeSlug(name);
    } else {
      slug = makeSlug(slug);
    }

    // Check slug uniqueness
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await Product.create({
      name,
      slug,
      shortDescription,
      fullDescription,
      productType: productType || 'HARDWARE',
      category,
      heroContent,
      features: Array.isArray(features) ? features : [],
      applications: Array.isArray(applications) ? applications : [],
      specifications: Array.isArray(specifications) ? specifications : [],
      integrations: Array.isArray(integrations) ? integrations : [],
      heroImage: heroImage || '',
      gallery: Array.isArray(gallery) ? gallery : [],
      brochure: brochure || '',
      datasheet: datasheet || '',
      seoTitle: seoTitle || name,
      metaDescription: metaDescription || shortDescription,
      socialImage: socialImage || heroImage,
      status: status || 'DRAFT'
    });

    await logActivity(req.user._id, 'CREATE', 'PRODUCT', `Created product: ${product.name} (${product._id})`, req.ip);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PATCH /api/admin/products/:id
// @access  Private
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.body.name && !req.body.slug) {
      req.body.slug = makeSlug(req.body.name);
    } else if (req.body.slug) {
      req.body.slug = makeSlug(req.body.slug);
    }

    // Ensure slug uniqueness if changed
    if (req.body.slug && req.body.slug !== product.slug) {
      const existingSlug = await Product.findOne({ slug: req.body.slug, _id: { $ne: product._id } });
      if (existingSlug) {
        return res.status(400).json({ success: false, message: 'Slug already exists. Please choose another slug.' });
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug');

    await logActivity(req.user._id, 'UPDATE', 'PRODUCT', `Updated product: ${product.name} (${product._id})`, req.ip);

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private (SUPER_ADMIN or ADMIN)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();

    await logActivity(req.user._id, 'DELETE', 'PRODUCT', `Deleted product: ${product.name} (${product._id})`, req.ip);

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish product
// @route   POST /api/admin/products/:id/publish
// @access  Private
exports.publishProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { status: 'PUBLISHED' }, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await logActivity(req.user._id, 'PUBLISH', 'PRODUCT', `Published product: ${product.name}`, req.ip);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Unpublish product
// @route   POST /api/admin/products/:id/unpublish
// @access  Private
exports.unpublishProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { status: 'UNPUBLISHED' }, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await logActivity(req.user._id, 'UNPUBLISH', 'PRODUCT', `Unpublished product: ${product.name}`, req.ip);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};
