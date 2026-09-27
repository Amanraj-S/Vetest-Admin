const express = require('express');
const router = express.Router();
const { getPages, getPageById, createPage, updatePage, deletePage } = require('../controllers/pageController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPages)
  .post(createPage);

router.route('/:id')
  .get(getPageById)
  .patch(updatePage)
  .delete(authorize('SUPER_ADMIN', 'ADMIN'), deletePage);

module.exports = router;
