import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Layout = ({ children }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    // 实现登录逻辑
  };

  return (
    <>
      <div className="top-navigation">
        <i className="bi-facebook facebook-icon" />
        <span className="logo-text">facebook</span>
        <i className="bi-search search-icon" />
        <div className="top-mid-nav">
          <Link to="/" >
            <i className="bi-shop house-icon" />
          </Link>
          <i className="bi-people people-icon" />
          <i className="bi-controller game-icon" />
          <a href="https://www.google.com">
            <i className="bi-google google-icon" />
          </a>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <input type="text" placeholder="Email or phone number" name="email" required />
          <input type="password" placeholder="password" name="password" required />
          <button className="login-button" type="submit">login</button>
        </form>
        <Link to="/forgot-password" className="forgot-link">Forget your account?</Link>
        <div className="top-right-nav">
          <i className="bi-bell-fill msg-icon" />
          <i className="bi-person-circle account-icon" />
        </div>
      </div>
      {children}
    </>
  );
};

export default Layout;