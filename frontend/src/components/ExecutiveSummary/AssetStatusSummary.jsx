import React from 'react';
import './AssetStatusSummary.css';

const AssetStatusSummary = ({ summary, layout = 'vertical' }) => {
  if (!summary) return null;

  const statusItems = [
    { label: 'No. of Assets', value: summary.total, color: 'default' },
    { label: 'Working', value: summary.working, color: 'working' },
    { label: 'Failure Predicted', value: summary.failure_predicted, color: 'failure-predicted' },
    { label: 'Under Maintenance', value: summary.under_maintenance, color: 'under-maintenance' },
    { label: 'Breakdown', value: summary.breakdown, color: 'breakdown' },
  ];

  return (
    <div
      className={`asset-status-summary ${layout === 'horizontal' ? 'asset-status-summary--horizontal' : ''}`}
    >
      {statusItems.map((item) => (
        <div key={item.label} className={`status-card status-${item.color}`}>
          <div className="status-value">{item.value}</div>
          <div className="status-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default AssetStatusSummary;

