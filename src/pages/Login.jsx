import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation after successful login

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // For redirect after login

  const handleSendOtp = async () => {
    if (!email) return alert('Please enter your email'); // Validate email
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { email }, { withCredentials: true });
      setStep(2);
    } catch (err) {
      alert('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert('Please enter the OTP'); // Validate OTP
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { otp }, { withCredentials: true });
      navigate('/'); // Use navigate for redirection
    } catch (err) {
      alert('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {step === 1 ? (
        <>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter email"
            type="email"
          />
          <button onClick={handleSendOtp} disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <input
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP"
            type="text"
          />
          <button onClick={handleVerifyOtp} disabled={loading}>
            {loading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </>
      )}
    </div>
  );
};

export default Login;