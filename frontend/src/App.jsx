import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import DashboardStepNav from './components/Layout/DashboardStepNav';
import Header from './components/Layout/Header';
import ExecutiveSummary from './components/ExecutiveSummary/ExecutiveSummary';
import Anomalies from './components/Anomalies/Anomalies';
import RootCauseAnalysis from './components/RootCauseAnalysis/RootCauseAnalysis';
import Recommendations from './components/Recommendations/Recommendations';
import MaintenanceSchedule from './components/MaintenanceSchedule/MaintenanceSchedule';
import FormUpload from './components/FormUpload/FormUpload';
import { AppFlowProvider, useAppFlow } from './context/AppFlowContext';
import './App.css';

function HomeRedirect() {
  const { flow } = useAppFlow();
  if (!flow.outcome) return <Navigate to="/upload" replace />;
  if (flow.outcome === 'go' && !flow.fullDashboard) {
    return <Navigate to="/upload" replace />;
  }
  return <Navigate to="/executive-summary" replace />;
}

function RequireDashboard({ children }) {
  const { flow } = useAppFlow();
  if (flow.outcome === 'go' && !flow.fullDashboard) {
    return <Navigate to="/upload" replace />;
  }
  return children;
}

function AuthenticatedShell({ user, onLogout }) {
  const { showNavBar } = useAppFlow();
  const [selectedMonth, setSelectedMonth] = useState('Feb');
  const [selectedYear, setSelectedYear] = useState(2023);
  const [filters, setFilters] = useState({
    state: null,
    plant: null,
    asset_id: null,
  });

  const backgroundImageUrl = `${process.env.PUBLIC_URL}/backgroundf.PNG`;
  const appBgStyle = { position: 'relative' };
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
    zIndex: 0,
  };

  return (
    <Router>
      <div className="App" style={appBgStyle}>
        <div style={bgOverlayStyle} />
        <Header
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          filters={filters}
          onFiltersChange={setFilters}
          user={user}
          onLogout={onLogout}
        />
        {showNavBar ? <DashboardStepNav /> : null}
        <div className={`main-content ${showNavBar ? 'main-content--step-nav' : ''}`}>
          <Routes>
            <Route path="/upload" element={<FormUpload onLogout={onLogout} />} />
            <Route path="/" element={<HomeRedirect />} />
            <Route
              path="/executive-summary"
              element={
                <RequireDashboard>
                  <ExecutiveSummary
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </RequireDashboard>
              }
            />
            <Route
              path="/anomalies"
              element={
                <RequireDashboard>
                  <Anomalies
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </RequireDashboard>
              }
            />
            <Route
              path="/root-cause"
              element={
                <RequireDashboard>
                  <RootCauseAnalysis
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </RequireDashboard>
              }
            />
            <Route
              path="/recommendations"
              element={
                <RequireDashboard>
                  <Recommendations
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </RequireDashboard>
              }
            />
            <Route
              path="/maintenance"
              element={
                <RequireDashboard>
                  <MaintenanceSchedule
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </RequireDashboard>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function AppInner() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const { clearFlow, setFlow } = useAppFlow();

  const handleLogin = (userData) => {
    setFlow({ outcome: null, fullDashboard: false });
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearFlow();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return <AuthenticatedShell user={user} onLogout={handleLogout} />;
}

export default function App() {
  return (
    <AppFlowProvider>
      <AppInner />
    </AppFlowProvider>
  );
}
