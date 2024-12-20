import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    // Simple login logic (you can replace this with real authentication logic)
    if (email === 'test@example.com' && password === 'password') {
      alert('Login successful!');
      navigate('/'); // Navigate to homepage or dashboard
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleAccountIconClick = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <>
      <div className="top-navigation">
        <i className="bi-facebook facebook-icon" />
        <span className="logo-text">facebook</span>
        <i className="bi-search search-icon" />
        <div className="top-mid-nav">
          <Link to="/">
            <i className="bi-shop house-icon" />
          </Link>
          <i className="bi-people people-icon" />
          <i className="bi-controller game-icon" />
          <a href="https://www.google.com">
            <i className="bi-google google-icon" />
          </a>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or phone number"
            name="email"
            required
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            required
          />
          <button className="login-button" type="submit">
            login
          </button>
        </form>
        <Link to="/forgot-password" className="forgot-link">
          Forget your account?
        </Link>
        <div className="top-right-nav">
          <i
            className="bi-bell-fill msg-icon"
            title="Notifications"
          />
          <i
            className="bi-person-circle account-icon"
            title="Account"
            onClick={handleAccountIconClick} // Navigate to login on click
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
      {children}
    </>
  );
};

export default Layout;
