const express = require('express');
const router = express.Router();
const { getIndustries, getIndustryById, createIndustry, updateIndustry, deleteIndustry } = require('../controllers/industryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getIndustries)
  .post(createIndustry);

router.route('/:id')
  .get(getIndustryById)
  .patch(updateIndustry)
  .delete(authorize('SUPER_ADMIN', 'ADMIN'), deleteIndustry);

module.exports = router;
