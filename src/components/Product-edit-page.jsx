import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/product-edit.css';

const ProductEdit = ({ onSubmit }) => {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const { productID } = useParams(); // get the productID by param

    // Initialize formData with default values
    const [formData, setFormData] = useState({
        title: '',
        seller: '',
        contact: '',
        imageURL: '',
        description: '',
        condition: '',
        price: '',
        location: '',
        status: false,
    });

    useEffect(() => {
    // get the product information, asynchronous
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/edit/${productID}`); 
                if (!response.ok) {
                throw new Error(`Failed to fetch product: ${response.statusText}`);
                }
                const data = await response.json();
                setProduct(data); // update product data from null to what we want
                 // Initialize formData directly after fetching product data
                setFormData({
                    title: data.title || '',
                    seller: data.seller || '',
                    contact: data.contact || '',
                    imageURL: data.imageURL || '',
                    description: data.description || '',
                    condition: data.condition || '',
                    price: data.price || '',
                    location: data.location || '',
                    status: data.status === 'Unavailable',
                });
            } catch (error) {
                console.error("Error fetching product detail:", error);
            } finally {
                setLoading(false); // waiting for all information is loading successfully
            }
        };
        fetchProduct();
    }, [productID])

  // if statement to block the render we want
  if (loading) return <p>Loading product edit page...</p>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };


  return (
    <div className="edit-container">
      <h1 className="edit-title">Edit Product</h1>
      {product.imageURL && (
        <img
          className="product-image"
          src={product.imageURL}
          alt={product.title || "No image available"}
        />
      )}
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            className="edit-input"
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
            className="edit-input"
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
            className="edit-input"
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
            className="edit-input"
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
            className="edit-textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="condition">Condition:</label>
          <input
            className="edit-input"
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
            className="edit-input"
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
            className="edit-input"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Mark as Sold:</label>
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
          />
        </div>
        <div className="form-group button-group">
          <button className="edit-button" type="submit">
            Save Changes
          </button>
        </div>
        <div className="form-group button-group">
          <button
            className="delete-button"
            type="submit"
            name="delete"
            value="true"
          >
            Delete Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
