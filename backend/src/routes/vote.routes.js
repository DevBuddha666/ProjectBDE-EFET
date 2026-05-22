const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  getPolls,
  getPollById,
  createPoll,
  closePoll,
  vote,
  getPollResults,
  announceWinner,
  deletePoll
} = require('../controllers/voteController');

router.get('/', authMiddleware, getPolls);
router.get('/:id', authMiddleware, getPollById);
router.post('/', authMiddleware, roleMiddleware('ADMIN'), createPoll);
router.patch('/:id/close', authMiddleware, roleMiddleware('ADMIN'), closePoll);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), deletePoll);
router.post('/:id/vote', authMiddleware, roleMiddleware('ETUDIANT', 'RESPONSABLE'), vote);
router.get('/:id/results', authMiddleware, roleMiddleware('ADMIN'), getPollResults);
router.post('/:id/announce-winner', authMiddleware, roleMiddleware('ADMIN'), announceWinner);

module.exports = router;
