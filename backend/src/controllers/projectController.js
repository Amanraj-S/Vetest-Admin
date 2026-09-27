const Project = require('../models/Project');
const slugify = require('slugify');
const { logActivity } = require('../utils/logger');

const makeSlug = (text) => slugify(text || '', { lower: true, strict: true });

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    let { projectTitle, slug, clientName, industry, location, summary, challenge, solution, implementation, results, technologies, heroImage, gallery, documents, status, featured, seoTitle, metaDescription } = req.body;
    if (!projectTitle) return res.status(400).json({ success: false, message: 'Project title is required' });

    slug = makeSlug(slug || projectTitle);
    const existing = await Project.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const project = await Project.create({
      projectTitle,
      slug,
      clientName: clientName || 'Demo Enterprise OEM (Placeholder)',
      industry: industry || 'Vehicle Inspection',
      location,
      summary,
      challenge,
      solution,
      implementation,
      results: Array.isArray(results) ? results : [],
      technologies: Array.isArray(technologies) ? technologies : [],
      heroImage,
      gallery: Array.isArray(gallery) ? gallery : [],
      documents: Array.isArray(documents) ? documents : [],
      status: status || 'PUBLISHED',
      featured: Boolean(featured),
      seoTitle: seoTitle || projectTitle,
      metaDescription
    });

    await logActivity(req.user._id, 'CREATE', 'PROJECT', `Created project case study: ${projectTitle}`, req.ip);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (req.body.projectTitle && !req.body.slug) req.body.slug = makeSlug(req.body.projectTitle);
    else if (req.body.slug) req.body.slug = makeSlug(req.body.slug);

    project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await logActivity(req.user._id, 'UPDATE', 'PROJECT', `Updated project: ${project.projectTitle}`, req.ip);

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    await project.deleteOne();
    await logActivity(req.user._id, 'DELETE', 'PROJECT', `Deleted project: ${project.projectTitle}`, req.ip);

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};
