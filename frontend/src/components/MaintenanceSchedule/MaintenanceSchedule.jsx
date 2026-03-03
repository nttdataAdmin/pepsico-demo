import React, { useState, useEffect } from 'react';
import { getMaintenanceSchedule } from '../../data/mockData';
import ScheduleTable from './ScheduleTable';
import './MaintenanceSchedule.css';

const MaintenanceSchedule = ({ selectedMonth, selectedYear, filters }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, [selectedMonth, selectedYear, filters]);

  const loadSchedule = () => {
    setLoading(true);
    setTimeout(() => {
      // Map month abbreviations to full names
      const monthMap = {
        'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
        'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
        'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
      };
      const monthName = monthMap[selectedMonth] || selectedMonth;
      
      const filterParams = {
        year: selectedYear,
        ...filters,
      };
      
      // Only add month filter if we have a valid month name
      if (monthName && monthName !== selectedMonth) {
        filterParams.month = monthName;
      }
      
      const data = getMaintenanceSchedule(filterParams);
      console.log('Loaded maintenance schedule:', data.length, 'with filters:', filterParams);
      setSchedule(data);
      setLoading(false);
    }, 300);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="maintenance-schedule-page">
      <h2 className="page-title">MAINTENANCE SCHEDULE</h2>
      <ScheduleTable schedule={schedule} />
    </div>
  );
};

export default MaintenanceSchedule;

