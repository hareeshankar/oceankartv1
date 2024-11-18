import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ cartItems }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Check if user is logged in
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token from local storage
        setIsLoggedIn(false); // Update state
        navigate('/'); // Redirect to landing page
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    return (
        <div className="navbar">
            {/* Logo and Name */}
            <div className="logo-container">
                <img src="/oceankart-logo2.png" alt="OceanKart Logo" className="navbar-logo" />
                <span className="navbar-title">OceanKart</span>
            </div>

            {/* Auth and Cart Icons */}
            <div className="auth-container">
                {/* Cart Icon (Visible Only When Logged In) */}
                {isLoggedIn && (
                    <div className="cart-icon-container" onClick={() => navigate('/cart')}>
                        🛒 <span className="cart-count">{cartItems?.length || 0}</span>
                    </div>
                )}

                {/* Profile Icon or Auth Buttons */}
                {isLoggedIn ? (
                    <div className="profile-container">
                        <div className="profile-icon" onClick={toggleDropdown}>
                            <span role="img" aria-label="user">👤</span>
                        </div>
                        {dropdownVisible && (
                            <div className="profile-dropdown">
                                <p onClick={() => navigate('/profile')}>Profile</p>
                                <p onClick={handleLogout}>Logout</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button className="nav-button" onClick={() => navigate('/register')}>
                            Register
                        </button>
                        <button className="nav-button" onClick={() => navigate('/login')}>
                            Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
