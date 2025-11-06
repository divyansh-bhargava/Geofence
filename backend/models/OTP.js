const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  emailOTP: {
    type: String,
    required: true
  },
  mobileOTP: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '5m' } // Auto delete after 5 minutes
  },
  attempts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for OTP generation rate limiting
otpSchema.index({ email: 1, createdAt: 1 });
otpSchema.index({ mobile: 1, createdAt: 1 });

module.exports = mongoose.model('OTP', otpSchema);