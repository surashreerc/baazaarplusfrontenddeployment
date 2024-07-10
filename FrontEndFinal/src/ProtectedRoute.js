import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = Boolean(token);
    console.log('Is Authenticated in ProtectedRoute:', isAuthenticated); // Debug log
    return isAuthenticated ? element : <Navigate to="/signin" />;
};

export default ProtectedRoute;

