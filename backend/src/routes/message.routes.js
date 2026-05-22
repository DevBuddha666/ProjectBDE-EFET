const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  getMessages,
  getMessageThread,
  sendMessage,
  markAsRead
} = require('../controllers/messageController');

router.get('/', authMiddleware, getMessages);
router.get('/:userId', authMiddleware, getMessageThread);
router.post('/', authMiddleware, roleMiddleware('RESPONSABLE', 'ADMIN'), sendMessage);
router.patch('/:id/read', authMiddleware, markAsRead);

module.exports = router;
