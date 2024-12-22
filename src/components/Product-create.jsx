import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import '../styles/product-create.css';

const ProductCreate = () => {
    const navigate = useNavigate();
    const { isLoggedIn, loggedInUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({
      title: '',
      seller: '',
      contact: '',
      imageURL: '',
      description: '',
      condition: '',
      price: '',
      location: '',
      status: 'Available',
      username: isLoggedIn ? loggedInUser : '', // initial username
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // if user login late, update the null username 
        const dataToSubmit = {
          ...formData,
          username: isLoggedIn ? loggedInUser : ''
        };

        const response = await fetch('http://localhost:3000/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSubmit),
        });

        if (response.ok) {
          // get data, and send password to another router
          const data = await response.json();
          navigate('/create-success', { state: { productPassword: data.productPassword } });
        } else {
          console.error('Failed to create product');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    return (
      <div className="form-container">
        <h1>Create a New Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="seller">Seller:</label>
            <input
              type="text"
              name="seller"
              value={formData.seller}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Information:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageURL">Image URL:</label>
            <input
              type="text"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="condition">Condition:</label>
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (CA $):</label>
            <input
              type="number"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
};

export default ProductCreate;
