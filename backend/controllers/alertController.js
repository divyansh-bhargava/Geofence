const Alert = require('../models/Alert');

// Get all alerts for user
exports.getAlerts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, type } = req.query;

    const filter = { userId };
    if (type) {
      filter.type = type;
    }

    const alerts = await Alert.find(filter)
      .populate('geofenceId', 'name')
      .populate('sentTo.contactId', 'name email mobile')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Alert.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: alerts,
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
      message: 'Error fetching alerts',
      error: error.message
    });
  }
};

// Get alert by ID
exports.getAlertById = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.user._id;

    const alert = await Alert.findOne({ _id: alertId, userId })
      .populate('geofenceId', 'name latitude longitude radius')
      .populate('sentTo.contactId', 'name email mobile');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      data: alert
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching alert',
      error: error.message
    });
  }
};

// Delete alert
exports.deleteAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.user._id;

    const alert = await Alert.findOne({ _id: alertId, userId });
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    await Alert.findByIdAndDelete(alertId);

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting alert',
      error: error.message
    });
  }
};