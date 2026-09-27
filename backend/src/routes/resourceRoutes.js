const express = require('express');
const router = express.Router();
const { getResources, getResourceById, createResource, updateResource, deleteResource } = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getResources)
  .post(createResource);

router.route('/:id')
  .get(getResourceById)
  .patch(updateResource)
  .delete(authorize('SUPER_ADMIN', 'ADMIN'), deleteResource);

module.exports = router;
