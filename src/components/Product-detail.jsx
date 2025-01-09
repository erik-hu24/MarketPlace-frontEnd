import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/product-detail.css';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import ChatApp from './ChatApp';

const ProductDetail = () => {
  const { productID } = useParams(); // get the productID by param
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, loggedInUser } = useContext(AuthContext);
  const [offerPrice, setOfferPrice] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);
  const navigate = useNavigate(); // 添加这一行
  const [showChat, setShowChat] = useState(false);


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

  const handlePurchase = async () => {
    if (!isLoggedIn) {
      navigate(`/login?from=/product/${productID}`);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/email/send-purchase-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productID,
          productTitle: product.title,
          price: product.price,
          seller: product.useremail,
          buyerName: loggedInUser 
        }),
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
    if (!isLoggedIn) {
      navigate(`/login?from=/product/${productID}`);
      return;
    }
  
    if (!offerPrice) {
      alert('Please enter your offer price');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/email/send-offer-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productID,
          productTitle: product.title,
          originalPrice: product.price,
          offerPrice: offerPrice,
          seller: product.useremail,
          buyerName: loggedInUser 
        }),
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
      <div className="product-image-container">
        <img
          className="product-image"
          src={`data:image/jpeg;base64,${product.imageURL}` || "/placeholder.png"}
          alt={product.title || "No image available"}
        />
      </div>

      <div className="product-info-sidebar">
        <h1 className="product-title">{product.title}</h1>
        <div className="product-price">CA ${product.price}</div>

        <div className="navigation-buttons">
          <Link to="/" className='button-back'>Back to Products</Link>
          <Link 
            to={isOwner ? `/edit/${productID}` : `/edit/${productID}/verify`} 
            className="button-edit"
          >
            Edit Post
          </Link>
        </div>

        <div className="product-meta">
          <p style={{ fontSize: '14px' }}><strong>Status:</strong> {product.status}</p>
          <p style={{ fontSize: '14px' }}><strong>Seller:</strong> {product.seller || 'N/A'}</p>
          <p style={{ fontSize: '14px' }}><strong>Description:</strong> {product.description || 'No description available'}</p>
          <p style={{ fontSize: '14px' }}><strong>Condition:</strong> {product.condition || 'N/A'}</p>
          <p style={{ fontSize: '14px' }}><strong>Category:</strong> {product.category || 'N/A'}</p>
          <p style={{ fontSize: '14px' }}><strong>Location:</strong> {product.location || 'N/A'}</p>
          <p style={{ fontSize: '14px' }}><strong>Contact:</strong> {product.contact || 'N/A'}</p>
        </div>

        <div className="action-buttons">
          <button className="button-offer" onClick={() => setShowOfferInput(!showOfferInput)}>
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
                <button style={{ fontSize: '14px', color:"white", backgroundColor:"cornflowerblue", borderColor:"cornflowerblue"}} className="button-submit-offer" onClick={handleOffer}>
                  Submit
                </button>
              </div>
            )}
          <button className="button-purchase" onClick={handlePurchase}>
            Purchase at CA ${product.price}
          </button>

          <button className="button-chat" onClick={() => setShowChat(true)}>
            Chat with Seller
          </button>

        </div>
      </div>

      {showChat && (
        <div className="chat-container">
          <div className = "close">
            <button style={{ backgroundColor: "white",color:"blue", fontSize:"18px" }} className="close-chat" onClick={() => setShowChat(false)}>
              ×
            </button>
          </div>
          <ChatApp 
            seller={product.useremail}
            productId={productID}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;