import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = {
  getLatestReading: async () => {
    const response = await axios.get(`${API_URL}/readings/latest`);
    return response.data;
  },
  
  getHistoricalData: async (hours = 24) => {
    const response = await axios.get(`${API_URL}/readings/history?hours=${hours}`);
    return response.data;
  },
  
  getStatus: async () => {
    const response = await axios.get(`${API_URL}/status`);
    return response.data;
  }
};

export default api;