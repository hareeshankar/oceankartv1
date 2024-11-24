import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useCart } from '../context/CartContext'; // Import CartContext
import '../styles/Store.css';

const API_URL = process.env.REACT_APP_API_URL;

const Store = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { cart, addToCart } = useCart(); // Access global cart state and addToCart function

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
            alert(error.message); // Optional: Alert the user
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
            alert(error.message); // Optional: Alert the user
        }
    };

    // Determine which products to fetch based on login state
    useEffect(() => {
        if (isLoggedIn) {
            fetchAuthProducts();
        } else {
            fetchPublicProducts();
        }
    }, [isLoggedIn]); // Re-run if login state changes

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToCart = (product) => {
        addToCart({ ...product, quantity: 1 }); // Use addToCart from CartContext
    };

    const handleViewCart = () => {
        navigate('/cart'); // Navigate to CartPage
    };

    if (!isLoggedIn) {
        // Landing Page UI for non-logged-in users
        return (
            <div className="hotel-dashboard">
                <Navbar />
                <div className="hero-section">
                <h1>Welcome to OceanKart</h1>
                <p>Your trusted platform for fresh and frozen seafood delivery!</p>
                </div>
                <SearchBar onSearch={setSearchQuery} />
                <div className="dashboard-content">
                    <div className="main-content">
                        <div className="product-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    isGuestView={true}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Dashboard UI for logged-in users
    return (
        <div className="store">
            {/* Navbar with Cart Integration */}
            <Navbar />
            <SearchBar onSearch={setSearchQuery} />
            {/* Product Grid */}
            <div className="product-grid">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        isGuestView={!localStorage.getItem('token')} // Check if user is logged in
                        onAddToCart={handleAddToCart} // Pass add-to-cart handler
                    />
                ))}
            </div>

            {/* View Cart Button */}
            <div className="view-cart-footer">
                <p>
                    {cart.length} items | Total: ₹
                    {cart.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                    )}
                </p>
                <button
                    className="view-cart-button"
                    onClick={handleViewCart} // Navigate to CartPage
                >
                    View Cart
                </button>
            </div>
        </div>
    );
};

export default Store;
