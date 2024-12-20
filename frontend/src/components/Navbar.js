import React, { useEffect, useContext } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Box,
    Button,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Use AuthContext
import { useCart } from '../context/CartContext'; // Use CartContext

const Navbar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext); // Global login state
    const { cart, clearCart } = useCart(); // Cart state
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    // Reset anchorEl whenever the login state changes

    useEffect(() => {
        if (!isLoggedIn) {
            setAnchorEl(null);
        }
    }, [isLoggedIn]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout(); // Clear login state
        clearCart()
        navigate('/store'); // Redirect to login
    };

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#004080' }}>
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
                        src="/oceankart-logo22.png"
                        alt="OceanKart Logo"
                        style={{
                            height: '40px',
                            marginRight: '10px',
                        }}
                    />
                    <Typography variant="h6">OceanKart</Typography>
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
                            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={() => { handleMenuClose(); navigate('/orders'); }}>
                                My Orders
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                        <Button
                            variant="contained"
                            sx={{
                                margin: '0 10px',
                                backgroundColor: '#007BFF',
                                color: '#fff',
                                textTransform: 'none',
                                '&:hover': { backgroundColor: '#0056b3' },
                            }}
                            onClick={() => navigate('/otp-register')}
                        >
                            Register
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                margin: '0 10px',
                                backgroundColor: '#28a745',
                                color: '#fff',
                                textTransform: 'none',
                                '&:hover': { backgroundColor: '#1e7e34' },
                            }}
                            onClick={() => navigate('/otp-login')}
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
