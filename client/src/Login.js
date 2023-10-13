import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import logo from './logo.jpg';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      username: username,
      password: password
    };

    try {
      const response = await fetch('http://localhost:9000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 200) {
        const { token } = await response.json(); // Parse the JSON response
        console.log('token', token);
        localStorage.setItem('token', token);
        onLogin(username);
      } else {
        // Handle different error status codes with specific error messages
        if (response.status === 401) {
          alert('Invalid username or password');
        } else {
          alert('Login failed. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('An error occurred during login. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="right-panel">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />

            <div className="forgot-password-text">
              <a href="#">Forget Password?</a>
            </div>
          </div>
          <div className="form-group">
            <br />
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
