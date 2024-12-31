import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
//import axios from "axios";
import { AuthContext } from "../AuthContext"; // 引入 AuthContext
import "../styles/style.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ChatApp from "../components/ChatApp"; // 引入 ChatApp 组件

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // 获取当前路径
  const { isLoggedIn, setIsLoggedIn, loggedInUser, setLoggedInUser } = useContext(AuthContext);
  //const [formData, setFormData] = useState({ username: "", password: "" });
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // check if the user in the product detail page or not
  const isProductDetailPage = location.pathname.startsWith('/product/');

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("http://localhost:3000/users/login", formData);
  //     localStorage.setItem("token", response.data.token);
  //     setIsLoggedIn(true);
  //     setLoggedInUser(formData.username);
  //     setErrorMessage("");
  //     setFormData({ username: "", password: "" });
  //     alert("Login successful!");
  //   } catch (error) {
  //     setErrorMessage("Invalid username or password. Please try again.");
  //     console.error("Login failed:", error);
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setLoggedInUser("");
    navigate("/");
  };

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    // Optional: Perform search/filter logic here
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/?query=${searchTerm}`);
  };
  

  return (
    <>
      <div className="top-navigation">
        <span className="logo-text">MarketBay</span>
        <i className="bi-search search-icon"
          title="Search"
          style={{ cursor: "pointer" }}
          onClick={toggleSearchBar}
        />
        {isSearchVisible && (
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            <button type="submit" className="search-submit-button">
              Search
            </button>
          </form>
        )}

        <div className="top-mid-nav">
          <Link to="/">
            <i className="bi-shop house-icon" />
          </Link>
        </div>

        {/* {!isLoggedIn ? (
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
        )} */}

      {isLoggedIn && (
        <div className="user-info">
        <span className="welcome-text">Welcome, {loggedInUser}!</span>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      )}

        <div className="top-right-nav">
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
