import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Chart.css';

/**
 * GasChart Component
 * 
 * Displays gas sensor readings (smoke, LPG, CO) with toggle options
 * to show/hide different sensor types for better visualization.
 * 
 * @param {Array} data - Historical gas sensor data
 */
const GasChart = ({ data }) => {
  // State to track which gas types to display
  const [showSmoke, setShowSmoke] = useState(true);
  const [showLPG, setShowLPG] = useState(true);
  const [showCO, setShowCO] = useState(true);

  if (!data || data.length === 0) {
    return <div className="chart-loading">Loading gas sensor data...</div>;
  }

  // Get the appropriate y-axis domain based on visible data
  const getDomain = () => {
    let maxValue = 0;
    
    data.forEach(entry => {
      if (showSmoke) {
        maxValue = Math.max(maxValue, entry.smoke1 || 0, entry.smoke2 || 0);
      }
      if (showLPG) {
        maxValue = Math.max(maxValue, entry.lpg1 || 0, entry.lpg2 || 0);
      }
      if (showCO) {
        maxValue = Math.max(maxValue, entry.co1 || 0, entry.co2 || 0);
      }
    });
    
    return [0, Math.ceil(maxValue * 1.1)]; // Add 10% padding
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">Gas Levels</h3>
      
      <div className="chart-controls">
        <label>
          <input 
            type="checkbox" 
            checked={showSmoke} 
            onChange={() => setShowSmoke(!showSmoke)}
          />
          Smoke
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={showLPG} 
            onChange={() => setShowLPG(!showLPG)}
          />
          LPG
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={showCO} 
            onChange={() => setShowCO(!showCO)}
          />
          CO
        </label>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            tickFormatter={(time, index) => {
              return index % 4 === 0 ? time : '';
            }}
          />
          <YAxis domain={getDomain()} />
          <Tooltip 
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Legend />
          
          {/* Smoke Sensors */}
          {showSmoke && (
            <>
              <Line 
                type="monotone" 
                dataKey="smoke1" 
                stroke="#ff0000" 
                name="Smoke 1" 
                dot={false}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="smoke2" 
                stroke="#ff6666" 
                name="Smoke 2" 
                dot={false}
                activeDot={{ r: 8 }}
              />
            </>
          )}
          
          {/* LPG Sensors */}
          {showLPG && (
            <>
              <Line 
                type="monotone" 
                dataKey="lpg1" 
                stroke="#ff9900" 
                name="LPG 1" 
                dot={false}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="lpg2" 
                stroke="#ffcc00" 
                name="LPG 2" 
                dot={false}
                activeDot={{ r: 8 }}
              />
            </>
          )}
          
          {/* CO Sensors */}
          {showCO && (
            <>
              <Line 
                type="monotone" 
                dataKey="co1" 
                stroke="#660000" 
                name="CO 1" 
                dot={false}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="co2" 
                stroke="#990000" 
                name="CO 2" 
                dot={false}
                activeDot={{ r: 8 }}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
      
      <div className="threshold-indicators">
        {showSmoke && <div className="threshold smoke">Smoke Danger: 500</div>}
        {showLPG && <div className="threshold lpg">LPG Danger: 400</div>}
        {showCO && <div className="threshold co">CO Danger: 300</div>}
      </div>
    </div>
  );
};

export default GasChart;