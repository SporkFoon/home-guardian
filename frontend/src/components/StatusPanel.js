import React from 'react';

const StatusPanel = ({ status }) => {
  if (!status) return <div>Loading status...</div>;
  
  return (
    <div className="status-panel">
      <div className={`status-indicator ${status.status.toLowerCase()}`}>
        <h2>{status.status}</h2>
        <div className="score">{status.scores.overall}</div>
      </div>
      
      <div className="metric-cards">
        <div className="metric-card">
          <h3>Temperature</h3>
          <div className="score">{status.scores.temperature}</div>
        </div>
        <div className="metric-card">
          <h3>Gas Safety</h3>
          <div className="score">{status.scores.gas}</div>
        </div>
        <div className="metric-card">
          <h3>Air Quality</h3>
          <div className="score">{status.scores.airQuality}</div>
        </div>
      </div>
      
      {status.alerts.length > 0 && (
        <div className="alerts-panel">
          <h3>Active Alerts</h3>
          <ul className="alerts-list">
            {status.alerts.map((alert, index) => (
              <li key={index} className={`alert ${alert.severity}`}>
                <strong>{alert.type.toUpperCase()}:</strong> {alert.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusPanel;