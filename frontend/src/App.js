import React, { useState, useEffect } from 'react';
import StatusPanel from './components/StatusPanel';
import TemperatureChart from './components/TemperatureChart';
import HumidityChart from './components/HumidityChart';
import GasChart from './components/GasChart';
import DustChart from './components/DustChart';
import api from './services/api';
import './App.css';

function App() {
  const [currentStatus, setCurrentStatus] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(24); // Default to 24 hours
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch real data from API
        let statusData, historyData;
        
        try {
          // Use actual API endpoints
          statusData = await api.getStatus();
          historyData = await api.getHistoricalData(timeRange);
        } catch (apiError) {
          console.error('API error:', apiError);
          setError('Failed to connect to the server. Please check your connection or try again later.');
          setLoading(false);
          return;
        }
        
        // Filter data based on selected time range if needed
        // (This is now handled by the API with the timeRange parameter)
        
        setCurrentStatus(statusData);
        setHistoricalData(historyData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [timeRange]);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading Home Guardian Dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="app">
      <header className="header">
        <div className="logo-container">
          <img src="/logo.png" alt="Home Guardian Logo" className="logo" />
          <h1>Home Guardian Dashboard</h1>
        </div>
        <div className="time-selector">
          <button 
            onClick={() => setTimeRange(3)} 
            className={timeRange === 3 ? 'active' : ''}
          >
            3h
          </button>
          <button 
            onClick={() => setTimeRange(12)} 
            className={timeRange === 12 ? 'active' : ''}
          >
            12h
          </button>
          <button 
            onClick={() => setTimeRange(24)} 
            className={timeRange === 24 ? 'active' : ''}
          >
            24h
          </button>
          <button 
            onClick={() => setTimeRange(72)} 
            className={timeRange === 72 ? 'active' : ''}
          >
            72h
          </button>
        </div>
      </header>
      
      <StatusPanel status={currentStatus} />
      
      <div className="charts-container">
        <TemperatureChart data={historicalData} />
        <HumidityChart data={historicalData} />
        <GasChart data={historicalData} />
        <DustChart data={historicalData} />
      </div>
      
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Home Guardian Project</p>
        <p>Data updates every minute</p>
      </footer>
    </div>
  );
}

export default App;