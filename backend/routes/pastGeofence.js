const express = require('express');
const { getPastGeofences } = require('../controllers/pastGeofenceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getPastGeofences);

module.exports = router;