const express = require('express');
const router = express.Router();
const { validateUser } = require('../middleware/validation');
const { protect } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateServiceArea,
} = require('../controllers/userController');

router.route('/')
  .get(getAllUsers)
  .post(validateUser, createUser);

router.route('/:id')
  .get(getUserById)
  .put(validateUser, updateUser)
  .delete(deleteUser);

router.patch('/:id/service-area', protect, updateServiceArea);

module.exports = router;