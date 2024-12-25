// api/submit.js

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    if (req.method === 'POST') {
      // Handle form submission
      // For example, you could save the data here or send a response
      res.status(200).json({ message: 'Form submitted successfully!' });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }