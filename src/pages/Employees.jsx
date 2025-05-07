import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeCard from '../components/EmployeeCard';
import { Button, Input, Modal, Spinner } from '../components/ui';
import '../assets/css/EmployeeDashboard.css';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/employees');
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async () => {
  if (!employeeToDelete) return;
  try {
    // Optimistic UI update: remove the employee immediately from the list
    setEmployees(employees.filter((employee) => employee._id !== employeeToDelete));
    setDeleteConfirmOpen(false); // Close the delete confirmation modal

    // Make the delete API call
    const res = await fetch(`http://localhost:5000/api/employees/${employeeToDelete}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete employee');
    }

    // Re-fetch employees after deletion to ensure the data is updated
    fetchEmployees(); // This will reload the employees list

    setSuccessMessage('Employee deleted successfully'); // Show success message
    setEmployeeToDelete(null); // Reset the employee to delete
  } catch (err) {
    setDeleteError('Failed to delete employee');
    console.error('Error during deletion:', err.message);
  }
};


  const handleSortChange = (sortBy) => {
    const sortedEmployees = [...employees].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'startDate') {
        return sortOrder === 'asc'
          ? new Date(a.startDate) - new Date(b.startDate)
          : new Date(b.startDate) - new Date(a.startDate);
      }
      return 0;
    });
    setEmployees(sortedEmployees);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredEmployees = currentEmployees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="employee-dashboard">
      <div className="header">
        <h2 className="title">Employee Dashboard</h2>
        {/* Button with icon and text */}
        <Button onClick={() => setModalOpen(true)} className="add-btn">
          <AiOutlinePlus size={24} style={{ marginRight: '8px' }} />
          Add Employee
        </Button>
      </div>

      <Input
        placeholder="Search Employees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="sort-buttons">
        <Button onClick={() => handleSortChange('name')} className="sort-btn">Sort by Name</Button>
        <Button onClick={() => handleSortChange('startDate')} className="sort-btn">Sort by Start Date</Button>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredEmployees.length > 0 ? (
        <div className="employee-grid">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              onNoteAdded={fetchEmployees}
              onDelete={() => {
                setEmployeeToDelete(employee._id);
                setDeleteConfirmOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <p className="no-employees">No employees found.</p>
      )}

      {successMessage && <div className="success-message">{successMessage}</div>}
      {deleteError && <div className="error-message">{deleteError}</div>}

      <div className="pagination">
        {Array.from({ length: Math.ceil(employees.length / employeesPerPage) }, (_, i) => (
          <Button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className="page-btn"
          >
            {i + 1}
          </Button>
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <EmployeeForm onAdd={() => { fetchEmployees(); setModalOpen(false); }} />
        </Modal>
      )}

      {isDeleteConfirmOpen && (
        <Modal onClose={() => setDeleteConfirmOpen(false)}>
          <div className="delete-confirm">
            <h3>Are you sure you want to delete this employee?</h3>
            <div className="delete-actions">
              <Button
                onClick={handleDelete} // Trigger the delete action
                className="delete-btn"
              >
                Yes, Delete
              </Button>
              <Button onClick={() => setDeleteConfirmOpen(false)} className="cancel-btn">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}