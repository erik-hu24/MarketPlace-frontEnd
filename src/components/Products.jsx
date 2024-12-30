import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/style.css';

const Products = () => {
  const location = useLocation(); // 获取当前 URL 参数
  const [locationDisplay, setLocationDisplay] = useState('Loading location...');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAvailableOnly, setIsAvailableOnly] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query'); // 获取搜索参数

  useEffect(() => {
    // 获取位置信息
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || "Unknown Location";
          setLocationDisplay(city);
        } catch (error) {
          console.error("Error fetching location:", error);
          setLocationDisplay("Location not found");
        }
      });
    }

    // 获取产品数据
    const fetchProducts = async () => {
      try {
        let url = isAvailableOnly
          ? `http://localhost:3000/available?page=${currentPage}`
          : `http://localhost:3000?page=${currentPage}`;
        
        // 添加搜索过滤逻辑
        if (query) {
          url += `&query=${encodeURIComponent(query)}`;
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
  }, [currentPage, isAvailableOnly, query]);

  const handleGotoPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* 左侧导航栏 */}
      <div className="left-navigation">
        <h1 style={{ fontSize: '40px' }}>MarketPlace</h1>
        <Link to="/" className="sell-product" onClick={() => setIsAvailableOnly(false)}>
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
        <div className="nav-item">
          <i className="bi-award icon" /> Clothes
        </div>
        <div className="nav-item">
          <i className="bi-bag icon" /> Bags
        </div>
        <div className="nav-item">
          <i className="bi-house icon" /> Houses
        </div>
        <div className="nav-item">
          <i className="bi-ev-front icon" /> Vehicles
        </div>
        <div className="nav-item">
          <i className="bi-box icon" /> Free Stuffs
        </div>
        <div className="nav-item">
          <i className="bi-tags icon" /> Classifieds
        </div>
        <div className="nav-item">
          <i className="bi-phone icon" /> Electronics
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="main-content">
        <div className="header-container">
          <h1 className="my-h1">Today's picks</h1>
          <div className="location-display">
            <i className="bi-geo-alt-fill location-icon" />
            <span className="location-text">{locationDisplay}</span>
          </div>
        </div>

        {/* 显示搜索结果 */}
        {query && (
          <div className="search-result-info">
            <p>Showing results for: <strong>{query}</strong></p>
          </div>
        )}

        <div className="product-grid">
          {products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`} className="product-link">
              <div className="product-card">
                <img className="product-img" src={product.imageURL} alt="product" />
                <p>CA ${product.price}</p>
                <p>{product.title || 'N/A'}</p>
                <p>{product.location || 'N/A'}</p>
                <p>{product.status}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* 分页功能 */}
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
