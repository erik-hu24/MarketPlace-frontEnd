import React, { useState } from "react";
import axios from "axios";
import "../styles/register-page.css";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/users/register", formData);
      setSuccessMessage(response.data.message);
      setErrorMessage(""); // Clear error message
      // Redirect to login page on success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
      setSuccessMessage(""); // Clear success message
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Sign up</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="register-input"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="register-input"
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
              className="register-input"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="register-button">
            Sign up
          </button>
        </form>
        {errorMessage && <p className="register-error-message">{errorMessage}</p>}
        {successMessage && <p className="register-success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;
