const express = require('express');
const router = express.Router();
const { validateLesson } = require('../middleware/validation');
const { protect } = require('../middleware/authMiddleware');
const {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessonController');

router.route('/')
  .get(getAllLessons)
  .post(protect, validateLesson, createLesson);

router.route('/:id')
  .get(getLessonById)
  .put(protect, validateLesson, updateLesson)
  .delete(protect, deleteLesson);

module.exports = router;