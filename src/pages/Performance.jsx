import React, { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import '../assets/css/Performance.css';

export default function Performance() {
  const [employees, setEmployees] = useState([]);
  const [ratings, setRatings] = useState({});
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('latest');

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

  const filteredAndSortedEmployees = employees
    .filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortType === 'latest') {
        return b._id.localeCompare(a._id); // Assuming _id is like MongoID
      }
      return 0;
    });

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
      setSelectedEmp(null);
      fetchEmployees(); // reload updated ratings
    } catch (error) {
      console.error(error);
      alert('Error saving rating');
    }
  };

  const renderStars = (empId, rating, readOnly = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <FaStar
            key={i}
            className="performance-star"
            onClick={!readOnly ? () => handleRatingChange(empId, i) : undefined}
          />
        );
      } else if (rating >= i - 0.5) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className="performance-star"
            onClick={!readOnly ? () => handleRatingChange(empId, i) : undefined}
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className="performance-star"
            onClick={!readOnly ? () => handleRatingChange(empId, i) : undefined}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="performance-container">
      <h2 className="performance-title">Employee Performance</h2>

      {/* Top Controls */}
      <div className="performance-controls">
        <input
          type="text"
          placeholder="Search employee..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="sort-buttons">
          <button
            className={`sort-btn ${sortType === 'name' ? 'active' : ''}`}
            onClick={() => setSortType('name')}
          >
            Sort by Name
          </button>
          <button
            className={`sort-btn ${sortType === 'latest' ? 'active' : ''}`}
            onClick={() => setSortType('latest')}
          >
            Sort by Latest
          </button>
        </div>
      </div>

      {/* Employee List */}
      <div className="performance-table">
        {filteredAndSortedEmployees.map(emp => (
          <div className="performance-row" key={emp._id} onClick={() => setSelectedEmp(emp)}>
            <div className="emp-name">{emp.name}</div>
            <div className="emp-dept">{emp.department}</div>
            <div className="emp-rating">
              {renderStars(emp._id, ratings[emp._id] || 0, true)}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedEmp && (
        <div className="performance-modal-overlay">
          <div className="performance-modal">
            <button className="modal-close" onClick={() => setSelectedEmp(null)}>✕</button>
            <h3>{selectedEmp.name}</h3>
            <p><strong>Department:</strong> {selectedEmp.department}</p>
            <div className="performance-star-rating">
              {renderStars(selectedEmp._id, ratings[selectedEmp._id] || 0)}
            </div>
            <button
              className="performance-save-rating-btn"
              onClick={() => handleSave(selectedEmp._id)}
            >
              Save Rating
            </button>
          </div>
        </div>
      )}
    </div>
  );
}