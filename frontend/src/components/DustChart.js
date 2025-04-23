import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import './Chart.css';

/**
 * DustChart Component
 * 
 * Displays dust (PM2.5) readings with reference lines for different
 * air quality thresholds.
 * 
 * @param {Array} data - Historical dust sensor data
 */
const DustChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-loading">Loading dust sensor data...</div>;
  }

  // PM2.5 threshold values based on EPA standards
  const thresholds = {
    good: 12,      // Good air quality (0-12 µg/m³)
    moderate: 35,  // Moderate air quality (12.1-35.4 µg/m³)
    unhealthy: 55, // Unhealthy for sensitive groups (35.5-55.4 µg/m³)
    danger: 150    // Unhealthy (55.5-150.4 µg/m³)
  };

  // Format tooltip to show PM2.5 value with unit
  const formatPM25 = (value) => {
    return `${value} µg/m³`;
  };

  // Get air quality status based on PM2.5 value
  const getAirQualityStatus = (value) => {
    if (value <= thresholds.good) return 'Good';
    if (value <= thresholds.moderate) return 'Moderate';
    if (value <= thresholds.unhealthy) return 'Unhealthy for Sensitive Groups';
    if (value <= thresholds.danger) return 'Unhealthy';
    return 'Hazardous';
  };

  // Custom tooltip to show air quality status
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pm25Value = payload[0].value;
      return (
        <div className="custom-tooltip">
          <p className="label">{`Time: ${label}`}</p>
          <p className="value">{`PM2.5: ${formatPM25(pm25Value)}`}</p>
          <p className="status">{`Status: ${getAirQualityStatus(pm25Value)}`}</p>
        </div>
      );
    }
    return null;
  };

  // Get the maximum dust value for y-axis domain
  const getMaxValue = () => {
    const max = Math.max(...data.map(entry => entry.dust || 0));
    return Math.max(max, thresholds.danger) * 1.1; // Add 10% padding
  };

  // Get appropriate bar color based on PM2.5 value
  const getBarFill = (entry) => {
    const value = entry.dust;
    if (value <= thresholds.good) return '#00e400'; // Green
    if (value <= thresholds.moderate) return '#ffff00'; // Yellow
    if (value <= thresholds.unhealthy) return '#ff7e00'; // Orange
    if (value <= thresholds.danger) return '#ff0000'; // Red
    return '#7f0000'; // Maroon
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">Dust Levels (PM2.5)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            tickFormatter={(time, index) => {
              return index % 4 === 0 ? time : '';
            }}
          />
          <YAxis domain={[0, getMaxValue()]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="dust" 
            name="PM2.5" 
            fill="#8884d8"
            fillOpacity={0.8}
            stroke="#8884d8"
            strokeWidth={1}
            barSize={20}
            // Dynamic color based on PM2.5 value
            fill={(entry) => getBarFill(entry)}
          />
          
          {/* Reference lines for air quality thresholds */}
          <ReferenceLine y={thresholds.good} stroke="#00e400" strokeDasharray="3 3" label={{ value: 'Good', position: 'insideTopLeft', fill: '#00e400' }} />
          <ReferenceLine y={thresholds.moderate} stroke="#ffff00" strokeDasharray="3 3" label={{ value: 'Moderate', position: 'insideTopLeft', fill: '#ffff00' }} />
          <ReferenceLine y={thresholds.unhealthy} stroke="#ff7e00" strokeDasharray="3 3" label={{ value: 'Unhealthy', position: 'insideTopLeft', fill: '#ff7e00' }} />
          <ReferenceLine y={thresholds.danger} stroke="#ff0000" strokeDasharray="3 3" label={{ value: 'Dangerous', position: 'insideTopLeft', fill: '#ff0000' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DustChart;