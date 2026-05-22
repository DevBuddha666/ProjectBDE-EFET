const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  getDashboardStats,
  getAllClasses,
  createClass,
  updateClass,
  deleteClass
} = require('../controllers/adminController');

router.get('/stats', authMiddleware, roleMiddleware('ADMIN'), getDashboardStats);
router.get('/classes', authMiddleware, roleMiddleware('ADMIN'), getAllClasses);
router.post('/classes', authMiddleware, roleMiddleware('ADMIN'), createClass);
router.put('/classes/:id', authMiddleware, roleMiddleware('ADMIN'), updateClass);
router.delete('/classes/:id', authMiddleware, roleMiddleware('ADMIN'), deleteClass);

module.exports = router;
