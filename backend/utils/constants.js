module.exports = {
  // OTP Configuration
  OTP_CONFIG: {
    LENGTH: 6,
    EXPIRY_MINUTES: 5,
    MAX_ATTEMPTS: 5,
    RATE_LIMIT_COUNT: 5,
    RATE_LIMIT_WINDOW_MS: 60 * 60 * 1000 // 1 hour
  },

  // Geofence Configuration
  GEOFENCE_CONFIG: {
    MIN_RADIUS: 50, // meters
    MAX_RADIUS: 5000, // meters
    DURATIONS: [6, 12, 24], // hours
    CHECK_INTERVAL: 5 * 60 * 1000 // 5 minutes
  },

  // Alert Types
  ALERT_TYPES: {
    GEOFENCE_BREACH: 'geofence_breach',
    PANIC_BUTTON: 'panic_button',
    ML_ANOMALY: 'ml_anomaly'
  },

  // Prediction Types
  PREDICTION_TYPES: {
    NORMAL: 'normal',
    ANOMALOUS: 'anomalous'
  },

  // Time of Day
  TIME_OF_DAY: {
    MORNING: 'morning',    // 5:00 - 11:59
    AFTERNOON: 'afternoon', // 12:00 - 16:59
    EVENING: 'evening',    // 17:00 - 20:59
    NIGHT: 'night'         // 21:00 - 4:59
  },

  // Response Messages
  MESSAGES: {
    USER: {
      REGISTER_SUCCESS: 'Registration successful. OTP sent to email and mobile.',
      VERIFICATION_SUCCESS: 'Account verified successfully.',
      LOGIN_SUCCESS: 'Login successful.',
      PROFILE_UPDATED: 'Profile updated successfully.',
      PASSWORD_CHANGED: 'Password changed successfully.'
    },
    GEOFENCE: {
      CREATED: 'Geofence created successfully.',
      ACTIVE_EXISTS: 'You already have an active geofence.',
      DELETED: 'Geofence deleted successfully.',
      BREACH_ALERT: 'Geofence breach detected. Alerts sent to trusted contacts.'
    },
    CONTACT: {
      ADDED: 'Contact added successfully.',
      UPDATED: 'Contact updated successfully.',
      DELETED: 'Contact deleted successfully.'
    },
    ALERT: {
      PANIC_TRIGGERED: 'Panic alert sent to all trusted contacts.',
      ML_ANALYSIS_COMPLETED: 'ML analysis completed.'
    },
    ERROR: {
      INVALID_CREDENTIALS: 'Invalid credentials.',
      UNAUTHORIZED: 'Not authorized to access this resource.',
      NOT_FOUND: 'Resource not found.',
      VALIDATION_ERROR: 'Validation failed.',
      RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.'
    }
  }
};