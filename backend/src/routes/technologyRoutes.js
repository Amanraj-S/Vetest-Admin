const express = require('express');
const router = express.Router();
const { getTechnologies, getTechnologyById, createTechnology, updateTechnology, deleteTechnology } = require('../controllers/technologyController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getTechnologies)
  .post(createTechnology);

router.route('/:id')
  .get(getTechnologyById)
  .patch(updateTechnology)
  .delete(authorize('SUPER_ADMIN', 'ADMIN'), deleteTechnology);

module.exports = router;
