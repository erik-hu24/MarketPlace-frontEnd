import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/product-verify.css';

const ProductEditVerify = () => {
  const { productID } = useParams(); 
  const navigate = useNavigate(); // jump to another page
  const [password, setPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    //console.log('Product ID:', productID);
    //console.log('Password sent:', password);

    try {
      const response = await fetch(`http://localhost:3000/edit/${productID}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }), // send password
      });

      //console.log('Response:', response);

      if (response.ok) {
        // password match, jump to edit page
        navigate(`/edit/${productID}`);
      } else {
        // password wrong, error message
        setErrorMessage('Incorrect password. Please try again.');
      } 

    } catch (error) {
      console.error('Error verifying password:', error);
      setErrorMessage('An error occurred. Please check your network connection.');
    }
  };

  return (
    <div className="verify-container">
      <h1 className="verify-title">Verify Password to Edit Product</h1>
      <form className="verify-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Enter Password:</label>
          <input
            className="verify-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button className="verify-button" type="submit">
            Submit
          </button>
        </div>
      </form>

      {errorMessage && (
        <div id="error-message" style={{ color: 'red', marginTop: '10px' }}>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ProductEditVerify;
