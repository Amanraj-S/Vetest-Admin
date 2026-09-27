const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getCategories)
  .post(createCategory);

router.route('/:id')
  .patch(updateCategory)
  .delete(authorize('SUPER_ADMIN', 'ADMIN'), deleteCategory);

module.exports = router;
