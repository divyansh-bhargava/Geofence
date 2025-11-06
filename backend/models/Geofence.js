const mongoose = require('mongoose');

const geofenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
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
    type: Number, // in meters
    required: true
  },
  duration: {
    type: Number, // in hours
    required: true,
    enum: [6, 12, 24]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  crossCount: {
    type: Number,
    default: 0
  },
  weatherConditions: {
    temperature: Number,
    condition: String
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for active geofences and expiration
geofenceSchema.index({ userId: 1, isActive: 1 });
geofenceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Geofence', geofenceSchema);