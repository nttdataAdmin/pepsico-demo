import React from 'react';
import './Header.css';

const Header = ({ selectedMonth, selectedYear, onMonthChange, onYearChange, filters, onFiltersChange, user, onLogout }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = [2022, 2023, 2024];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const getQuarter = (month) => {
    const monthIndex = months.indexOf(month);
    return quarters[Math.floor(monthIndex / 3)];
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-top">
          <div className="logo-container">
            <img 
              src={`${process.env.PUBLIC_URL}/logo.png`} 
              alt="PepsiCo Logo" 
              className="logo-image"
            />
          </div>
          <h1 className="header-title">PEPSICO MANAGEMENT SYSTEM</h1>
          <div className="header-center">
            <span className="system-description">AI-Powered Agentic Maintenance Management System</span>
          </div>
          <div className="header-right">
            <div className="header-links">
              <a 
                href="http://155.17.172.33:1789/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="production-link"
                title="Production line management system System"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V8C20 6.89543 19.1046 6 18 6H14M10 6C10 7.10457 10.8954 8 12 8C13.1046 8 14 7.10457 14 6M10 6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6M9 12H15M9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Production line management system
              </a>
            </div>
            {user && (
              <div className="user-section">
                <span className="user-name">Welcome, {user.username}</span>
                <button onClick={onLogout} className="logout-button">Logout</button>
              </div>
            )}
          </div>
        </div>
        <div className="timeline">
          <div className="timeline-years">
            {years.map((year) => (
              <div key={year} className="year-group">
                <span className="year-label">{year}</span>
                <div className="quarter-group">
                  {quarters.map((quarter) => (
                    <span key={quarter} className="quarter-label">{quarter}</span>
                  ))}
                </div>
                <div className="months-group">
                  {months.map((month) => (
                    <button
                      key={month}
                      className={`month-button ${selectedMonth === month && selectedYear === year ? 'active' : ''}`}
                      onClick={() => {
                        onMonthChange(month);
                        onYearChange(year);
                      }}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

