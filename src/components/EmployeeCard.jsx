import React from 'react';
import { RiDeleteBin2Fill } from 'react-icons/ri'; // Import the delete icon
import NoteForm from './NoteForm';

export default function EmployeeCard({ employee, onNoteAdded, onDelete }) {
  return (
    <div className="employee-card">
      <div className="card-header">
        <h3>{employee.name}</h3>
        {/* Replace the emoji with the delete icon */}
        <button className="delete-button" onClick={() => onDelete(employee._id)}>
          <RiDeleteBin2Fill size={24} />
        </button>
      </div>
      <p><strong>Client:</strong> {employee.client}</p>
      <p><strong>Position:</strong> {employee.position}</p> {/* Display position here */}
      <p><strong>Start Date:</strong> {new Date(employee.startDate).toLocaleDateString()}</p>
      <p className={new Date(employee.promotionDate) < new Date() ? 'overdue' : ''}>
        <strong>Promotion Discussion:</strong> {new Date(employee.promotionDate).toLocaleDateString()}
      </p>

      <div className="notes">
        <h4>Notes</h4>
        {employee.notes.slice().reverse().map((note, i) => (
          <div key={i} className="note">
            <p><strong>{new Date(note.date).toLocaleDateString()}:</strong> {note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}