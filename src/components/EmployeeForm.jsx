import React, { useState } from 'react';

export default function EmployeeForm({ onAdd }) {
  const [form, setForm] = useState({
    name: '',
    client: '',
    startDate: '',
    promotionDate: '',
    contact: '',
    position: '', // Change 'designation' to 'position'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('https://crm-backend-8e1q.onrender.com/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', client: '', startDate: '', promotionDate: '', contact: '', position: '' }); // Clear position
    onAdd();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Add New Employee</h2>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="client"
        placeholder="Client"
        value={form.client}
        onChange={handleChange}
        required
      />
      <input
        name="contact"
        placeholder="Contact"
        value={form.contact}
        onChange={handleChange}
      />
      <input
        name="position" // Make sure this is 'position'
        placeholder="Position"
        value={form.position}
        onChange={handleChange}
        required
      />
      <label>Start Date:</label>
      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        required
      />
      <label>Promotion Date:</label>
      <input
        type="date"
        name="promotionDate"
        value={form.promotionDate}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Employee</button>
    </form>
  );
}
