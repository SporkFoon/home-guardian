require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const api = require('./api');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// API routes
app.use('/api', api);

// Serve static files from frontend (for production)
app.use(express.static('../frontend/build'));

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});