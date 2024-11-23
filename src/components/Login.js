import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import googleIcon from '../components/png-clipart-google-logo-google-logo-google-search-icon-google-text-logo-thumbnail.png';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setValue(storedEmail);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            navigate('/Home');
        } else {
            setError(data.message);
        }
    } catch (err) {
        setError('Failed to login');
    }
};

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setValue(user.email);
      localStorage.setItem('email', user.email);
      navigate('/Home');
    } catch (error) {
      setError('Failed to sign in with Google: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <p className="register-link">
            Not a member? <Link to="/signup">Register now</Link>
          </p>
          <h2>Hello Again!</h2>
          <p>Welcome back, you've been missed!</p>
        </div>
        {error && <p className="text-red-500">{error}</p>}
 <form onSubmit={handleLogin}>
  <input
    type="email"
    className="login-input"
    placeholder="Enter Email Address"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  <div className="password-container">
    <input
      type={showPassword ? 'text' : 'password'}
      className="login-input"
      placeholder="Enter Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <div className="show-password">
      <input
        type="checkbox"
        checked={showPassword}
        onChange={() => setShowPassword(!showPassword)}
      />
      <label>Show Password</label>
    </div>
  </div>
  <button type="submit" className="login-button1">
    Log In
  </button>
</form>
        <div className="social-login">
          <p>Or continue with</p>
          <div className="social-icons">
            <img
              src={googleIcon}
              alt="Google"
              className="social-icon"
              onClick={handleGoogleSignIn}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
