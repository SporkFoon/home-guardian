const express = require('express');
const router = express.Router();
const Reading = require('./models/Reading');
const { getWeatherData } = require('./weather');
const { checkForAlerts } = require('./safety');

// POST endpoint for receiving sensor data
router.post('/', async (req, res) => {
  try {
    // Get weather data
    const weather = await getWeatherData(13.7563, 100.5018); // Bangkok coordinates
    
    // Create new reading
    const readingData = {
      ...req.body,
      weather,
      timestamp: new Date()
    };
    
    const reading = new Reading(readingData);
    await reading.save();
    
    // Check for alerts
    const alerts = checkForAlerts(readingData);
    
    res.status(201).json({ 
      message: 'Reading saved successfully',
      alerts
    });
  } catch (error) {
    console.error('Error saving reading:', error);
    res.status(500).json({ error: 'Failed to save reading' });
  }
});

// GET endpoint for latest readings
router.get('/latest', async (req, res) => {
  try {
    const latestReading = await Reading.findOne().sort({ timestamp: -1 });
    
    if (!latestReading) {
      return res.status(404).json({ error: 'No readings available' });
    }
    
    res.json(latestReading);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest reading' });
  }
});

// GET endpoint for historical data
router.get('/history', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const readings = await Reading.find({ 
      timestamp: { $gte: since } 
    }).sort({ timestamp: 1 });
    
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch historical readings' });
  }
});

module.exports = router;