import React, { useState } from 'react';
import './DatabaseIndicator.css';

const DatabaseIndicator = ({ source, status = 'active', dataPreview = null }) => {
  const [showPopup, setShowPopup] = useState(false);

  // Generate mock data preview if not provided
  const getMockData = () => {
    if (dataPreview) return dataPreview;
    
    const mockDataMap = {
      'Asset Database': {
        records: 145,
        lastSync: '2 seconds ago',
        data: [
          { id: 'CASF1427567615', status: 'Failure Predicted', location: 'San Francisco' },
          { id: 'LABR4903786667', status: 'Breakdown', location: 'Baton Rouge' },
          { id: 'NDBS2148259407', status: 'Working', location: 'Bismarck' }
        ]
      },
      'Condition Monitoring': {
        records: 1240,
        lastSync: '1 second ago',
        data: [
          { sensor: 'Vibration-001', value: '102.5 mm/s²', threshold: '100 mm/s²', status: 'Warning' },
          { sensor: 'Temp-002', value: '175.8°F', threshold: '170°F', status: 'Warning' },
          { sensor: 'Vibration-003', value: '45.2 mm/s²', threshold: '100 mm/s²', status: 'Normal' }
        ]
      },
      'Maintenance Records': {
        records: 89,
        lastSync: '5 seconds ago',
        data: [
          { asset: 'CASF175811708', type: 'Preventive', date: '2023-02-15', status: 'In Progress' },
          { asset: 'LABR4903786667', type: 'Emergency', date: '2023-02-22', status: 'Scheduled' },
          { asset: 'CASF1427567615', type: 'Preventive', date: '2023-03-05', status: 'Scheduled' }
        ]
      },
      'Sensor Data Stream': {
        records: 3456,
        lastSync: 'Real-time',
        data: [
          { timestamp: '14:32:15', sensor: 'Vib-001', value: '98.5 mm/s²' },
          { timestamp: '14:32:14', sensor: 'Temp-002', value: '172.1°F' },
          { timestamp: '14:32:13', sensor: 'Vib-003', value: '45.8 mm/s²' }
        ]
      },
      'Vibration Sensors': {
        records: 28,
        lastSync: 'Real-time',
        data: [
          { sensor: 'Vib-001', location: 'P01-SF', value: '102.5 mm/s²', status: 'Warning' },
          { sensor: 'Vib-002', location: 'P02-BR', value: '122.8 mm/s²', status: 'Critical' },
          { sensor: 'Vib-003', location: 'P01-SF', value: '45.2 mm/s²', status: 'Normal' }
        ]
      },
      'Temperature Sensors': {
        records: 28,
        lastSync: 'Real-time',
        data: [
          { sensor: 'Temp-001', location: 'P01-SF', value: '175.8°F', status: 'Warning' },
          { sensor: 'Temp-002', location: 'P02-BR', value: '179.8°F', status: 'Critical' },
          { sensor: 'Temp-003', location: 'P01-SF', value: '142.5°F', status: 'Normal' }
        ]
      }
    };

    return mockDataMap[source] || {
      records: 0,
      lastSync: 'Unknown',
      data: []
    };
  };

  const mockData = getMockData();

  return (
    <>
      <div 
        className={`database-indicator ${status} clickable`}
        onClick={() => setShowPopup(true)}
        title="Click to view data preview"
      >
        <div className="database-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="4" rx="1" fill="currentColor" opacity="0.3"/>
            <rect x="3" y="10" width="18" height="4" rx="1" fill="currentColor" opacity="0.2"/>
            <rect x="3" y="16" width="18" height="4" rx="1" fill="currentColor" opacity="0.1"/>
            <circle className="pulse-dot" cx="20" cy="6" r="3" fill="currentColor"/>
          </svg>
        </div>
        <div className="database-info">
          <span className="database-source">{source}</span>
          <span className="database-status">{status === 'active' ? 'Syncing...' : 'Connected'}</span>
        </div>
        <div className="data-stream">
          <div className="stream-line"></div>
          <div className="stream-line"></div>
          <div className="stream-line"></div>
        </div>
      </div>

      {showPopup && (
        <div className="database-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="database-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>{source}</h3>
              <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
            </div>
            <div className="popup-content">
              <div className="popup-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Records:</span>
                  <span className="stat-value">{mockData.records.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Last Sync:</span>
                  <span className="stat-value">{mockData.lastSync}</span>
                </div>
              </div>
              <div className="popup-data-preview">
                <h4>Recent Data Preview:</h4>
                <div className="data-table">
                  {Object.keys(mockData.data[0] || {}).map(key => (
                    <div key={key} className="data-header">{key}</div>
                  ))}
                  {mockData.data.map((row, idx) => (
                    <React.Fragment key={idx}>
                      {Object.values(row).map((value, valIdx) => (
                        <div key={valIdx} className="data-cell">{String(value)}</div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DatabaseIndicator;

