import React, { useState, useEffect } from 'react';
import '../assets/css/Notes.css';

export default function Notes() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      const emp = employees.find(e => e._id === selectedEmployeeId);
      setNotes(emp?.notes || []);
    }
  }, [selectedEmployeeId, employees]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/employees');
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      setError('Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/employees/${selectedEmployeeId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: noteText }),
      });

      if (res.ok) {
        const updated = await res.json();
        setEmployees(employees.map(e => (e._id === updated._id ? updated : e)));
        setNotes(updated.notes || []);
        setNoteText('');
      } else {
        setError('Failed to add note');
      }
    } catch (error) {
      setError('Error adding note');
    }
  };

  return (
    <div className="notes-page">
      <h2 className="title">Employee Notes</h2>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="note-form">
          <div className="form-group">
            <label htmlFor="employee-select">Select Employee:</label>
            <select
              id="employee-select"
              className="select"
              value={selectedEmployeeId}
              onChange={e => setSelectedEmployeeId(e.target.value)}
            >
              <option value="">-- Select --</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {selectedEmployeeId && (
            <>
              <div className="form-group">
                <label htmlFor="note-text">Write Note:</label>
                <textarea
                  id="note-text"
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Enter note here..."
                  className="textarea"
                />
              </div>

              <button
                onClick={handleAddNote}
                className="add-note-btn"
              >
                Add Note
              </button>

              <div className="notes-section">
                <h3 className="notes-title">Previous Notes:</h3>
                <div className="notes-container">
                  {notes.length > 0 ? (
                    notes.slice().reverse().map((note, index) => (
                      <div key={index} className="note-card">
                        <div className="note-header">
                          <strong className="note-date">
                            {new Date(note.date).toLocaleDateString()}
                          </strong>
                        </div>
                        <div className="note-content">
                          <p>{note.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-notes">No notes available</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}