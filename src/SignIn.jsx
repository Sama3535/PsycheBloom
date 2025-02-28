// SignIn.jsx
import React, { useState } from 'react';
import './SignIn.css'; // Import the CSS file

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic form validation
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    // Handle sign-in logic here (e.g., API call)
    console.log('Signing in with', { email, password });
    setError('');
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Sign In</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>

        <p className="signin-footer">
          Don't have an account? <a href="/SignUp">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
