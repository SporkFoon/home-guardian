const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  device_id: String,
  timestamp: { type: Date, default: Date.now },
  temp1: Number,
  humidity1: Number,
  temp2: Number,
  humidity2: Number,
  temp3: Number,
  humidity3: Number,
  smoke1: Number,
  smoke2: Number,
  lpg1: Number,
  lpg2: Number,
  co1: Number,
  co2: Number,
  dust: Number,
  weather: {
    temp: Number,
    humidity: Number,
    conditions: String
  }
});

module.exports = mongoose.model('Reading', readingSchema);