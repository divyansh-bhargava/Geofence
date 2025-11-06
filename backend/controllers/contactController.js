const Contact = require('../models/Contact');

// Add trusted contact
exports.addContact = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, mobile } = req.body;

    if (!email && !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Either email or mobile must be provided'
      });
    }

    const contact = await Contact.create({
      userId,
      name,
      email,
      mobile
    });

    res.status(201).json({
      success: true,
      message: 'Contact added successfully',
      data: contact
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding contact',
      error: error.message
    });
  }
};

// Get all contacts for user
exports.getContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const contacts = await Contact.find({ userId, isActive: true });
    
    res.status(200).json({
      success: true,
      data: contacts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
};

// Delete contact
exports.deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await Contact.findOne({ _id: contactId, userId });
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await Contact.findByIdAndDelete(contactId);

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
};

// Update contact
exports.updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const { name, email, mobile } = req.body;

    const contact = await Contact.findOne({ _id: contactId, userId });
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    if (email) contact.email = email;
    if (mobile) contact.mobile = mobile;
    if (name) contact.name = name;

    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contact',
      error: error.message
    });
  }
};