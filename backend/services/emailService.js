const transporter = require('../config/email');

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Geofence Security App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Geofence Security App</h2>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center;">
            <h3 style="color: #007bff; margin: 0;">Your Verification Code</h3>
            <div style="font-size: 32px; font-weight: bold; color: #28a745; letter-spacing: 5px; margin: 15px 0;">
              ${otp}
            </div>
          </div>
          <p style="color: #666; text-align: center;">
            This OTP will expire in 5 minutes.<br>
            If you didn't request this OTP, please ignore this email.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

const sendAlertEmail = async (email, alertData) => {
  try {
    const alertTypes = {
      'geofence_breach': {
        subject: '🚨 Geofence Breach Alert',
        color: '#dc3545',
        title: 'Geofence Boundary Breached'
      },
      'panic_button': {
        subject: '🚨 PANIC BUTTON ACTIVATED',
        color: '#ff0000', 
        title: 'EMERGENCY: Panic Button Activated'
      },
      'ml_anomaly': {
        subject: '⚠️ Anomalous Behavior Detected',
        color: '#ffc107',
        title: 'Suspicious Activity Pattern Detected'
      }
    };

    const alertConfig = alertTypes[alertData.type] || alertTypes['geofence_breach'];

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: alertConfig.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid ${alertConfig.color}; border-radius: 10px;">
          <h2 style="color: ${alertConfig.color}; text-align: center;">${alertConfig.title}</h2>
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid ${alertConfig.color};">
            <p style="margin: 0; font-size: 16px; color: #856404;">
              <strong>Alert Type:</strong> ${alertData.type.replace(/_/g, ' ').toUpperCase()}<br>
              <strong>Message:</strong> ${alertData.message}<br>
              <strong>Time:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
          <p style="color: #666; text-align: center; margin-top: 20px;">
            Please check on the person immediately and ensure their safety.
          </p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="#" style="background: ${alertConfig.color}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Details
            </a>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Alert email sent to ${email}: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error('❌ Alert email sending failed:', error);
    throw new Error('Failed to send alert email');
  }
};

module.exports = { sendOTPEmail, sendAlertEmail };

//-------------------------------------------------------------------------------------------------------
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransporter({
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// const sendOTPEmail = async (email, otp) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Your OTP for Geofence Security App',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #333;">Geofence Security App</h2>
//         <p>Your OTP for verification is: <strong>${otp}</strong></p>
//         <p>This OTP will expire in 5 minutes.</p>
//         <p>If you didn't request this OTP, please ignore this email.</p>
//       </div>
//     `
//   };

//   await transporter.sendMail(mailOptions);
// };

// const sendAlertEmail = async (email, alertData) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: `Security Alert: ${alertData.type}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #ff0000;">Security Alert</h2>
//         <p><strong>Alert Type:</strong> ${alertData.type}</p>
//         <p><strong>Message:</strong> ${alertData.message}</p>
//         <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
//         <p>Please check on the person immediately.</p>
//       </div>
//     `
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = { sendOTPEmail, sendAlertEmail };
//--------------------------------------------------------------------------------------------------------
// const sendOTPEmail = async (email, otp) => {
//   console.log(`📧 OTP Email for ${email}: ${otp}`);
//   // In development, just log the OTP
//   return Promise.resolve();
// };

// const sendAlertEmail = async (email, alertData) => {
//   console.log(`🚨 Alert Email to ${email}:`, alertData);
//   return Promise.resolve();
// };

// module.exports = { sendOTPEmail, sendAlertEmail };