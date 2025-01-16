const mongoose = require('mongoose');

// Define the schema
const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, required: true },
    message: String,
});

// Create and export the model
const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
