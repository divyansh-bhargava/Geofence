const express = require('express');
const { getAlerts, getAlertById, deleteAlert } = require('../controllers/alertController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getAlerts);
router.get('/:alertId', getAlertById);
router.delete('/:alertId', deleteAlert);

module.exports = router;