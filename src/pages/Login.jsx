import React, { useState } from 'react';
import axios from 'axios';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);  // Toggle between login and register

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email, 
        password,  // Send password as plain text (we'll hash it in backend)
      });

      // If registration is successful, show a success message or do something else
      alert('Registration successful! You can now log in.');
      setIsRegistering(false);  // Switch to login view
      setError('');
    } catch (error) {
      setError('Registration failed, please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,  // Send email as 'email'
        password,  // Send password as 'password'
      });

      // If login is successful, store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      setIsAuthenticated(true);
      setError('');  // Clear any previous error messages
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>

      {/* Toggle between Register and Login */}
      <div>
        {isRegistering ? (
          <p>
            Already have an account? <a href="#" onClick={() => setIsRegistering(false)}>Login</a>
          </p>
        ) : (
          <p>
            Don't have an account? <a href="#" onClick={() => setIsRegistering(true)}>Register</a>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;