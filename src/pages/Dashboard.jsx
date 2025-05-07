import React, { useEffect, useState } from 'react';
import '../assets/css/Dashboard.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function Dashboard() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [upcomingPromotions, setUpcomingPromotions] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [recentHires, setRecentHires] = useState([]);
  const [performanceData, setPerformanceData] = useState({ averagePerformance: 0, trend: [] });
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/employees');
      const data = await res.json();
      setEmployeeCount(data.length);

      const now = new Date();

      const promotions = data.filter(emp => {
        const hireDate = new Date(emp.startDate);
        const reviewDate = new Date(hireDate);
        reviewDate.setMonth(hireDate.getMonth() + 11);
        return reviewDate > now && reviewDate - now < 30 * 24 * 60 * 60 * 1000;
      });
      setUpcomingPromotions(promotions);

      const hiresInRange = data.filter(emp => {
        const hireDate = new Date(emp.startDate);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return hireDate >= startDate && hireDate <= endDate;
      });
      setRecentHires(hiresInRange);

      const totalPerformance = data.reduce((sum, emp) => sum + (emp.performanceRating || 0), 0);
      const avgPerformance = totalPerformance / data.length || 0;
      setPerformanceData({
        averagePerformance: avgPerformance,
        trend: data.map(emp => ({ name: emp.name, performance: emp.performanceRating || 0 }))
      });

      const notes = data.flatMap(emp => (emp.notes || []).map(note => ({
        employeeName: emp.name,
        content: note.content,
        date: note.date,
      })));
      const sortedNotes = notes.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
      setRecentNotes(sortedNotes);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const chartData = {
    labels: performanceData.trend.map(item => item.name),
    datasets: [
      {
        label: 'Performance Rating',
        data: performanceData.trend.map(item => item.performance),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard Overview</h2>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Employees</h3>
          <p>{employeeCount}</p>
        </div>
        <div className="card">
          <h3>Upcoming Promotions (30 days)</h3>
          <p>{upcomingPromotions.length}</p>
        </div>
        <div className="card">
          <h3>Recent Hires (Custom Range)</h3>
          <p>{recentHires.length}</p>
        </div>
        <div className="card">
          <h3>Average Performance Rating</h3>
          <p>{performanceData.averagePerformance.toFixed(2)}</p>
        </div>
      </div>

      <div className="analytics-section">
        <h3>Recent Notes</h3>
        <ul>
          {recentNotes.map((note, index) => (
            <li key={index}>
              <strong>{note.employeeName}</strong>: {note.content} <em>({new Date(note.date).toLocaleDateString()})</em>
            </li>
          ))}
        </ul>
      </div>

      <div className="chart-section">
        <h3>Performance Trend</h3>
        <div className="chart">
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
}
