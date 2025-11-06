const express = require('express');
const { createGeofence, checkLocation, triggerPanic, getActiveGeofence, deleteGeofence } = require('../controllers/geofenceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/create', createGeofence);
router.post('/check-location', checkLocation);
router.post('/panic', triggerPanic);
router.get('/active', getActiveGeofence);
router.delete('/:geofenceId', deleteGeofence);

module.exports = router;