import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/product-detail.css';

const ProductDetail = () => {
  const { productID } = useParams(); // get the productID by param
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get the product information, asynchronous
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/product/${productID}`); 
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        const data = await response.json();
        setProduct(data); // update product data from null to what we want
      } catch (error) {
        console.error("Error fetching product detail:", error);
      } finally {
        setLoading(false); // waiting for all information is loading successfully
      }
    };
    fetchProduct();
  }, [productID]);

  // if statement to block the render we want
  if (loading) return <p>Loading product details...</p>;

  return (
    <div className="product-details-container">
      <h1 className="product-title">{product.title}</h1>

      <div className="product-info">
        <img
          className="product-image"
          src={product.imageURL || "/placeholder.png"}
          alt={product.title || "No image available"}
        />
        <div className="product-meta">
          <p><strong>Status:</strong> {product.status}</p>
          <p><strong>Seller:</strong> {product.seller || 'N/A'}</p>
          <p><strong>Description:</strong> {product.description || 'No description available'}</p>
          <p><strong>Price:</strong> CA ${product.price}</p>
          <p><strong>Condition:</strong> {product.condition || 'N/A'}</p>
          <p><strong>Location:</strong> {product.location || 'N/A'}</p>
          <p><strong>Contact:</strong> {product.contact || 'N/A'}</p>
        </div>
      </div>

      <div className="button-container">
        <a href="/" className="button-back">Back to Products</a>
        <a href={`/edit/${productID}/verify`} className="button-edit">Edit Post</a>
      </div>
    </div>
  );
};

export default ProductDetail;
