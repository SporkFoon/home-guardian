import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Chart.css';

/**
 * TemperatureChart Component
 * 
 * Displays temperature readings from the three sensors and outdoor temperature
 * in a line chart format.
 * 
 * @param {Array} data - Historical temperature data
 */
const TemperatureChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-loading">Loading temperature data...</div>;
  }

  // Format the tooltip value to display temperature with one decimal place
  const formatTemperature = (value) => {
    return `${value.toFixed(1)}°C`;
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">Temperature (°C)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            tickFormatter={(time, index) => {
              // Show fewer tick labels for better readability
              return index % 4 === 0 ? time : '';
            }}
          />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip 
            formatter={formatTemperature}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="temp1" 
            stroke="#8884d8" 
            name="Sensor 1" 
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="temp2" 
            stroke="#82ca9d" 
            name="Sensor 2" 
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="temp3" 
            stroke="#ffc658" 
            name="Sensor 3" 
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="outdoorTemp" 
            stroke="#ff8042" 
            name="Outdoor" 
            activeDot={{ r: 8 }}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;