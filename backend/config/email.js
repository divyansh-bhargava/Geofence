const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Production - use real email service
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  
  // Development - fallback to console logging
  console.log('⚠️  Email credentials not found. Using console mode.');
  return {
    sendMail: (mailOptions) => {
      console.log('📧 EMAIL (Console Mode):', {
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html
      });
      return Promise.resolve({ messageId: 'console-mode', response: 'OK' });
    }
  };
};

const transporter = createTransporter();

// Verify configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

module.exports = transporter;

// const nodemailer = require('nodemailer');

// const emailConfig = {
//   service: process.env.EMAIL_SERVICE || 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// };

// const transporter = nodemailer.createTransporter(emailConfig);

// // Verify email configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('Email configuration error:', error);
//   } else {
//     console.log('Email server is ready to send messages');
//   }
// });

// module.exports = transporter;
