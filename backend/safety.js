const express = require('express');
const router = express.Router();
const Reading = require('./models/Reading');

// Helper functions for safety calculations
function calculateTemperatureScore(reading) {
  const avgTemp = (reading.temp1 + reading.temp2 + reading.temp3) / 3;
  
  if (avgTemp < 0 || avgTemp > 50) return 0;
  if (avgTemp < 10) return 50;
  if (avgTemp > 35) return 50;
  if (avgTemp >= 20 && avgTemp <= 25) return 100;
  
  if (avgTemp < 20) return 50 + (avgTemp - 10) * 5;
  return 100 - (avgTemp - 25) * 3.3;
}

function calculateGasScore(reading) {
  const smokeThreshold = 500;
  const lpgThreshold = 400;
  const coThreshold = 300;
  
  const smokeLevel = Math.max(reading.smoke1, reading.smoke2);
  const lpgLevel = Math.max(reading.lpg1, reading.lpg2);
  const coLevel = Math.max(reading.co1, reading.co2);
  
  const smokeScore = Math.max(0, 100 - (smokeLevel / smokeThreshold * 100));
  const lpgScore = Math.max(0, 100 - (lpgLevel / lpgThreshold * 100));
  const coScore = Math.max(0, 100 - (coLevel / coThreshold * 100));
  
  return Math.round(smokeScore * 0.3 + lpgScore * 0.3 + coScore * 0.4);
}

function calculateAirQualityScore(reading) {
  const pm25 = reading.dust;
  
  if (pm25 <= 12) return 100;
  if (pm25 <= 35.4) return 75;
  if (pm25 <= 55.4) return 50;
  if (pm25 <= 150.4) return 25;
  return 0;
}

function checkForAlerts(reading) {
  const alerts = [];
  
  // Temperature alerts
  const avgTemp = (reading.temp1 + reading.temp2 + reading.temp3) / 3;
  if (avgTemp > 40) {
    alerts.push({
      type: 'temperature',
      severity: 'high',
      message: 'Extreme temperature detected!'
    });
  } else if (avgTemp > 30) {
    alerts.push({
      type: 'temperature',
      severity: 'medium',
      message: 'High temperature detected'
    });
  }
  
  // Gas alerts
  if (Math.max(reading.smoke1, reading.smoke2) > 500) {
    alerts.push({
      type: 'smoke',
      severity: 'high',
      message: 'Smoke detected!'
    });
  }
  
  // Add other alerts
  
  return alerts;
}

// GET endpoint for safety status
router.get('/', async (req, res) => {
  try {
    const latestReading = await Reading.findOne().sort({ timestamp: -1 });
    
    if (!latestReading) {
      return res.status(404).json({ error: 'No readings available' });
    }
    
    // Calculate safety scores
    const tempScore = Math.round(calculateTemperatureScore(latestReading));
    const gasScore = calculateGasScore(latestReading);
    const airScore = calculateAirQualityScore(latestReading);
    
    // Overall safety score
    const overallScore = Math.round((tempScore + gasScore + airScore) / 3);
    
    // Alert status
    const alerts = checkForAlerts(latestReading);
    
    res.json({
      timestamp: latestReading.timestamp,
      scores: {
        temperature: tempScore,
        gas: gasScore,
        airQuality: airScore,
        overall: overallScore
      },
      alerts,
      status: overallScore > 80 ? 'Safe' : overallScore > 50 ? 'Warning' : 'Danger'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate status' });
  }
});

module.exports = router;
module.exports.checkForAlerts = checkForAlerts;