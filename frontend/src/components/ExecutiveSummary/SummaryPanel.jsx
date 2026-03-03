import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './SummaryPanel.css';

const SummaryPanel = ({ assets, selectedMonth, selectedYear }) => {
  const chartData = useMemo(() => {
    const statusCounts = {
      'Breakdown': 0,
      'Failure Predicted': 0,
      'Under Maintenance': 0,
    };

    assets.forEach((asset) => {
      if (asset.status === 'Breakdown') statusCounts['Breakdown']++;
      else if (asset.status === 'Failure Predicted') statusCounts['Failure Predicted']++;
      else if (asset.status === 'Under Maintenance') statusCounts['Under Maintenance']++;
    });

    return [
      { name: selectedMonth, Breakdown: statusCounts['Breakdown'], 'Failure Predicted': statusCounts['Failure Predicted'], 'Under Maintenance': statusCounts['Under Maintenance'] }
    ];
  }, [assets, selectedMonth]);

  const tableData = useMemo(() => {
    return assets
      .filter((asset) => 
        asset.status === 'Breakdown' || 
        asset.status === 'Failure Predicted' || 
        asset.status === 'Under Maintenance'
      )
      .slice(0, 10);
  }, [assets]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Working': return 'var(--color-working)';
      case 'Failure Predicted': return 'var(--color-failure-predicted)';
      case 'Under Maintenance': return 'var(--color-under-maintenance)';
      case 'Breakdown': return 'var(--color-breakdown)';
      default: return '#ccc';
    }
  };

  return (
    <div className="summary-panel">
      <div className="card">
        <div className="card-title">SUMMARY</div>
        <div className="search-bar">
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Breakdown" fill="var(--color-breakdown)" />
              <Bar dataKey="Failure Predicted" fill="var(--color-failure-predicted)" />
              <Bar dataKey="Under Maintenance" fill="var(--color-under-maintenance)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="asset-table">
          <table>
            <thead>
              <tr>
                <th>Plant</th>
                <th>Asset type</th>
                <th>Asset ID</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((asset, index) => (
                <tr key={index}>
                  <td>{asset.plant}</td>
                  <td>{asset.asset_type}</td>
                  <td>
                    <span 
                      className="asset-id-badge"
                      style={{ backgroundColor: getStatusColor(asset.status) }}
                    >
                      {asset.asset_id}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;

