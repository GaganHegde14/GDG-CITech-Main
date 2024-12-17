const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const uri = 'mongodb+srv://GDG-WEBSITE-ADMIN:GDGCITECHMAIN2025@gdsc-citech-main.gpyjx.mongodb.net/contactFormDB?retryWrites=true&w=majority&appName=GDSC-CITECH-MAIN';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Schema and Model
const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, required: true },
    message: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// API Endpoint
app.post('/submit', async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;
        const newContact = new Contact({ firstName, lastName, email, message });
        await newContact.save();
        res.status(201).json({ message: 'Form submitted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit form' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
