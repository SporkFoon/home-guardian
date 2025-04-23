import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HumidityChart = ({ data }) => {
  return (
    <div className="chart-card">
      <h3>Humidity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temp1" stroke="#8884d8" name="Sensor 1" />
          <Line type="monotone" dataKey="temp2" stroke="#82ca9d" name="Sensor 2" />
          <Line type="monotone" dataKey="temp3" stroke="#ffc658" name="Sensor 3" />
          <Line type="monotone" dataKey="outdoorTemp" stroke="#ff8042" name="Outdoor" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;