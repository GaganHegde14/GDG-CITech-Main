const express = require('express');
const Contact = require('../models/Contact'); // Import the model
const router = express.Router();

// POST endpoint for submitting the contact form
router.post('/submit', async (req, res) => {
    try {
        console.log('Form Data Received:', req.body);
        const { firstName, lastName, email, message } = req.body;
        const newContact = new Contact({ firstName, lastName, email, message });
        await newContact.save();
        res.status(201).json({ message: 'Form submitted successfully!' });
    } catch (err) {
        console.error('Error in /submit endpoint:', err);
        res.status(500).json({ error: 'Failed to submit form' });
    }
});

module.exports = router;
