const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProgress, upsertProgress, addNote, deleteNote, addNtrpEntry } = require('../controllers/progressController');

router.get('/:email', getProgress);
router.put('/:email', protect, upsertProgress);
router.post('/:email/notes', protect, addNote);
router.delete('/:email/notes/:noteId', protect, deleteNote);
router.post('/:email/ntrp', protect, addNtrpEntry);

module.exports = router;
