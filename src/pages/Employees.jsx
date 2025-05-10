import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeCard from '../components/EmployeeCard';
import { Button, Input, Modal, Spinner } from '../components/ui';
import '../assets/css/EmployeeDashboard.css';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/employees');
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        setError('Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/employees/${id}`, { method: 'DELETE' });
      setEmployees(employees.filter(emp => emp._id !== id));
      setSelectedEmployee(null);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  // Filter and sort employees before pagination
  const filtered = employees
    .filter((e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'latest') {
        return new Date(b.startDate) - new Date(a.startDate);
      }
      return 0;
    });

  const indexOfLast = currentPage * employeesPerPage;
  const indexOfFirst = indexOfLast - employeesPerPage;
  const currentEmployees = filtered.slice(indexOfFirst, indexOfLast);

  return (
    <div className="employee-dashboard">
      <div className="header">
        <h2 className="title">Employee Dashboard</h2>
        <Button onClick={() => setModalOpen(true)} className="add-btn">
          <AiOutlinePlus size={20} />
          Add Employee
        </Button>
      </div>

      <div className="controls-row">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="sort-buttons">
          <Button
            onClick={() => setSortOption('name')}
            className={`sort-btn ${sortOption === 'name' ? 'active' : ''}`}
          >
            Sort by Name
          </Button>
          <Button
            onClick={() => setSortOption('latest')}
            className={`sort-btn ${sortOption === 'latest' ? 'active' : ''}`}
          >
            Sort by Latest
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Client</th>
              <th>Start Date</th>
              <th>Promotion Date</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((emp) => (
              <tr key={emp._id} onClick={() => handleEmployeeClick(emp)} className="clickable-row">
                <td>{emp.name}</td>
                <td>{emp.position || '—'}</td>
                <td>{emp.client}</td>
                <td>{new Date(emp.startDate).toLocaleDateString()}</td>
                <td>{new Date(emp.promotionDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filtered.length / employeesPerPage) }, (_, i) => (
          <Button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <EmployeeForm
            onAdd={() => {
              setModalOpen(false);
              window.location.reload();
            }}
          />
        </Modal>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <Modal onClose={() => setSelectedEmployee(null)}>
          <EmployeeCard
            employee={selectedEmployee}
            onDelete={handleDelete}
            onNoteAdded={() => {}}
          />
        </Modal>
      )}
    </div>
  );
}