import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/product-detail.css';
import { AuthContext } from '../AuthContext';

const ProductDetail = () => {
  const { productID } = useParams(); // get the productID by param
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, loggedInUser } = useContext(AuthContext);
  const [offerPrice, setOfferPrice] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);

  useEffect(() => {
    // get the product information, asynchronous
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://54.82.75.121/product/${productID}`); 
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

  const handlePurchase = async () => {
    try {
      const response = await fetch('http://54.82.75.121/email/send-purchase-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productID,
          productTitle: product.title,
          price: product.price,
          seller: product.username,
          buyerName: loggedInUser 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send purchase request');
      }

      alert('Purchase request has been sent to the seller!');
    } catch (error) {
      console.error('Error sending purchase request:', error);
      alert('Failed to send purchase request. Please try again later.');
    }
  };

  const handleOffer = async () => {
    if (!offerPrice) {
      alert('Please enter your offer price');
      return;
    }

    try {
      const response = await fetch('http://54.82.75.121/email/send-offer-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productID,
          productTitle: product.title,
          originalPrice: product.price,
          offerPrice: offerPrice,
          seller: product.username,
          buyerName: loggedInUser 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send offer');
      }

      alert('Your offer has been sent to the seller!');
      setOfferPrice('');
      setShowOfferInput(false);
    } catch (error) {
      console.error('Error sending offer:', error);
      alert('Failed to send offer. Please try again later.');
    }
  };

  // check the current prodcut and the login user are the same or not
  const isOwner = isLoggedIn && loggedInUser === product?.username;

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
        <Link to="/" className='button-back'>Back to Products</Link>
        <Link 
          to={isOwner ? `/edit/${productID}` : `/edit/${productID}/verify`} 
          className="button-edit"
        >
          Edit Post
        </Link>
        
        {isLoggedIn && (
          <>
            <button className="button-purchase" onClick={handlePurchase}>
              Purchase at CA ${product.price}
            </button>
            
            <div className="offer-section">
              <button 
                className="button-offer"
                onClick={() => setShowOfferInput(!showOfferInput)}
              >
                Make an Offer
              </button>
              
              {showOfferInput && (
                <div className="offer-input-container">
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="Enter your offer"
                    className="offer-input"
                  />
                  <button 
                    className="button-submit-offer"
                    onClick={handleOffer}
                  >
                    Submit Offer
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
