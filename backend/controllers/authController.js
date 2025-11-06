const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../services/emailService');
const { sendOTPSMS } = require('../services/smsService');
const { generateOTP } = require('../utils/generateOTP');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or mobile already exists'
      });
    }

    // Create unverified user
    const user = await User.create({
      name,
      mobile,
      email,
      password,
      isVerified: false
    });

    // Generate OTPs
    const emailOTP = generateOTP();
    const mobileOTP = generateOTP();
    
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP to database
    await OTP.create({
      email,
      mobile,
      emailOTP,
      mobileOTP,
      expiresAt
    });

    // Send OTPs
    await sendOTPEmail(email, emailOTP);
    await sendOTPSMS(mobile, mobileOTP);

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email and mobile',
      data: { userId: user._id }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in registration',
      error: error.message
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, emailOTP, mobileOTP } = req.body;

    const otpRecord = await OTP.findOne({ email });
    
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    if (otpRecord.attempts >= 5) {
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request new OTP.'
      });
    }

    if (otpRecord.emailOTP !== emailOTP || otpRecord.mobileOTP !== mobileOTP) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Mark user as verified
    await User.findOneAndUpdate({ email }, { isVerified: true });
    
    // Delete OTP record
    await OTP.deleteOne({ email });

    const user = await User.findOne({ email });

    res.status(200).json({
      success: true,
      message: 'Account verified successfully',
      data: {
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in OTP verification',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body; // login can be email or mobile

    const user = await User.findOne({
      $or: [{ email: login }, { mobile: login }]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your account first'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in login',
      error: error.message
    });
  }
};

// Forgot password - send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const emailOTP = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({
      email,
      mobile: user.mobile,
      emailOTP,
      mobileOTP: '000000', // Not needed for password reset
      expiresAt
    });

    await sendOTPEmail(email, emailOTP);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in forgot password',
      error: error.message
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({ email, emailOTP: otp });
    
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    await OTP.deleteOne({ email });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in resetting password',
      error: error.message
    });
  }
};