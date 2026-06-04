const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  getAllPosts,
  getPendingPosts,
  getMyPosts,
  getPostById,
  createPost,
  approvePost,
  rejectPost,
  deletePost,
  reactToPost,
  addComment
} = require('../controllers/postController');

router.get('/', authMiddleware, getAllPosts);
router.get('/my-posts', authMiddleware, getMyPosts);
router.get('/pending', authMiddleware, roleMiddleware('ADMIN'), getPendingPosts);
router.get('/:id', authMiddleware, getPostById);
router.post('/', authMiddleware, roleMiddleware('RESPONSABLE', 'ADMIN'), createPost);
router.patch('/:id/approve', authMiddleware, roleMiddleware('ADMIN'), approvePost);
router.patch('/:id/reject', authMiddleware, roleMiddleware('ADMIN'), rejectPost);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), deletePost);
router.post('/:id/react', authMiddleware, reactToPost);
router.post('/:id/comment', authMiddleware, addComment);

module.exports = router;
