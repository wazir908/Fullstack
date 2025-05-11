import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/Apply.css';

const Apply = () => {
  const { jobId } = useParams(); // Fetching jobId from the URL
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentSalary: '',
    expectedSalary: '',
    linkedinProfile: '', // LinkedIn profile field
    portfolioLink: '',   // Portfolio link field
    coverLetter: '',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumePreview, setResumePreview] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes (resume)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB.');
        return;
      }
      setResumeFile(file);
      setResumeFileName(file.name);
      setResumePreview(URL.createObjectURL(file)); // Preview the uploaded resume
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if jobId exists
    if (!jobId) {
      alert('Job ID is missing.');
      return;
    }

    // Check if required fields are filled
    const requiredFields = ['name', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in your ${field}.`);
        return;
      }
    }

    // Check if resume is uploaded
    if (!resumeFile) {
      alert('Please upload your resume.');
      return;
    }

    setLoading(true);

    try {
      // Creating FormData to send to the backend
      const submission = new FormData();
      Object.entries(formData).forEach(([key, val]) => submission.append(key, val));
      submission.append('resume', resumeFile);

      // Send the data to the backend
      const res = await axios.post(
        `https://crm-backend-8e1q.onrender.com/api/recruitments/${jobId}/applicants`,
        submission,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert('Application submitted successfully!');
      setResumePreview(`https://crm-backend-8e1q.onrender.com/${res.data.applicant.resume}`);

      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        currentSalary: '',
        expectedSalary: '',
        linkedinProfile: '',
        portfolioLink: '',
        coverLetter: '',
      });
      setResumeFile(null);
      setResumeFileName('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="apply-container">
    <div>
      <h2>Apply for Job</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Input Fields */}
        <input
          name="name"
          onChange={handleChange}
          value={formData.name}
          placeholder="Name"
          required
        />
        <input
          name="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="Email"
          required
        />
        <input
          name="phone"
          onChange={handleChange}
          value={formData.phone}
          placeholder="Phone"
          required
        />
        <input
          name="currentSalary"
          onChange={handleChange}
          value={formData.currentSalary}
          placeholder="Current Salary"
        />
        <input
          name="expectedSalary"
          onChange={handleChange}
          value={formData.expectedSalary}
          placeholder="Expected Salary"
        />
        <input
          name="linkedinProfile"
          onChange={handleChange}
          value={formData.linkedinProfile}
          placeholder="LinkedIn Profile"
        />
        <input
          name="portfolioLink"
          onChange={handleChange}
          value={formData.portfolioLink}
          placeholder="Portfolio Link"
        />
        <textarea
          name="coverLetter"
          onChange={handleChange}
          value={formData.coverLetter}
          placeholder="Cover Letter"
        />

        {/* File Upload */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {resumePreview && (
          <div>
            <h4>Resume Preview</h4>
            <iframe src={resumePreview} width="100%" height="300px" />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default Apply;