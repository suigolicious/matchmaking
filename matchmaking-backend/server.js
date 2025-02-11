const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Sample Route
app.get('/', (req, res) => {
    res.send('Matchmaking Backend is Running! 🚀');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
