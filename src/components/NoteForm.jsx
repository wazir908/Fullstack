import React, { useState } from 'react';

export default function NoteForm({ employeeId, onNoteAdded }) {
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note || !date) return;
    await fetch(`https://crm-backend-8e1q.onrender.com/api/employees/${employeeId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: note, date }),
    });
    setNote('');
    setDate('');
    onNoteAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <h4>Add Note</h4>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <textarea placeholder="Note..." value={note} onChange={(e) => setNote(e.target.value)} required />
      <button type="submit">Add Note</button>
    </form>
  );
}
