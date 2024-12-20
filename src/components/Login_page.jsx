import React from "react";
import "../styles/login-page.css";

const LoginPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic
    console.log("Login submitted!");
  };

  return (
    <div className="facebook-login-container">
      <div className="facebook-login-box">
        <h1 className="facebook-title">facebook</h1>
        <form className="facebook-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="email"
              placeholder="Email or Phone number"
              className="facebook-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="facebook-input"
              required
            />
          </div>
          <button type="submit" className="facebook-login-button">
            登录
          </button>
        </form>
        <a href="/forgot-password" className="facebook-forgot-password">
          忘记密码了吗？
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
