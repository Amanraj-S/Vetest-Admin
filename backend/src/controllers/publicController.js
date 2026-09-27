const Product = require('../models/Product');
const Category = require('../models/Category');
const Solution = require('../models/Solution');
const Industry = require('../models/Industry');
const Technology = require('../models/Technology');
const Project = require('../models/Project');
const Resource = require('../models/Resource');
const Page = require('../models/Page');

// @desc Get public published products
exports.getPublicProducts = async (req, res, next) => {
  try {
    const { category, type, search } = req.query;
    const query = { status: 'PUBLISHED' };

    if (category) query.category = category;
    if (type) query.productType = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc Get single public published product by slug
exports.getPublicProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: 'PUBLISHED' }).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Published product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc Get public categories
exports.getPublicCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ status: 'PUBLISHED' }).sort({ displayOrder: 1 });
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc Get public solutions
exports.getPublicSolutions = async (req, res, next) => {
  try {
    const solutions = await Solution.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 });
    res.json({ success: true, count: solutions.length, data: solutions });
  } catch (error) {
    next(error);
  }
};

exports.getPublicSolutionBySlug = async (req, res, next) => {
  try {
    const solution = await Solution.findOne({ slug: req.params.slug, status: 'PUBLISHED' });
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found' });
    res.json({ success: true, data: solution });
  } catch (error) {
    next(error);
  }
};

// @desc Get public industries
exports.getPublicIndustries = async (req, res, next) => {
  try {
    const industries = await Industry.find({ status: 'PUBLISHED' }).populate('relatedProducts', 'name slug heroImage').sort({ createdAt: -1 });
    res.json({ success: true, count: industries.length, data: industries });
  } catch (error) {
    next(error);
  }
};

exports.getPublicIndustryBySlug = async (req, res, next) => {
  try {
    const industry = await Industry.findOne({ slug: req.params.slug, status: 'PUBLISHED' }).populate('relatedProducts');
    if (!industry) return res.status(404).json({ success: false, message: 'Industry not found' });
    res.json({ success: true, data: industry });
  } catch (error) {
    next(error);
  }
};

// @desc Get public technology
exports.getPublicTechnology = async (req, res, next) => {
  try {
    const tech = await Technology.find({ status: 'PUBLISHED' }).sort({ displayOrder: 1 });
    res.json({ success: true, count: tech.length, data: tech });
  } catch (error) {
    next(error);
  }
};

// @desc Get public projects / case studies
exports.getPublicProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

exports.getPublicProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, status: 'PUBLISHED' });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc Get public resources
exports.getPublicResources = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = { status: 'PUBLISHED' };
    if (type) query.type = type;

    const resources = await Resource.find(query).sort({ publishDate: -1 });
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

exports.getPublicResourceBySlug = async (req, res, next) => {
  try {
    const resource = await Resource.findOne({ slug: req.params.slug, status: 'PUBLISHED' });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

// @desc Get public CMS page by slug
exports.getPublicPageBySlug = async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, status: 'PUBLISHED' });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};
