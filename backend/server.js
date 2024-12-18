const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path module

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const uri = 'your_mongodb_connection_string'; // Replace with your MongoDB URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Serve static files from 'public' folder
const publicPath = path.join(__dirname, '../public'); // Adjust for relative path
app.use(express.static(publicPath));

// Root Route - Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// API Endpoint for Contact Form Submission
const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, required: true },
    message: String,
});

const Contact = mongoose.model('Contact', contactSchema);

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
