const rateLimit = require('express-rate-limit');

// OTP generation rate limiter
const otpRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 OTP requests per hour
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// General API rate limiter
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { otpRateLimiter, apiRateLimiter };