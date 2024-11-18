// Header.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token and user data
    localStorage.removeItem('token');
    // Redirect to the landing page
    navigate('/');
  };

  const handleProfile = () => {
    // Navigate to the profile page
    navigate('/profile');
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/dashboard')}>
        {/* Replace with your logo image if available */}
        <h1>OceanKart</h1>
      </div>
      <div className="profile-menu">
        <div
          className="profile-icon"
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          {/* You can use an icon library for a better icon */}
          <span>
            User
          </span>
        </div>
        {dropdownVisible && (
          <div className="dropdown">
            <p onClick={handleProfile}>Profile</p>
            <p onClick={handleLogout}>Logout</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
