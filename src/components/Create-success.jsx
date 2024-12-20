import React from "react";
import { useLocation } from 'react-router-dom';
import '../styles/product-edit.css';

const CreateSuccess = () => {
    const location = useLocation();
    const { productPassword } = location.state || {};

    return (
        <div className="main-container">
        <h1>
            <strong>Create new product successfully</strong>
        </h1>
        <h2>
            Password is: <span className="password-text">{productPassword}</span>
        </h2>
        <p> Use the password to edit your post</p>
        </div>
    );
};

export default CreateSuccess;