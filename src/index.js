import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './components/Layout';
import Products from './components/Products';
import ProductDetail from './components/Product-detail';
import ProductEditVerify from './components/Product-edit-verify';
import ProductEditPage from './components/Product-edit-page';
import LoginPage from './components/Login_page';
import RegisterPage from './components/Register_page';
import DeleteSuccess from './components/Delete-success';
import ProductCreate from './components/Product-create';
import CreateSuccess from './components/Create-success';
import { AuthProvider } from './AuthContext';

import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/available" element={<Products />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/email/send-purchase-email" element={<ProductDetail />} />
            <Route path="/email/send-offer-email" element={<ProductDetail />} />
            <Route path="/edit/:productID/verify" element={<ProductEditVerify />} />
            <Route path="/edit/:productID" element={<ProductEditPage />} />
            <Route path="/delete-success" element={<DeleteSuccess />} />
            <Route path="/create" element={<ProductCreate />} />
            <Route path="/create/:username" element={<ProductCreate />} />
            <Route path="/create-success" element={<CreateSuccess />} />
            <Route path="/product/:productID" element={<ProductDetail />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
