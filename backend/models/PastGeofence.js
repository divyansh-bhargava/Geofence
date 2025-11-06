const mongoose = require('mongoose');

const pastGeofenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalGeofenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Geofence'
  },
  name: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  radius: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  geofenceCreatedAt: {
    type: Date,
    required: true
  },
  crossCount: {
    type: Number,
    default: 0
  },
  weatherConditions: {
    temperature: Number,
    condition: String
  },
  mlAnalysis: {
    prediction: {
      type: String,
      enum: ['normal', 'anomalous']
    },
    confidence: Number,
    analyzedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  geofenceExpiredAt: {
    type: Date,
    required: true
  }
});

// Index for user's past geofences
pastGeofenceSchema.index({ userId: 1, geofenceExpiredAt: -1 });

module.exports = mongoose.model('PastGeofence', pastGeofenceSchema);