const mongoose = require('mongoose');

const mlDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  geofenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Geofence'
  },
  geofenceCreatedAt: {
    type: Date,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  crossCount: {
    type: Number,
    required: true
  },
  weatherConditions: {
    temperature: Number,
    condition: String
  },
  dayOfWeek: Number, // 0-6 (Sunday-Saturday)
  timeOfDay: String, // morning, afternoon, evening, night
  duration: Number,
  prediction: {
    type: String,
    enum: ['normal', 'anomalous'],
    default: 'normal'
  },
  confidence: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MLData', mlDataSchema);