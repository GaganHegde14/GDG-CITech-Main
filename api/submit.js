import mongoose from 'mongoose';

const uri = process.env.MONGO_URI; // Environment variable for MongoDB connection

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
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// API handler
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { firstName, lastName, email, message } = req.body;
            const newContact = new Contact({ firstName, lastName, email, message });
            await newContact.save();
            res.status(201).json({ message: 'Form submitted successfully!' });
        } catch (err) {
            console.error('Error in /submit endpoint:', err);
            res.status(500).json({ error: 'Failed to submit form' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

