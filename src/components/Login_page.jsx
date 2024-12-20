import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login-page.css";
import { AuthContext } from "../AuthContext"; // 引入 AuthContext

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoggedIn, setIsLoggedIn, loggedInUser, setLoggedInUser } = useContext(AuthContext); // 使用 AuthContext
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 发送登录请求到后端
      const response = await axios.post(
        "http://localhost:3000/users/login",
        formData
      );

      // 保存 JWT 到 localStorage
      localStorage.setItem("token", response.data.token);
      console.log("Log in Successfully!");

      // 更新 AuthContext 的状态
      setIsLoggedIn(true);
      setLoggedInUser(formData.username);
      setErrorMessage("");

      // 跳转到首页
      navigate("/");
    } catch (error) {
      setErrorMessage("Invalid username or password");
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => {
    // 清除 token 和重置状态
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setLoggedInUser("");
    setErrorMessage("");
  };

  return (
    <div className="facebook-login-container">
      <div className="facebook-login-box">
        {!isLoggedIn ? (
          // 登录表单
          <>
            <h1 className="facebook-title">facebook</h1>
            <form className="facebook-login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="facebook-input"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="facebook-input"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="facebook-login-button">
                Log in
              </button>
            </form>
            {errorMessage && (
              <p className="facebook-error-message">{errorMessage}</p>
            )}
            <button
              className="register-redirect-button"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
            <a href="/forgot-password" className="facebook-forgot-password">
              Forget your account?
            </a>
          </>
        ) : (
          // 显示已登录用户和注销按钮
          <div className="user-info">
            <p>Welcome, {loggedInUser}!</p>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
