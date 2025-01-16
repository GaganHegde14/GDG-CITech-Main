const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
const cors = require('cors');
app.use(cors({
  origin: '*', // or '*' to allow all origins
  methods: ['GET', 'POST'], // Specify allowed methods
}));
app.use(cors(corsOptions));
app.use(bodyParser.json());

// MongoDB Connection
const uri = process.env.MONGO_URI; // Use environment variable for MongoDB URI
mongoose.set('debug', true); // Enable debug logs
console.log('MongoDB URI:', process.env.MONGO_URI || 'MONGO_URI not set');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Serve static files from 'public' folder
const publicPath = path.join(__dirname, '../public');
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
app.get('/db-test', async (req, res) => {
    try {
        const test = await mongoose.connection.db.admin().ping();
        res.status(200).json({ message: 'MongoDB connection successful!', test });
    } catch (err) {
        console.error('MongoDB Test Error:', err);
        res.status(500).json({ error: 'MongoDB connection failed' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
