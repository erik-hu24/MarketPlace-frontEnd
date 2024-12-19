import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './components/Layout';
import Products from './components/Products';
import ProductDetail from './components/Product-detail';
import ProductEditVerify from './components/Product-edit-verify';
import ProductEditPage from './components/Product-edit-page';

import reportWebVitals from './reportWebVitals';
import{
  BrowserRouter as Router,
  Routes,
  Route,
  //Link
} from "react-router-dom";

export default function App(){
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/available" element={<Products />} />
          <Route path="/product/:productID" element={<ProductDetail />} />
          <Route path="/edit/:productID/verify" element={<ProductEditVerify />} />
          <Route path="/edit/:productID" element={<ProductEditPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();