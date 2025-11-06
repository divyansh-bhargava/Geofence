const Geofence = require('../models/Geofence');

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Check if location is within geofence
const isWithinGeofence = (userLat, userLon, geofence) => {
  const distance = calculateDistance(userLat, userLon, geofence.latitude, geofence.longitude);
  return distance <= geofence.radius;
};

// Get active geofence for user
const getActiveGeofence = async (userId) => {
  return await Geofence.findOne({ userId, isActive: true });
};

module.exports = {
  calculateDistance,
  isWithinGeofence,
  getActiveGeofence
};