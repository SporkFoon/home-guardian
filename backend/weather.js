const axios = require('axios');

async function getWeatherData(latitude, longitude) {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });
    
    return {
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      conditions: response.data.weather[0].main
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

module.exports = { getWeatherData };