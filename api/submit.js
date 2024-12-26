import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;

let isConnected = false; // Track MongoDB connection status

// Function to connect to MongoDB
async function connectToDatabase() {
    if (!isConnected) {
        console.log('Connecting to MongoDB...');
        try {
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            });
            isConnected = true;
            console.log('Connected to MongoDB Atlas');
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
            throw err; // Re-throw the error to the handler
        }
    } else {
        console.log('MongoDB is already connected.');
    }
}

// Define schema and model
const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, required: true },
    message: String,
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// API handler
export default async function handler(req, res) {
    console.log(`Received ${req.method} request on /api/submit`);

    if (req.method === 'POST') {
        try {
            console.log('Connecting to the database...');
            await connectToDatabase();
            console.log('Database connection established.');

            console.log('Parsing request body...');
            const { firstName, lastName, email, message } = req.body;
            console.log('Request Body:', { firstName, lastName, email, message });

            // Validate request data
            if (!firstName || !email) {
                console.log('Validation failed: Missing required fields.');
                return res.status(400).json({ error: 'First name and email are required.' });
            }

            // Save data to MongoDB
            console.log('Saving data to MongoDB...');
            const newContact = new Contact({ firstName, lastName, email, message });
            await newContact.save();
            console.log('Data saved successfully.');

            res.status(201).json({ message: 'Form submitted successfully!' });
        } catch (err) {
            console.error('Error in POST /api/submit:', err);
            res.status(500).json({ error: 'Internal server error.' });
        }
    } else {
        console.log(`Method ${req.method} not allowed on /api/submit`);
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

