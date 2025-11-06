const express = require('express');
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateContact, validatePasswordChange } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', validateContact, updateProfile);
router.put('/change-password', validatePasswordChange, changePassword);

module.exports = router;