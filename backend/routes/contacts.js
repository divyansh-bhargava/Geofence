const express = require('express');
const { addContact, getContacts, deleteContact, updateContact } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', addContact);
router.get('/', getContacts);
router.put('/:contactId', updateContact);
router.delete('/:contactId', deleteContact);

module.exports = router;