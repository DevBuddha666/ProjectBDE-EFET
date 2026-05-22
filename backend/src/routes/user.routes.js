const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole
} = require('../controllers/userController');

router.get('/', authMiddleware, roleMiddleware('ADMIN'), getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.post('/', authMiddleware, roleMiddleware('ADMIN'), createUser);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), updateUser);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), deleteUser);
router.patch('/:id/role', authMiddleware, roleMiddleware('ADMIN'), updateUserRole);

module.exports = router;
