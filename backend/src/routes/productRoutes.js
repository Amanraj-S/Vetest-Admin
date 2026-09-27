const express = require('express');
const router = express.Router();
const {
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  publishProduct,
  unpublishProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAdminProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .patch(updateProduct)
  .delete(authorize('SUPER_ADMIN', 'ADMIN'), deleteProduct);

router.post('/:id/publish', publishProduct);
router.post('/:id/unpublish', unpublishProduct);

module.exports = router;
