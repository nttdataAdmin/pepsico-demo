import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import NavBar from './components/Layout/NavBar';
import Header from './components/Layout/Header';
import ExecutiveSummary from './components/ExecutiveSummary/ExecutiveSummary';
import Anomalies from './components/Anomalies/Anomalies';
import RootCauseAnalysis from './components/RootCauseAnalysis/RootCauseAnalysis';
import Recommendations from './components/Recommendations/Recommendations';
import MaintenanceSchedule from './components/MaintenanceSchedule/MaintenanceSchedule';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('Feb');
  const [selectedYear, setSelectedYear] = useState(2023);
  const [filters, setFilters] = useState({
    state: null,
    plant: null,
    asset_id: null
  });

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const backgroundImageUrl = `${process.env.PUBLIC_URL}/backgroundf.PNG`;
  
  const appBgStyle = {
    position: 'relative'
  };

  const bgOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    opacity: 0.12,
    pointerEvents: 'none',
    zIndex: 0
  };

  return (
    <Router>
      <div className="App" style={appBgStyle}>
        <div style={bgOverlayStyle}></div>
        <Header 
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          filters={filters}
          onFiltersChange={setFilters}
          user={user}
          onLogout={handleLogout}
        />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/executive-summary" replace />} />
            <Route 
              path="/executive-summary" 
              element={
                <ExecutiveSummary 
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              } 
            />
            <Route 
              path="/anomalies" 
              element={
                <Anomalies 
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  filters={filters}
                />
              } 
            />
            <Route 
              path="/root-cause" 
              element={
                <RootCauseAnalysis 
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  filters={filters}
                />
              } 
            />
            <Route 
              path="/recommendations" 
              element={
                <Recommendations 
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  filters={filters}
                />
              } 
            />
            <Route 
              path="/maintenance" 
              element={
                <MaintenanceSchedule 
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  filters={filters}
                />
              } 
            />
          </Routes>
        </div>
        <NavBar />
      </div>
    </Router>
  );
}

export default App;

