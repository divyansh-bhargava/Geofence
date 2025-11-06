const MLData = require('../models/MLData');
const PastGeofence = require('../models/PastGeofence');
const { analyzeWithML } = require('../services/mlService');
const Alert = require('../models/Alert');
const Contact = require('../models/Contact');
const { sendAlertEmail} = require('../services/emailService');
const { sendAlertSMS } = require('../services/smsService');

// Get ML data for user
exports.getMLData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const mlData = await MLData.find({ userId })
      .populate('geofenceId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MLData.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: mlData.map(item => ({
            ...item.toObject(),
            geofenceCreatedAt: item.geofenceCreatedAt // Include in response
        })),
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
      message: 'Error fetching ML data',
      error: error.message
    });
  }
};

// Trigger ML analysis for expired geofence
exports.analyzeGeofence = async (req, res) => {
  try {
    const { geofenceId } = req.params;
    const userId = req.user._id;

    // Get ML data for the geofence
    const mlData = await MLData.findOne({ geofenceId, userId })
      .populate('geofenceId');

    if (!mlData) {
      return res.status(404).json({
        success: false,
        message: 'ML data not found for this geofence'
      });
    }

    // Prepare data for ML analysis
    const mlInputData = {
      user_id: userId.toString(),
      geofence_id: geofenceId,
      geofence_created_at: mlData.geofenceCreatedAt,
      timestamp: mlData.timestamp,
      cross_count: mlData.crossCount,
      weather_conditions: mlData.weatherConditions,
      day_of_week: mlData.dayOfWeek,
      time_of_day: mlData.timeOfDay,
      duration: mlData.duration,
      temperature: mlData.weatherConditions?.temperature || 0
    };

    // Call ML service for prediction
    const mlResult = await analyzeWithML(mlInputData);

    // Update ML data with prediction
    mlData.prediction = mlResult.prediction;
    mlData.confidence = mlResult.confidence;
    await mlData.save();

    // If anomalous behavior detected, send alert
    if (mlResult.prediction === 'anomalous') {
      await sendMLAlert(userId, mlData, mlResult);
    }

    res.status(200).json({
      success: true,
      message: 'ML analysis completed',
      data: {
        prediction: mlResult.prediction,
        confidence: mlResult.confidence,
        details: mlResult.details || {},
        geofenceCreatedAt: mlData.geofenceCreatedAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in ML analysis',
      error: error.message
    });
  }
};

// Send ML-based alert to trusted contacts
const sendMLAlert = async (userId, mlData, mlResult) => {
  try {
    const contacts = await Contact.find({ userId, isActive: true });
    
    const alert = await Alert.create({
      userId,
      type: 'ml_anomaly',
      message: `Anomalous behavior detected in geofence activity. Confidence: ${(mlResult.confidence * 100).toFixed(2)}%`,
      geofenceId: mlData.geofenceId,
      sentTo: []
    });

    // Send alerts to contacts
    for (const contact of contacts) {
      const sentMethods = [];
      
      if (contact.email) {
        try {
          await sendAlertEmail(contact.email, {
            type: 'ml_anomaly',
            message: `Anomalous behavior pattern detected in user's geofence activity. This may indicate unusual behavior patterns. Confidence level: ${(mlResult.confidence * 100).toFixed(2)}%`
          });
          sentMethods.push('email');
        } catch (error) {
          console.error('ML Alert Email failed:', error);
        }
      }

      if (contact.mobile) {
        try {
          await sendAlertSMS(contact.mobile, {
            type: 'ml_anomaly',
            message: `Anomalous behavior detected in user's geofence activity. Check for details.`
          });
          sentMethods.push('sms');
        } catch (error) {
          console.error('ML Alert SMS failed:', error);
        }
      }

      alert.sentTo.push({
        contactId: contact._id,
        method: sentMethods.length > 1 ? 'both' : sentMethods[0],
        status: 'sent'
      });
    }

    await alert.save();

  } catch (error) {
    console.error('Error sending ML alert:', error);
  }
};

// Get prediction history
exports.getPredictionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { prediction } = req.query;

    const filter = { userId };
    if (prediction) {
      filter.prediction = prediction;
    }

    const predictions = await MLData.find(filter)
      .populate('geofenceId', 'name latitude longitude radius')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: predictions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prediction history',
      error: error.message
    });
  }
};