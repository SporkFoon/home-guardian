import React, { useState, useEffect } from 'react';
import api from './services/api';
import StatusPanel from './components/StatusPanel';
import TemperatureChart from './components/TemperatureChart';
import HumidityChart from './components/HumidityChart';
import GasChart from './components/GasChart';
import DustChart from './components/DustChart';
import './App.css';

function App() {
  const [currentStatus, setCurrentStatus] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(24); // hours
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch status
        const statusData = await api.getStatus();
        setCurrentStatus(statusData);
        
        // Fetch historical data
        const historyData = await api.getHistoricalData(timeRange);
        
        // Format data for charts
        const formattedData = historyData.map(reading => ({
          time: new Date(reading.timestamp).toLocaleTimeString(),
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
        
        setHistoricalData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data periodically
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [timeRange]);
  
  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="app">
      <header className="header">
        <h1>Home Guardian Dashboard</h1>
        <div className="time-selector">
          <button onClick={() => setTimeRange(3)} className={timeRange === 3 ? 'active' : ''}>3h</button>
          <button onClick={() => setTimeRange(12)} className={timeRange === 12 ? 'active' : ''}>12h</button>
          <button onClick={() => setTimeRange(24)} className={timeRange === 24 ? 'active' : ''}>24h</button>
          <button onClick={() => setTimeRange(72)} className={timeRange === 72 ? 'active' : ''}>3d</button>
        </div>
      </header>
      
      <StatusPanel status={currentStatus} />
      
      <div className="charts-container">
        <TemperatureChart data={historicalData} />
        <HumidityChart data={historicalData} />
        <GasChart data={historicalData} />
        <DustChart data={historicalData} />
      </div>
    </div>
  );
}

export default App;