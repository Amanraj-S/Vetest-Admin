const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
