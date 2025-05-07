import React, { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // FontAwesome star icons
import '../assets/css/Performance.css'; // Update this CSS for styling

export default function Performance() {
  const [employees, setEmployees] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/employees');
      const data = await res.json();
      setEmployees(data);

      const initialRatings = {};
      data.forEach(emp => {
        initialRatings[emp._id] = emp.performanceRating || 0;
      });
      setRatings(initialRatings);
    } catch (error) {
      console.error('Failed to load employees:', error);
    }
  };

  const handleRatingChange = (id, value) => {
    if (value >= 0 && value <= 5) {
      setRatings(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${id}/rating`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ performanceRating: ratings[id] }),
      });
      if (!res.ok) throw new Error('Failed to update rating');
      alert('Rating updated!');
    } catch (error) {
      console.error(error);
      alert('Error saving rating');
    }
  };

  const renderStars = (empId, rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <FaStar
            key={i}
            className="performance-star"
            onClick={() => handleRatingChange(empId, i)}
          />
        );
      } else if (rating >= i - 0.5) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className="performance-star"
            onClick={() => handleRatingChange(empId, i)}
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className="performance-star"
            onClick={() => handleRatingChange(empId, i)}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="performance-container">
      <h2 className="performance-title">Employee Performance Management</h2>

      <div className="performance-employee-list">
        {employees.map(emp => (
          <div className="performance-employee-card" key={emp._id}>
            <h4 className="performance-employee-name">{emp.name}</h4>
            <p className="performance-employee-department">Department: {emp.department}</p>
            <p className="performance-employee-rating">Current Rating: {emp.performanceRating || 0}</p>

            <div className="performance-star-rating">
              {renderStars(emp._id, ratings[emp._id] || 0)}
            </div>

            <button onClick={() => handleSave(emp._id)} className="performance-save-rating-btn">
              Save Rating
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}