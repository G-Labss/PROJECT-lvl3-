const Lesson = require('../models/Lesson');
const User = require('../models/User');

exports.getAllLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ isActive: true })
      .populate('coach', 'name email ntrpRating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('coach', 'name email ntrpRating');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
};

exports.createLesson = async (req, res, next) => {
  try {
    // Use authenticated user as coach, falling back to first user in DB
    let coachId = req.user?.id;
    if (!coachId) {
      const firstUser = await User.findOne();
      if (!firstUser) {
        return res.status(400).json({ success: false, message: 'No coach found in database' });
      }
      coachId = firstUser._id;
    }

    const lesson = await Lesson.create({ ...req.body, coach: coachId });
    await lesson.populate('coach', 'name email ntrpRating');

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLesson = async (req, res, next) => {
  try {
    const { coach, ...updateData } = req.body;

    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('coach', 'name email ntrpRating');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};
