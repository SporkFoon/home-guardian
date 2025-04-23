import axios from 'axios';

/**
 * API Service for the Home Guardian dashboard
 * Handles all interactions with the backend API
 */

// Get API URL from environment variables or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Configure axios instance with default settings
 */
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * API service object with methods for each endpoint
 */
const api = {
  /**
   * Get the latest sensor readings
   * @returns {Promise} Promise with the latest readings data
   */
  getLatestReading: async () => {
    try {
      const response = await apiClient.get('/readings/latest');
      return response.data;
    } catch (error) {
      console.error('Error fetching latest readings:', error);
      throw error;
    }
  },
  
  /**
   * Get historical sensor data for a specified time period
   * @param {number} hours - Number of hours to look back
   * @returns {Promise} Promise with the historical data
   */
  getHistoricalData: async (hours = 24) => {
    try {
      const response = await apiClient.get(`/readings/history?hours=${hours}`);
      
      // Format data for charts
      const formattedData = response.data.map(reading => ({
        time: new Date(reading.timestamp).toLocaleTimeString(),
        date: new Date(reading.timestamp).toLocaleDateString(),
        fullDate: new Date(reading.timestamp),
        temp1: reading.temp1,
        temp2: reading.temp2,
        temp3: reading.temp3,
        humidity1: reading.humidity1,
        humidity2: reading.humidity2,
        humidity3: reading.humidity3,
        smoke1: reading.smoke1,
        smoke2: reading.smoke2,
        lpg1: reading.lpg1,
        lpg2: reading.lpg2,
        co1: reading.co1,
        co2: reading.co2,
        dust: reading.dust,
        outdoorTemp: reading.weather?.temp,
        outdoorHumidity: reading.weather?.humidity
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  },
  
  /**
   * Get current safety status including scores and alerts
   * @returns {Promise} Promise with the safety status data
   */
  getStatus: async () => {
    try {
      const response = await apiClient.get('/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching safety status:', error);
      throw error;
    }
  },
  
  /**
   * Get overall system health (for monitoring the backend)
   * @returns {Promise} Promise with system health data
   */
  getHealth: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }
};

export default api;