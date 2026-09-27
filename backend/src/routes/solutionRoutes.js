const express = require('express');
const router = express.Router();
const { getSolutions, getSolutionById, createSolution, updateSolution, deleteSolution } = require('../controllers/solutionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getSolutions)
  .post(createSolution);

router.route('/:id')
  .get(getSolutionById)
  .patch(updateSolution)
  .delete(authorize('SUPER_ADMIN', 'ADMIN'), deleteSolution);

module.exports = router;
