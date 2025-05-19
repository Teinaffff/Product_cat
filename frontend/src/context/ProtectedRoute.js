import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Authcontext'; // Adjust the path if necessary

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
