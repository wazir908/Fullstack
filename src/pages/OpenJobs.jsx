import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { FaEye, FaUsers, FaTimes, FaFileAlt, FaShareAlt } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/Recruitment.css';
import '../assets/css/Openjobs.css';

const socket = io('https://crm-backend-8e1q.onrender.com');

const OpenJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/recruitments');
      setJobs(res.data.filter((job) => job.status === 'Open'));
    } catch (error) {
      toast.error('Error fetching open jobs!');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplicants = async (job) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/recruitments/${job._id}/applicants`);
      setApplicants(res.data);
      setSelectedJob(job);
      setIsApplicantsModalOpen(true);
      socket.emit('notification', { message: `Applicants viewed for Job ID: ${job._id}` });
    } catch (error) {
      toast.error('Failed to load applicants.');
    } finally {
      setLoading(false);
    }
  };

const handleShareLink = (jobId) => {
  const shareableLink = `${window.location.origin}/apply/${jobId}`;
  navigator.clipboard.writeText(shareableLink)
    .then(() => toast.success('📎 Link copied to clipboard!'))
    .catch(() => toast.error('❌ Failed to copy the link'));
};

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
    setApplicants([]);
  };

  const closeModal = () => {
    setIsJobModalOpen(false);
    setIsApplicantsModalOpen(false);
    setSelectedJob(null);
    setApplicants([]);
  };

  return (
    <div className="recruitment-container">
      <h1 className="recruitment-title">
        <FaFileAlt style={{ marginRight: '8px' }} /> Open Job Listings
      </h1>

      {loading && <div className="loading">Loading...</div>}

      <div className="job-table-header">
        <span>Title</span>
        <span>Department</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      <div className="job-table-body ">
        {jobs.map((job) => (
          <div key={job._id} className="job-row">
            <span>{job.title}</span>
            <span>{job.department}</span>
            <span className="truncate">{job.description}</span>
         <span className="job-actions actions-tab">
  <button className="view-btn" onClick={() => handleViewJob(job)}>
    <FaEye /> View Job
  </button>
  <button className="view-btn" onClick={() => handleViewApplicants(job)}>
    <FaUsers /> View Applicants
  </button>
  <button className="view-btn" onClick={() => handleShareLink(job._id)}>
    <FaShareAlt /> Share
  </button>
</span>

          </div>
        ))}
      </div>

      {/* Job Details Modal */}
      {isJobModalOpen && selectedJob && (
        <div className="job-modal-overlay" onClick={closeModal}>
          <div className="job-modal-drawer" onClick={(e) => e.stopPropagation()}>
            <h2>
              {selectedJob.title} — {selectedJob.department}
            </h2>
            <div className="modal-job-details">
              <p>
                <strong>Location:</strong> {selectedJob.location}
              </p>
              <p>
                <strong>Salary:</strong> {selectedJob.salary}
              </p>
              <p>
                <strong>Description:</strong>{' '}
                {selectedJob.detailedDescription || selectedJob.description}
              </p>
            </div>
            <button className="close-btn" onClick={closeModal}>
              <FaTimes /> Close
            </button>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {isApplicantsModalOpen && selectedJob && (
        <div className="applicants-modal-overlay" onClick={closeModal}>
          <div className="applicants-modal-drawer" onClick={(e) => e.stopPropagation()}>
            <h3>Applicants for {selectedJob.title}</h3>
            {applicants.length === 0 ? (
              <p>No applicants for this job yet.</p>
            ) : (
              applicants.map((applicant, index) => (
                <div key={index} className="applicant-item">
                  <p>
                    <strong>Name:</strong> {applicant.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {applicant.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {applicant.phone}
                  </p>
                  <p>
                    <strong>Current Salary:</strong> {applicant.currentSalary}
                  </p>
                  <p>
                    <strong>Expected Salary:</strong> {applicant.expectedSalary}
                  </p>
                  <p>
                    <strong>LinkedIn:</strong>{' '}
                    <a href={applicant.linkedinProfile} target="_blank" rel="noopener noreferrer">
                      {applicant.linkedinProfile}
                    </a>
                  </p>
                  <p>
                    <strong>Portfolio:</strong>{' '}
                    <a href={applicant.portfolioLink} target="_blank" rel="noopener noreferrer">
                      {applicant.portfolioLink}
                    </a>
                  </p>
                  <a className='view-resume-btn icon-with-text' href={applicant.resume} target="_blank" rel="noopener noreferrer ">
                    <FaFileAlt style={{ marginRight: '4px' }} />
                    View Resume
                  </a>
                  <hr />
                </div>
              ))
            )}
            <button className="close-btn" onClick={closeModal}>
              <FaTimes /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenJobs;