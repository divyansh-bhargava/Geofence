const express = require('express');
const { register, verifyOTP, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { otpRateLimiter } = require('../middleware/rateLimit');
const { validateRegistration, validateLogin } = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/verify-otp', verifyOTP);
router.post('/login', validateLogin, login);
router.post('/forgot-password', otpRateLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;