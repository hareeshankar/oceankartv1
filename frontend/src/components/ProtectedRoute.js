import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn} = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        if (!isLoggedIn && localStorage.getItem('token')) {
            // Simulate rehydrating the user from token if AuthContext hasn't initialized yet
            try {
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    console.log('Rehydrating user from token...');
                    // Decode and validate the token here if necessary
                }
            } catch (error) {
                console.error('Invalid token on rehydration:', error);
            }
        }
    }, [isLoggedIn]);

    if (!isLoggedIn && !localStorage.getItem('token')) {
        // Redirect to login if the user is not logged in and there's no token
        return <Navigate to="/otp-login" state={{ from: location }} replace />;
    }

    // Render the children if logged in or a token exists
    return children;
};

export default ProtectedRoute;
