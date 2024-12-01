import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Box, AppBar, Toolbar } from '@mui/material';
import ProductCard from '../components/ProductCard'; // MUI-enhanced ProductCard
import SearchBar from '../components/SearchBar'; // SearchBar Component
import Navbar from '../components/Navbar'; // Navbar updated with MUI
import { useCart } from '../context/CartContext'; // Import CartContext

const API_URL = process.env.REACT_APP_API_URL;

const Store = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { cart, addToCart } = useCart(); // Access cart context
    const isLoggedIn = !!localStorage.getItem('token');

    // Fetch products for logged-in users
    const fetchAuthProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }

            const response = await fetch(`${API_URL}/api/products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching products: ${response.statusText}`);
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching authenticated products:', error);
            alert(error.message);
        }
    };

    // Fetch public products for non-logged-in users
    const fetchPublicProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/api/prod/all`);
            if (!response.ok) {
                throw new Error(`Error fetching public products: ${response.statusText}`);
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching public products:', error);
            alert(error.message);
        }
    };

    // Fetch products based on login state
    useEffect(() => {
        if (isLoggedIn) {
            fetchAuthProducts();
        } else {
            fetchPublicProducts();
        }
    }, [isLoggedIn]);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToCart = (product) => {
        addToCart({ ...product, quantity: 1 }); // Add product with quantity 1
    };

    const handleViewCart = () => {
        navigate('/cart'); // Navigate to CartPage
    };

    if (!isLoggedIn) {
        // Landing Page UI for non-logged-in users
        return (
            <Box>
                <Navbar />
                <Box sx={{ textAlign: 'center', margin: '20px 0' }}>
                    <Typography variant="h3" gutterBottom>
                        Welcome to OceanKart
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Your trusted platform for fresh and frozen seafood delivery!
                    </Typography>
                </Box>
                <SearchBar onSearch={setSearchQuery} />
                <Grid container spacing={3} sx={{ padding: 2 }}>
                    {filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                            <ProductCard
                                product={product}
                                isGuestView={true}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    // Dashboard UI for logged-in users
    return (
        <Box>
            <Navbar />
            <SearchBar onSearch={setSearchQuery} />
            <Grid container spacing={3} sx={{ padding: 2 }}>
                {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                        <ProductCard
                            product={product}
                            isGuestView={!localStorage.getItem('token')} // Check if user is logged in
                            onAddToCart={handleAddToCart} // Pass add-to-cart handler
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleViewCart}
                >
                    View Cart
                </Button>
            </Box>
        </Box>
    );
};

export default Store;
