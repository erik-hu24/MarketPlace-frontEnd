import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css'; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAvailableOnly, setIsAvailableOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 构建基础 URL
        let baseUrl = isAvailableOnly ? 
          'http://localhost:3000/available' : 
          'http://localhost:3000';

        // 添加分页和类别参数
        let url = `${baseUrl}?page=${currentPage}`;
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.productList || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [currentPage, isAvailableOnly, selectedCategory]);

  const handleGotoPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(prevCategory => 
      prevCategory === category ? null : category
    );
    setCurrentPage(1); // back to first page
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* left navigation bar*/}
      <div className="left-navigation">
        <h1 style={{ fontSize: '40px' }}>MarketPlace</h1>
        <Link 
          to="/" 
          className="sell-product" 
          onClick={() => {
            setIsAvailableOnly(false);
            setSelectedCategory(null);
            setCurrentPage(1);
          }}
        >
          <div className="nav-item">
            <i className="bi-shop icon" /> Browse all
          </div>
        </Link>
        <Link to="/available" className="sell-product" onClick={() => setIsAvailableOnly(true)}>
          <div className="nav-item">
            <i className="bi-bag icon" /> Browse available
          </div>
        </Link>
        <Link to="/create" className="sell-product">
          <div className="nav-item">
            <i className="bi-cart icon" /> Sell Product
          </div>
        </Link>
        <hr />
        <h1 style={{ fontSize: '30px' }}>Categories</h1>
        {[
          { name: 'Clothes', icon: 'bi-award' },
          { name: 'Bags', icon: 'bi-bag' },
          { name: 'Houses', icon: 'bi-house' },
          { name: 'Vehicles', icon: 'bi-ev-front' },
          { name: 'Free Stuffs', icon: 'bi-box' },
          { name: 'Electronics', icon: 'bi-phone' },
          { name: 'Others', icon: 'bi-tags' }
        ].map(category => (
          <div
            key={category.name}
            className="nav-item"
            onClick={() => handleCategoryClick(category.name)}
            style={{
              cursor: 'pointer',
              backgroundColor: selectedCategory === category.name ? '#e4e6eb' : 'transparent'
            }}
          >
            <i className={`${category.icon} icon`} /> {category.name}
          </div>
        ))}
      </div>

      <div className="main-content">
        <div className="header-container">
          <h1 className="my-h1">
            {selectedCategory ? `${selectedCategory} - ` : ''}
            {isAvailableOnly ? 'Available Items' : "Today's picks"}
          </h1>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`} className="product-link">
              <div className="product-card">
                <img className="product-img" src={`data:image/jpeg;base64,${product.imageURL}`} alt="product" />
                <p>CA ${product.price}</p>
                <p>{product.title || 'N/A'}</p>
                <p>{product.location || 'N/A'}</p>
                <p>{product.status}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* page */}
        <div className="pagination-container">
          {currentPage > 1 && (
            <button
              className="pagination-button"
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
          )}

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-button ${
                  page === currentPage ? 'pagination-current' : ''
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>

          {currentPage < totalPages && (
            <button
              className="pagination-button"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          )}

          <div className="pagination-goto">
            <input
              type="number"
              min="1"
              max={totalPages}
              placeholder="Go to page"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleGotoPage(Number(e.target.value));
                }
              }}
            />
            <button onClick={() => handleGotoPage(Number(document.querySelector('.pagination-goto input').value))}>
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;