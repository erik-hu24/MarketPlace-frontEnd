import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import '../styles/product-create.css';

const ProductCreate = () => {
    const navigate = useNavigate();
    const { isLoggedIn, loggedInUser } = useContext(AuthContext);
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
      title: '',
      seller: '',
      contact: '',
      // imageURL: '',
      description: '',
      condition: '',
      price: '',
      location: '',
      category:'',
      status: 'Available',
      username: isLoggedIn ? loggedInUser : '', // initial username
    });

    const categories = [
      'Clothes',
      'Bags',
      'Houses',
      'Electronics',
      'Vehicles',
      'Free Stuffs',
      'Others'
    ];

    const handleImageChange = (e) => {
      setImageFile(e.target.files[0]);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = new FormData();

      // Append form fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append image file
      if (imageFile) {
        data.append('imageURL', imageFile); 
      }

      try {
        const response = await fetch('http://localhost:3000/create', {
          method: 'POST',
          body: data, // send new product
        });

        if (response.ok) {
          const responseData = await response.json();
          navigate('/create-success', { state: { productPassword: responseData.productPassword } });
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
            <label htmlFor="category">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imageURL">Image:</label>
            <input
              type="file"
              accept="image/*"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleImageChange}
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
