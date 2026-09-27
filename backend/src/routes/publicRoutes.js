const express = require('express');
const router = express.Router();
const {
  getPublicProducts,
  getPublicProductBySlug,
  getPublicCategories,
  getPublicSolutions,
  getPublicSolutionBySlug,
  getPublicIndustries,
  getPublicIndustryBySlug,
  getPublicTechnology,
  getPublicProjects,
  getPublicProjectBySlug,
  getPublicResources,
  getPublicResourceBySlug,
  getPublicPageBySlug
} = require('../controllers/publicController');
const { createEnquiry } = require('../controllers/enquiryController');

// Public read-only endpoints (PUBLISHED content only)
router.get('/products', getPublicProducts);
router.get('/products/:slug', getPublicProductBySlug);

router.get('/categories', getPublicCategories);

router.get('/solutions', getPublicSolutions);
router.get('/solutions/:slug', getPublicSolutionBySlug);

router.get('/industries', getPublicIndustries);
router.get('/industries/:slug', getPublicIndustryBySlug);

router.get('/technology', getPublicTechnology);

router.get('/projects', getPublicProjects);
router.get('/projects/:slug', getPublicProjectBySlug);

router.get('/resources', getPublicResources);
router.get('/resources/:slug', getPublicResourceBySlug);

router.get('/pages/:slug', getPublicPageBySlug);

// Public Enquiry submission
router.post('/enquiries', createEnquiry);

module.exports = router;
