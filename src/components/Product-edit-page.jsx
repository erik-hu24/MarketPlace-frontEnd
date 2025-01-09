import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/product-edit.css';

const ProductEdit = ({ onSubmit }) => {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const navigate = useNavigate(); // jump to another page
    const { productID } = useParams(); // get the productID by param
    const [imageFile, setImageFile] = useState(null);

    // Initialize formData with default values
    const [formData, setFormData] = useState({
        _id: productID,
        title: '',
        seller: '',
        contact: '',
        imageURL: '',
        description: '',
        condition: '',
        price: '',
        category:'',
        location: '',
        status: false,
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

    useEffect(() => {
    // get the product information, asynchronous
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://54.82.75.121/edit/${productID}`); 
                if (!response.ok) {
                throw new Error(`Failed to fetch product: ${response.statusText}`);
                }
                const data = await response.json();
                setProduct(data); // update product data from null to what we want
                 // Initialize formData directly after fetching product data
                setFormData({
                    _id: productID,
                    title: data.title || '',
                    seller: data.seller || '',
                    contact: data.contact || '',
                    imageURL: data.imageURL || '',
                    description: data.description || '',
                    condition: data.condition || '',
                    price: data.price || '',
                    category: data.category || '',
                    location: data.location || '',
                    status: data.status || 'Unavailable',
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

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // new obj
  };  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? 'Unavailable' : 'Available') : value,
    });
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    const name = e.nativeEvent.submitter.name;
    const data = new FormData();

     // Append form fields
     Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

     // Append the image file only if a new image is selected
     if (imageFile) {
      data.append('imageURL', imageFile);
    }

    try {
      const response = await fetch(`http://54.82.75.121/edit/${productID}`, {
        method: 'PUT',
        body: data,
    });
      //console.log('Response:', response);

      if (response.ok && name === 'save') {
        // save success, jump to product detail page
        navigate(`/product/${productID}`);
      }
      if (response.ok && name ==='delete') {
        // save success, jump to delete success page
        navigate(`/delete-success`);
      } 
    } catch (error) {
      console.error('Error update product:', error);
    }
  };

  return (
    <div className="edit-container">
      <h1 className="edit-title">Edit Product</h1>
      {product.imageURL && (
        <img
          className="product-image"
          src={`data:image/jpeg;base64,${product.imageURL}`}
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
          <label htmlFor="imageURL">Image: </label>
          <input
            type="file"
            accept="image/*"
            name="imageURL"
            //value={formData.imageURL}
            onChange={handleImageChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Mark as Sold:</label>
          <input
            type="checkbox"
            name="status"
            checked={formData.status === 'Unavailable'}
            onChange={handleChange}
          />
        </div>
        <div className="form-group button-group">
          <button 
            className="edit-button" 
            type="submit"
            name="save"
          >
            Save Changes
          </button>
        </div>
        <div className="form-group button-group">
          <button
            className="delete-button"
            type="submit"
            name="delete"
            onClick={handleChange}
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