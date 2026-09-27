const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .patch(updateProject)
  .delete(authorize('SUPER_ADMIN', 'ADMIN'), deleteProject);

module.exports = router;
