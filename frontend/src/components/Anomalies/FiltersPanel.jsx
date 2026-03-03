import React, { useState } from 'react';
import './FiltersPanel.css';

const FiltersPanel = ({ filters, onFiltersChange }) => {
  const [searchState, setSearchState] = useState('');
  const [searchPlant, setSearchPlant] = useState('');
  const [searchAssetId, setSearchAssetId] = useState('');

  const states = ['California', 'Louisiana', 'New York', 'North Carolina', 'North Dakota'];
  const plants = [
    'P01 - San Francisco',
    'P02 - Bakersfield',
    'P03 - Los Angeles',
    'P02 - Baton Rouge',
    'P01 - Lafayette',
    'P01 - Albany',
    'P01 - Raleigh',
    'P02 - Bryson City',
    'P02 - Bismarck',
    'P01 - Grand Forks',
  ];

  const filteredStates = states.filter((state) =>
    state.toLowerCase().includes(searchState.toLowerCase())
  );
  const filteredPlants = plants.filter((plant) =>
    plant.toLowerCase().includes(searchPlant.toLowerCase())
  );

  return (
    <div className="filters-panel card">
      <div className="filters-title">FILTERS</div>

      <div className="filter-section">
        <div className="filter-label">State</div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search"
            value={searchState}
            onChange={(e) => setSearchState(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="checkbox-list">
          {filteredStates.map((state) => (
            <label key={state} className="checkbox-item">
              <input
                type="checkbox"
                checked={filters.state === state}
                onChange={(e) => {
                  onFiltersChange({
                    ...filters,
                    state: e.target.checked ? state : null,
                  });
                }}
              />
              <span>{state}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-label">Plant</div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search"
            value={searchPlant}
            onChange={(e) => setSearchPlant(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="checkbox-list">
          {filteredPlants.map((plant) => (
            <label key={plant} className="checkbox-item">
              <input
                type="checkbox"
                checked={filters.plant === plant}
                onChange={(e) => {
                  onFiltersChange({
                    ...filters,
                    plant: e.target.checked ? plant : null,
                  });
                }}
              />
              <span>{plant}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-label">Asset ID</div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search"
            value={searchAssetId}
            onChange={(e) => {
              setSearchAssetId(e.target.value);
              onFiltersChange({
                ...filters,
                asset_id: e.target.value || null,
              });
            }}
            className="search-input"
          />
        </div>
        {filters.asset_id && (
          <div className="asset-id-display">{filters.asset_id}</div>
        )}
      </div>
    </div>
  );
};

export default FiltersPanel;

