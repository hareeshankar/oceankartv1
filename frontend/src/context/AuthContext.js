import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                setToken(storedToken);
                setUser({
                    id: decoded.userId,
                    role: decoded.role,
                    token: storedToken,
                });
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Token decoding failed:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = (newToken) => {
        try {
            const decoded = jwtDecode(newToken);
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser({
                id: decoded.userId,
                role: decoded.role,
                token: newToken,
            });
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Token decoding failed during login:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
