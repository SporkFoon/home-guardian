import React from 'react';
import './StatusPanel.css';

/**
 * StatusPanel Component
 * 
 * Displays the current safety status of the home including overall score,
 * individual metric scores, and any active alerts.
 * 
 * @param {Object} status - The current status data from the API
 */
const StatusPanel = ({ status }) => {
  if (!status) {
    return <div className="status-panel-loading">Loading status...</div>;
  }
  
  // Determine status class based on safety level
  const getStatusClass = () => {
    switch(status.status.toLowerCase()) {
      case 'safe':
        return 'safe';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'danger';
      default:
        return '';
    }
  };
  
  // Get severity class for alerts
  const getAlertClass = (severity) => {
    switch(severity) {
      case 'high':
        return 'alert-high';
      case 'medium':
        return 'alert-medium';
      case 'low':
        return 'alert-low';
      default:
        return '';
    }
  };

  return (
    <div className="status-panel">
      <div className={`status-indicator ${getStatusClass()}`}>
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
      
      {status.alerts && status.alerts.length > 0 && (
        <div className="alerts-panel">
          <h3>Active Alerts</h3>
          <ul className="alerts-list">
            {status.alerts.map((alert, index) => (
              <li key={index} className={`alert ${getAlertClass(alert.severity)}`}>
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