import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/css/Auth.css';

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    if (!email || !password || (isSignup && !name)) {
      return toast.error('Please fill all required fields');
    }

    try {
      const url = isSignup ? 'https://crm-backend-8e1q.onrender.com/api/auth/signup' : 'https://crm-backend-8e1q.onrender.com/api/auth/login';
      const payload = isSignup ? { name, email, password } : { email, password };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      toast.success(data.message || (isSignup ? 'Account created' : 'Login successful'));
      resetFields();

      if (!isSignup) navigate('/'); // Redirect to home on login
      else setIsSignup(false); // Switch to login after signup
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleAuth}>
        {isSignup && (
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>

      <p className="toggle-text">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => setIsSignup(!isSignup)} className="toggle-btn">
          {isSignup ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default Auth;