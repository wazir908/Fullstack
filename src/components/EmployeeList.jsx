import React from 'react';
import EmployeeCard from './EmployeeCard';

export default function EmployeeList({ employees, onNoteAdded }) {
  return (
    <div className="employee-list">
      <h2>Employees</h2>
      {employees.length === 0 && <p>No employees found.</p>}
      {employees.map((emp) => (
        <EmployeeCard key={emp._id} employee={emp} onNoteAdded={onNoteAdded} />
      ))}
    </div>
  );
}
