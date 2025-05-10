import React, { useEffect, useState } from 'react';
import '../assets/css/Dashboard.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [openedJobs, setOpenedJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [performanceData, setPerformanceData] = useState({
    averagePerformance: 0,
    trend: [],
  });

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/employees');
      const data = await res.json();

      setEmployeeCount(data.length);

      // Calculate Average Performance
      const totalPerformance = data.reduce((sum, emp) => sum + (emp.performanceRating || 0), 0);
      const avgPerformance = totalPerformance / data.length || 0;
      setPerformanceData({
        averagePerformance: avgPerformance,
        trend: data.map(emp => ({
          name: emp.name,
          performance: emp.performanceRating || 0
        }))
      });

      // Collect and sort recent notes
      const notes = data.flatMap(emp =>
        (emp.notes || []).map(note => ({
          employeeName: emp.name,
          content: note.content,
          date: note.date
        }))
      );
      const sortedNotes = notes
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3); // Only latest 3
      setRecentNotes(sortedNotes);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchOpenedJobs();
  }, []);

  const fetchOpenedJobs = async () => {
    try {
      const res = await axios.get('/api/recruitments');
      const openJobs = res.data.filter(job => job.status === 'Open');
      setOpenedJobs(openJobs.slice(0, 3)); // Only latest 3
    } catch (error) {
      toast.error('Error fetching open jobs!');
    }
  };

  useEffect(() => {
    if (openedJobs.length > 0) {
      fetchAllApplicants();
    }
  }, [openedJobs]);

  const fetchAllApplicants = async () => {
    try {
      const allApplicants = [];

      for (const job of openedJobs) {
        const res = await axios.get(`/api/recruitments/${job._id}/applicants`);
        allApplicants.push(...res.data);
      }

      const sortedApplicants = allApplicants
        .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
        .slice(0, 3); // Only latest 3
      setApplicants(sortedApplicants);
    } catch (error) {
      toast.error('Error loading applicants!');
      console.error('Applicants fetch error:', error);
    }
  };

  const chartData = {
    labels: performanceData.trend.map(item => item.name),
    datasets: [
      {
        label: 'Performance Rating',
        data: performanceData.trend.map(item => item.performance),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Adds a background color to the area
        fill: true,
        tension: 0.4, // Smooths the curve
        pointBackgroundColor: '#ffffff',
        pointBorderColor: 'rgba(75, 192, 192, 1)',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#ff6384', // On hover, change point color
        pointHoverBorderColor: '#ff6384',
        pointHoverBorderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // To make sure the chart resizes
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 4,
      },
      legend: {
        labels: {
          color: '#fff', // Make the legend text white
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', // Light grid lines
        },
        ticks: {
          color: '#fff', // Make the X-axis labels white
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', // Light grid lines
        },
        ticks: {
          color: '#fff', // Make the Y-axis labels white
        },
      },
    },
    animation: {
      duration: 1500, // Set animation duration to 1.5 seconds
      easing: 'easeInOutQuad', // Set easing for smooth transition
    }
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
          <h3>Opened Jobs</h3>
          <p>{openedJobs.length}</p>
        </div>
        <div className="card">
          <h3>Applicants</h3>
          <p>{applicants.length}</p>
        </div>
        <div className="card">
          <h3>Avg. Performance Rating</h3>
          <p>{performanceData.averagePerformance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid-dashboard">
        <div className="analytics-section">
          <h3>Recent Notes</h3>
          <ul>
            {recentNotes.map((note, index) => (
              <li key={index}>
                <strong>{note.employeeName}</strong>: {note.content}{' '}
                <em>({new Date(note.date).toLocaleDateString()})</em>
              </li>
            ))}
          </ul>
        </div>

        <div className="analytics-section">
          <h3>Recent Applicants</h3>
          <ul>
            {applicants.map((app, index) => (
              <li key={index}>
                <strong>{app.name}</strong> - {app.email}
              </li>
            ))}
          </ul>
        </div>

        <div className="analytics-section">
          <h3>Recent Job Openings</h3>
          <ul>
            {openedJobs.map((job, index) => (
              <li key={index}>
                <strong>{job.title}</strong> - {job.position}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="chart-section">
        <h3>Performance Trend</h3>
        <div className="chart">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}