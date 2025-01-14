import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation} from "react-router-dom";
import "../styles/login-page.css";
import { AuthContext } from "../AuthContext"; // 引入 AuthContext

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoggedIn, setIsLoggedIn, loggedInUser, setLoggedInUser } = useContext(AuthContext); // 使用 AuthContext
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from') || '/';
  console.log(searchParams);
  console.log(location);
  console.log('Redirecting back to:', from);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // 发送登录请求到后端
      const response = await axios.post(
        "http://54.82.75.121/users/login",
        formData
      );
  
      // 保存 JWT 到 localStorage
      localStorage.setItem("token", response.data.token);
      console.log("Log in Successfully!");
  
      // 更新 AuthContext 的状态
      setIsLoggedIn(true);
      setLoggedInUser(response.data.user.username); // 假设后端返回用户信息中的 username
      setErrorMessage("");
  
      // 跳转回用户来源页面，默认跳转到首页
      navigate(from);
    } catch (error) {
      setErrorMessage("Invalid email or password");
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
    
    <div className="MarketBay-login-container">
      <div className="MarketBay-login-box">
        {!isLoggedIn ? (
          // 登录表单
          <>
            <h1 className="MarketBay-title">MarketBay</h1>
            <form className="MarketBay-login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="MarketBay-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="MarketBay-input"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="MarketBay-login-button">
                Log in
              </button>
            </form>
            {errorMessage && (
              <p className="MarketBay-error-message">{errorMessage}</p>
            )}
            <button
              className="register-redirect-button"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
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
