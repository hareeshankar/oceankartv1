import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Box, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const { cart, clearCart } = useCart(); // Added clearCart from CartContext

    useEffect(() => {
        // Check token on component mount to ensure isLoggedIn is accurate
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        clearCart(); // Clear the cart when logging out
        setIsLoggedIn(false); // Update login state
        setAnchorEl(null); // Close the menu
        navigate('/'); // Redirect to landing page
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#004080' }}>
            <Toolbar>
                {/* Logo Section */}
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexGrow: 1,
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate('/store')}
                >
                    <img
                        src="/oceankart-logo2.png"
                        alt="OceanKart Logo"
                        style={{
                            height: '40px',
                            marginRight: '10px',
                        }}
                    />
                    <Typography variant="h6" component="div">
                        OceanKart
                    </Typography>
                </Box>

                {/* Cart Icon */}
                {isLoggedIn && (
                    <IconButton color="inherit" onClick={() => navigate('/cart')}>
                        <Badge badgeContent={cart.length} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                )}

                {/* Profile Dropdown or Auth Buttons */}
                {isLoggedIn ? (
                    <>
                        <IconButton color="inherit" onClick={handleMenuOpen}>
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                        <Button
                            variant="contained"
                            sx={{
                                margin: '0 10px',
                                backgroundColor: '#007BFF', // Blue background
                                color: '#fff', // White text for contrast
                                textTransform: 'none', // Prevent uppercase text
                                '&:hover': {
                                    backgroundColor: '#0056b3', // Darker blue on hover
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                            onClick={() => navigate('/register')}
                        >
                            Register
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                margin: '0 10px',
                                backgroundColor: '#28a745', // Green background
                                color: '#fff', // White text for contrast
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#1e7e34', // Darker green on hover
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>

                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
