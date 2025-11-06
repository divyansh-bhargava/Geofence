const Geofence = require('../models/Geofence');
const Contact = require('../models/Contact');
const Alert = require('../models/Alert');
const MLData = require('../models/MLData');
const { isWithinGeofence, getActiveGeofence } = require('../services/locationService');
const { sendAlertEmail} = require('../services/emailService');
const { sendAlertSMS } = require('../services/smsService');

// Create geofence
exports.createGeofence = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check if user already has active geofence
    const activeGeofence = await getActiveGeofence(userId);
    if (activeGeofence) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active geofence. Please wait for it to expire or delete it first.'
      });
    }

    const { name, latitude, longitude, radius, duration, weatherConditions } = req.body;
    
    const expiresAt = new Date(Date.now() + duration * 60 * 1000);

    const geofence = await Geofence.create({
      userId,
      name,
      latitude,
      longitude,
      radius,
      duration,
      weatherConditions,
      expiresAt
    });

    res.status(201).json({
      success: true,
      message: 'Geofence created successfully',
      data: geofence
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating geofence',
      error: error.message
    });
  }
};

// Check location and trigger alerts
exports.checkLocation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { latitude, longitude } = req.body;

    const geofence = await getActiveGeofence(userId);
    if (!geofence) {
      return res.status(200).json({
        success: true,
        message: 'No active geofence'
      });
    }

    const isInside = isWithinGeofence(latitude, longitude, geofence);
    
    if (!isInside) {
      // User breached geofence
      geofence.crossCount += 1;
      await geofence.save();

      // Get trusted contacts
      const contacts = await Contact.find({ userId, isActive: true });
      
      // Create alert
      const alert = await Alert.create({
        userId,
        type: 'geofence_breach',
        message: `User breached geofence: ${geofence.name}`,
        location: { latitude, longitude },
        geofenceId: geofence._id,
        sentTo: []
      });

      // Send alerts to contacts
      for (const contact of contacts) {
        const sentMethods = [];
        
        if (contact.email) {
          try {
            await sendAlertEmail(contact.email, {
              type: 'geofence_breach',
              message: `User breached geofence: ${geofence.name}`
            });
            sentMethods.push('email');
          } catch (error) {
            console.error('Email alert failed:', error);
          }
        }

        if (contact.mobile) {
          try {
            await sendAlertSMS(contact.mobile, {
              type: 'geofence_breach',
              message: `User breached geofence: ${geofence.name}`
            });
            sentMethods.push('sms');
          } catch (error) {
            console.error('SMS alert failed:', error);
          }
        }

        alert.sentTo.push({
          contactId: contact._id,
          method: sentMethods.length > 1 ? 'both' : sentMethods[0],
          status: 'sent'
        });
      }

      await alert.save();
    }

    res.status(200).json({
      success: true,
      data: {
        isInside,
        geofence: isInside ? null : geofence
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking location',
      error: error.message
    });
  }
};

// Trigger panic button
exports.triggerPanic = async (req, res) => {
  try {
    const userId = req.user._id;
    const { latitude, longitude } = req.body;

    const contacts = await Contact.find({ userId, isActive: true });
    
    const alert = await Alert.create({
      userId,
      type: 'panic_button',
      message: 'Panic button activated! User may be in danger.',
      location: { latitude, longitude },
      sentTo: []
    });

    // Send alerts to contacts
    for (const contact of contacts) {
      const sentMethods = [];
      
      if (contact.email) {
        try {
          await sendAlertEmail(contact.email, {
            type: 'panic_button',
            message: 'Panic button activated! User may be in danger.'
          });
          sentMethods.push('email');
        } catch (error) {
          console.error('Email alert failed:', error);
        }
      }

      if (contact.mobile) {
        try {
          await sendAlertSMS(contact.mobile, {
            type: 'panic_button',
            message: 'Panic button activated! User may be in danger.'
          });
          sentMethods.push('sms');
        } catch (error) {
          console.error('SMS alert failed:', error);
        }
      }

      alert.sentTo.push({
        contactId: contact._id,
        method: sentMethods.length > 1 ? 'both' : sentMethods[0],
        status: 'sent'
      });
    }

    await alert.save();

    res.status(200).json({
      success: true,
      message: 'Panic alert sent to all trusted contacts'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error triggering panic alert',
      error: error.message
    });
  }
};

// Get active geofence
exports.getActiveGeofence = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const geofence = await getActiveGeofence(userId);
    
    res.status(200).json({
      success: true,
      data: geofence
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching geofence',
      error: error.message
    });
  }
};

// Delete geofence
exports.deleteGeofence = async (req, res) => {
  try {
    const { geofenceId } = req.params;
    const userId = req.user._id;

    const geofence = await Geofence.findOne({ _id: geofenceId, userId });
    
    if (!geofence) {
      return res.status(404).json({
        success: false,
        message: 'Geofence not found'
      });
    }

    // Store data for ML before deleting
    await MLData.create({
      userId,
      geofenceId: geofence._id,
      geofenceCreatedAt: geofence.createdAt,
      timestamp: new Date(),
      crossCount: geofence.crossCount,
      weatherConditions: geofence.weatherConditions,
      dayOfWeek: new Date().getDay(),
      timeOfDay: getTimeOfDay(),
      duration: geofence.duration
    });

    await Geofence.findByIdAndDelete(geofenceId);

    res.status(200).json({
      success: true,
      message: 'Geofence deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting geofence',
      error: error.message
    });
  }
};

// Helper function to get time of day
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}