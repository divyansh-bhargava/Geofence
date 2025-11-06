const PastGeofence = require('../models/PastGeofence');

// Get all past geofences for user (simple table data)
exports.getPastGeofences = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const pastGeofences = await PastGeofence.find({ userId })
      .sort({ geofenceExpiredAt: -1 }) // Show latest first
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('name latitude longitude radius duration geofenceCreatedAt expiredAt crossCount weatherConditions')
      .lean();

    // Format data for table display
    const tableData = pastGeofences.map(geofence => {
      const created = new Date(geofence.geofenceCreatedAt);
      const expired = new Date(geofence.geofenceExpiredAt);
      const actualDuration = Math.round((expired - created) / (1000 * 60 * 60)); // hours
      
      return {
        id: geofence._id,
        name: geofence.name,
        location: `${geofence.latitude.toFixed(4)}, ${geofence.longitude.toFixed(4)}`,
        radius: `${geofence.radius}m`,
        intendedDuration: `${geofence.duration}h`,
        actualDuration: `${actualDuration}h`,
        breaches: geofence.crossCount,
        created: created.toLocaleDateString(),
        expired: expired.toLocaleDateString(),
        temperature: geofence.weatherConditions?.temperature || 'N/A',
        weather: geofence.weatherConditions?.condition || 'N/A'
      };
    });

    const total = await PastGeofence.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: tableData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching past geofences',
      error: error.message
    });
  }
};