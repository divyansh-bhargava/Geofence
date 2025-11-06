const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { apiRateLimiter } = require('./middleware/rateLimit');
const cron = require('node-cron');
const Geofence = require('./models/Geofence');
const PastGeofence = require('./models/PastGeofence');
const MLData = require('./models/MLData');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(apiRateLimiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/geofence', require('./routes/geofence'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/ml', require('./routes/ml'));
app.use('/api/past-geofences', require('./routes/pastGeofence'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Add cron job for expired geofences
// const cron = require('node-cron');
// const Geofence = require('./models/Geofence');
// const PastGeofence = require('./models/PastGeofence');
// const MLData = require('./models/MLData');

// Run every minute to check for expired geofences
cron.schedule('* * * * *', async () => {
  try {
    const expiredGeofences = await Geofence.find({
      expiresAt: { $lte: new Date() },
      isActive: true
    }).populate('userId');

    for (const geofence of expiredGeofences) {
      // Move to past geofences
      await PastGeofence.create({
        userId: geofence.userId,
        originalGeofenceId: geofence._id,
        name: geofence.name,
        latitude: geofence.latitude,
        longitude: geofence.longitude,
        radius: geofence.radius,
        duration: geofence.duration,
        geofenceCreatedAt: geofence.createdAt,
        crossCount: geofence.crossCount,
        weatherConditions: geofence.weatherConditions,
        geofenceExpiredAt: geofence.expiresAt
      });

      // Store in ML data for analysis
      await MLData.create({
        userId: geofence.userId,
        geofenceId: geofence._id,
        geofenceCreatedAt: geofence.createdAt,
        timestamp: new Date(),
        crossCount: geofence.crossCount,
        weatherConditions: geofence.weatherConditions,
        dayOfWeek: new Date().getDay(),
        timeOfDay: getTimeOfDay(),
        duration: geofence.duration
      });

      // Deactivate geofence
      geofence.isActive = false;
      await geofence.save();
    }
  } catch (error) {
    console.error('Error in geofence expiration cron job:', error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Handle unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// Temporary testing route - remove in production
app.get('/api/test/setup', async (req, res) => {
  try {
    // Check database connection
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    
    res.json({
      success: true,
      database: dbState === 1 ? 'Connected' : 'Disconnected',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;