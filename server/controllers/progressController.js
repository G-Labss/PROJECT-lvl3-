const Progress = require('../models/Progress');
const Booking = require('../models/Booking');

const MILESTONES = [
  { name: 'First Session', sessions: 1 },
  { name: '5 Sessions', sessions: 5 },
  { name: '10 Sessions', sessions: 10 },
  { name: '25 Sessions', sessions: 25 },
  { name: '50 Sessions', sessions: 50 },
];

const checkAndAwardMilestones = (progressDoc, sessionCount) => {
  const existing = new Set(progressDoc.milestones.map(m => m.name));
  for (const m of MILESTONES) {
    if (sessionCount >= m.sessions && !existing.has(m.name)) {
      progressDoc.milestones.push({ name: m.name });
    }
  }
};

// GET /api/progress/:email
const getProgress = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();

    const [progress, sessionCount] = await Promise.all([
      Progress.findOne({ studentEmail: email }),
      Booking.countDocuments({ studentEmail: email, paymentStatus: 'paid' }),
    ]);

    if (!progress) {
      return res.status(200).json({ success: true, data: null, sessionCount });
    }

    res.status(200).json({ success: true, data: progress, sessionCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/progress/:email  — upsert name + stroke ratings
const upsertProgress = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const { studentName, strokeRatings } = req.body;

    let progress = await Progress.findOne({ studentEmail: email });

    if (!progress) {
      progress = new Progress({ studentEmail: email });
    }

    if (studentName !== undefined) progress.studentName = studentName;
    if (strokeRatings) {
      for (const key of Object.keys(strokeRatings)) {
        if (progress.strokeRatings[key] !== undefined) {
          progress.strokeRatings[key] = strokeRatings[key];
        }
      }
    }

    const sessionCount = await Booking.countDocuments({ studentEmail: email, paymentStatus: 'paid' });
    checkAndAwardMilestones(progress, sessionCount);

    await progress.save();
    res.status(200).json({ success: true, data: progress, sessionCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/progress/:email/notes
const addNote = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Note text is required' });
    }

    let progress = await Progress.findOne({ studentEmail: email });
    if (!progress) {
      progress = new Progress({ studentEmail: email });
    }

    progress.notes.unshift({ text: text.trim() });

    const sessionCount = await Booking.countDocuments({ studentEmail: email, paymentStatus: 'paid' });
    checkAndAwardMilestones(progress, sessionCount);

    await progress.save();
    res.status(201).json({ success: true, data: progress, sessionCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/progress/:email/notes/:noteId
const deleteNote = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const { noteId } = req.params;

    const progress = await Progress.findOne({ studentEmail: email });
    if (!progress) return res.status(404).json({ success: false, message: 'Progress record not found' });

    progress.notes = progress.notes.filter(n => n._id.toString() !== noteId);
    await progress.save();
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/progress/:email/ntrp
const addNtrpEntry = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const { rating, note } = req.body;

    if (!rating) {
      return res.status(400).json({ success: false, message: 'Rating is required' });
    }

    let progress = await Progress.findOne({ studentEmail: email });
    if (!progress) {
      progress = new Progress({ studentEmail: email });
    }

    progress.ntrpHistory.push({ rating, note: note || '' });

    const sessionCount = await Booking.countDocuments({ studentEmail: email, paymentStatus: 'paid' });
    checkAndAwardMilestones(progress, sessionCount);

    await progress.save();
    res.status(201).json({ success: true, data: progress, sessionCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProgress, upsertProgress, addNote, deleteNote, addNtrpEntry };
