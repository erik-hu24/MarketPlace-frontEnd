import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/product-detail.css';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { productID } = useParams(); // get the productID by param
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, loggedInUser } = useContext(AuthContext);
  const [offerPrice, setOfferPrice] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);
  const navigate = useNavigate(); // 添加这一行


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
    if (!isLoggedIn) {
      navigate(`/login?from=/product/${productID}`);
      return;
    }
  
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
        
        {
          <>
            <button 
              className="button-purchase" 
              onClick={() => {
                if (!isLoggedIn) {
                  navigate('/login'); // 未登录则跳转到登录页面
                } else {
                  handlePurchase(); // 已登录则执行购买操作
                }
              }}
            >
              Purchase at CA ${product.price}
            </button>
            
            <div className="offer-section">
              <button 
                className="button-offer"
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate('/login'); // 未登录则跳转到登录页面
                  } else {
                    setShowOfferInput(!showOfferInput); // 已登录则显示报价输入框
                  }
                }}
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
                    onClick={() => {
                      if (!isLoggedIn) {
                        navigate('/login'); // 未登录则跳转到登录页面
                      } else {
                        handleOffer(); // 已登录则提交报价
                      }
                    }}
                  >
                    Submit Offer
                  </button>
                </div>
              )}
            </div>
          </>
        }

      </div>
    </div>
  );
};

export default ProductDetail;