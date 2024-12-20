import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
    Grid,
    Typography,
    Button,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

const Store = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();
    const { cart } = useCart(); // Access cart from CartContext
    const { token, isLoggedIn } = useContext(AuthContext); // AuthContext

    const fetchAuthProducts = useCallback(async () => {
        try {
            if (!token) throw new Error('No authentication token found. Please log in.');

            const response = await fetch(`${API_URL}/api/products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`Error fetching products: ${response.statusText}`);

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching authenticated products:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchPublicProducts = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/api/prod/all`);
            if (!response.ok) throw new Error(`Error fetching public products: ${response.statusText}`);

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching public products:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        if (isLoggedIn) {
            fetchAuthProducts();
        } else {
            fetchPublicProducts();
        }
    }, [isLoggedIn, fetchAuthProducts, fetchPublicProducts]);

    // Listen for cart updates and show the Snackbar
    useEffect(() => {
        if (cart.length > 0) {
            //const lastItem = cart[cart.length - 1];
            setSnackbarMessage(`Added item to the cart!`);
            setSnackbarOpen(true);
        }
    }, [cart]);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const handleViewCart = () => navigate('/cart');

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {!isLoggedIn && (
                <Box sx={{ textAlign: 'center', margin: '20px 0', padding: 3, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="h3" gutterBottom>
                        Welcome to OceanKart
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Your trusted platform for fresh and frozen seafood delivery!
                    </Typography>
                </Box>
            )}
            <SearchBar onSearch={setSearchQuery} />
            <Grid container spacing={3} sx={{ padding: 2 }}>
                {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                        <ProductCard
                            product={product}
                            isGuestView={!isLoggedIn}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* View Cart Footer */}
            <Box
                sx={{
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: '#fff',
                    padding: 2,
                    borderTop: '1px solid #ddd',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 10,
                }}
            >
                <Typography variant="subtitle1">
                    {cart.length} items | Total: ₹
                    {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
                </Typography>
                <Button variant="contained" color="primary" onClick={handleViewCart}>
                    View Cart
                </Button>
            </Box>

            {/* Snackbar for Add to Cart Feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={1500}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'middle', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Store;
