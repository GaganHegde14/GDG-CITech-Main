import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;

let isConnected = false; // Track connection status

async function connectToDatabase() {
    if (!isConnected) {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        isConnected = true;
        console.log('Connected to MongoDB Atlas');
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

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectToDatabase(); // Ensure database is connected

            const { firstName, lastName, email, message } = req.body;

            // Validate request data
            if (!firstName || !email) {
                return res.status(400).json({ error: 'First name and email are required.' });
            }

            // Save data to MongoDB
            const newContact = new Contact({ firstName, lastName, email, message });
            await newContact.save();

            res.status(201).json({ message: 'Form submitted successfully!' });
        } catch (err) {
            console.error('Error in /api/submit:', err);
            res.status(500).json({ error: 'Failed to submit form.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
