import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext"; // 引入 AuthContext
import "../styles/style.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, loggedInUser, setLoggedInUser } = useContext(AuthContext); // 使用 AuthContext
  const [formData, setFormData] = useState({ username: "", password: "" }); // 表单数据
  const [errorMessage, setErrorMessage] = useState(""); // 错误信息

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 发送登录请求到后端
      const response = await axios.post("http://localhost:3000/users/login", formData);

      // 保存 JWT 到 localStorage
      localStorage.setItem("token", response.data.token);

      // 更新 AuthContext 的状态
      setIsLoggedIn(true);
      setLoggedInUser(formData.username);

      // 清除错误信息
      setErrorMessage("");
      setFormData({ username: "", password: "" }); // 重置表单
      alert("Login successful!");
    } catch (error) {
      setErrorMessage("Invalid username or password. Please try again.");
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    // 清除 token 和更新状态
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setLoggedInUser("");
    setErrorMessage("");
    navigate("/"); // 注销后跳转到主页
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

        {!isLoggedIn ? (
          // 未登录时显示的表单
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button className="login-button" type="submit">
              Login
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        <Link to="/forgot-password" className="forgot-link">
          Forget your account?
        </Link>
          </form>
        ) : (
          // 登录后显示用户名和注销按钮
          <div className="user-info">
            <span className="welcome-text">Welcome, {loggedInUser}!</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

        <div className="top-right-nav">
          <i className="bi-bell-fill msg-icon" title="Notifications" />
          <i
            className="bi-person-circle account-icon"
            title="Account"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      {children}
    </>
  );
};

export default Layout;
