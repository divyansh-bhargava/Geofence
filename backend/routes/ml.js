const express = require('express');
const { getMLData, analyzeGeofence, getPredictionHistory } = require('../controllers/mlController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/data', getMLData);
router.get('/predictions', getPredictionHistory);
router.post('/analyze/:geofenceId', analyzeGeofence);

module.exports = router;