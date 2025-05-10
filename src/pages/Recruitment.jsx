import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';
import '../assets/css/Recruitment.css';

const socket = io('http://localhost:5000');

const Recruitment = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    salary: '',
    position: '',
    location: '',
    jobType: 'Full-time',
    status: 'Open',
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/recruitments');
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs', error);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/recruitments', form);
      setForm({
        title: '',
        department: '',
        description: '',
        requirements: '',
        salary: '',
        position: '',
        location: '',
        jobType: 'Full-time',
        status: 'Open',
      });
      fetchJobs();

      socket.emit('notification', { message: 'New job created successfully!' });
      toast.success('Job created successfully!');
    } catch (error) {
      console.error('Error creating job', error);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await axios.delete(`/api/recruitments/${id}`);
      fetchJobs();
      socket.emit('notification', { message: 'Job deleted successfully!' });
      toast.success('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job', error);
      toast.error('Error deleting job!');
    }
  };

  const handleViewApplicants = async (jobId) => {
    try {
      const res = await axios.get(`/api/recruitments/${jobId}/applicants`);
      setSelectedJob(jobId);
      setApplicants(res.data);
      socket.emit('notification', { message: `Applicants viewed for Job ID: ${jobId}` });
    } catch (error) {
      console.error('Error fetching applicants', error);
    }
  };

  const handleShareLink = (jobId) => {
    const shareableLink = `${window.location.origin}/apply/${jobId}`;
    navigator.clipboard.writeText(shareableLink)
      .then(() => alert('📎 Link copied to clipboard!'))
      .catch(() => alert('❌ Failed to copy the link'));
  };

  return (
    <div className="recruitment-container">
      <h1>📋 Recruitment Dashboard</h1>

      <form className="job-form" onSubmit={handleCreateJob}>
        <h2>Create New Job</h2>

        <input placeholder="Job Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
        <input placeholder="Position (e.g. Junior, Senior)" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required />
        <input placeholder="Location (e.g. Remote, Karachi)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        <input placeholder="Salary (e.g. $40k - $60k)" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
        
        <select value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>

        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <textarea placeholder="Requirements" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />

        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Open</option>
          <option>Closed</option>
        </select>

        <button type="submit">Add Job</button>
      </form>

      {/* Optional: Render job list here or in a separate component */}
    </div>
  );
};

export default Recruitment;
