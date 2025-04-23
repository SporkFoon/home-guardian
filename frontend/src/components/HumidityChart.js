import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Chart.css';

/**
 * HumidityChart Component
 * 
 * Displays humidity readings from the three sensors and outdoor humidity
 * in an area chart format.
 * 
 * @param {Array} data - Historical humidity data
 */
const HumidityChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-loading">Loading humidity data...</div>;
  }

  // Format the tooltip value to display humidity with percentage
  const formatHumidity = (value) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">Humidity (%)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            tickFormatter={(time, index) => {
              // Show fewer tick labels for better readability
              return index % 4 === 0 ? time : '';
            }}
          />
          <YAxis domain={[0, 100]} />
          <Tooltip 
            formatter={formatHumidity}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="humidity1" 
            stackId="1" 
            stroke="#8884d8" 
            fill="#8884d8" 
            name="Sensor 1"
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="humidity2" 
            stackId="2" 
            stroke="#82ca9d" 
            fill="#82ca9d" 
            name="Sensor 2"
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="humidity3" 
            stackId="3" 
            stroke="#ffc658" 
            fill="#ffc658" 
            name="Sensor 3"
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="outdoorHumidity" 
            stackId="4" 
            stroke="#ff8042" 
            fill="#ff8042" 
            name="Outdoor"
            fillOpacity={0.6}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HumidityChart;