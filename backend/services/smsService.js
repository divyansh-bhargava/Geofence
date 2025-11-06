const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOTPSMS = async (mobile, otp) => {
  try {
    // Clean mobile number (remove spaces, dashes, etc.)
    const cleanMobile = mobile.replace(/\s+/g, '').replace(/[-()]/g, '');
    
    const message = await client.messages.create({
      body: `🔐 Geofence Security App - Your OTP is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: cleanMobile
    });

    console.log(`✅ SMS sent to ${cleanMobile}: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('❌ SMS sending failed:', error);
    
    // Don't throw error in production, just log it
    if (process.env.NODE_ENV === 'production') {
      console.log('SMS failed but continuing...');
      return null;
    } else {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
};

const sendAlertSMS = async (mobile, alertData) => {
  try {
    const cleanMobile = mobile.replace(/\s+/g, '').replace(/[-()]/g, '');
    
    const alertMessages = {
      'geofence_breach': `🚨 GEOFENCE BREACH: ${alertData.message}. Check user safety. Time: ${new Date().toLocaleString()}`,
      'panic_button': `🚨🚨 PANIC BUTTON: ${alertData.message}. EMERGENCY - Immediate action required! Time: ${new Date().toLocaleString()}`,
      'ml_anomaly': `⚠️ ANOMALY DETECTED: ${alertData.message}. Unusual activity pattern identified. Time: ${new Date().toLocaleString()}`
    };

    const messageBody = alertMessages[alertData.type] || alertMessages['geofence_breach'];

    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: cleanMobile
    });

    console.log(`✅ Alert SMS sent to ${cleanMobile}: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('❌ Alert SMS sending failed:', error);
    
    if (process.env.NODE_ENV === 'production') {
      console.log('Alert SMS failed but continuing...');
      return null;
    } else {
      throw new Error(`Failed to send alert SMS: ${error.message}`);
    }
  }
};

module.exports = { sendOTPSMS, sendAlertSMS };
//---------------------------------------------------------------------------------------------------
// const twilio = require('twilio');
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// const sendOTPSMS = async (mobile, otp) => {
//   try {
//     await client.messages.create({
//       body: `Your OTP for Geofence Security App is: ${otp}. It will expire in 5 minutes.`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: mobile
//     });
//   } catch (error) {
//     console.error('SMS sending failed:', error);
//     throw new Error('Failed to send SMS');
//   }
// };

// const sendAlertSMS = async (mobile, alertData) => {
//   try {
//     await client.messages.create({
//       body: `SECURITY ALERT: ${alertData.message}. Type: ${alertData.type}. Time: ${new Date().toLocaleString()}`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: mobile
//     });
//   } catch (error) {
//     console.error('Alert SMS sending failed:', error);
//     throw new Error('Failed to send alert SMS');
//   }
// };

// module.exports = { sendOTPSMS, sendAlertSMS };
//----------------------------------------------------------------------------------------------------
// const sendOTPSMS = async (mobile, otp) => {
//   console.log(`📱 OTP SMS for ${mobile}: ${otp}`);
//   return Promise.resolve();
// };

// const sendAlertSMS = async (mobile, alertData) => {
//   console.log(`🚨 Alert SMS to ${mobile}:`, alertData);
//   return Promise.resolve();
// };

// module.exports = { sendOTPSMS, sendAlertSMS };