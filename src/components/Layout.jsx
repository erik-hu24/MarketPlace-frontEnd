import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext"; // 引入 AuthContext
import "../styles/style.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ChatApp from "../components/ChatApp"; // 引入 ChatApp 组件

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // 获取当前路径
  const { isLoggedIn, setIsLoggedIn, loggedInUser, setLoggedInUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  // check if the user in the product detail page or not
  const isProductDetailPage = location.pathname.startsWith('/product/');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://54.82.75.121/users/login", formData);
      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);
      setLoggedInUser(formData.username);
      setErrorMessage("");
      setFormData({ username: "", password: "" });
      alert("Login successful!");
    } catch (error) {
      setErrorMessage("Invalid username or password. Please try again.");
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setLoggedInUser("");
    setErrorMessage("");
    navigate("/");
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
          </form>
        ) : (
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

       {/* chat system will display when user click into product detail page */}
      {isLoggedIn && isProductDetailPage && (
        <div className="chat-container">
          <ChatApp />
        </div>
      )}
    </>
  );
};

export default Layout;
