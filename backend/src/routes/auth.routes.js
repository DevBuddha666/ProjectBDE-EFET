const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { login, logout, refresh } = require('../controllers/authController');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later'
});

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refresh);

module.exports = router;
