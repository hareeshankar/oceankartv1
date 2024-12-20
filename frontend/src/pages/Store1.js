import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import '../styles/Store.css';
const API_URL = process.env.REACT_APP_API_URL;

async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/api/products`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

fetchProducts();

const Store = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('token');

    // Fetch products from the backend
    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token
            console.log('Token:', token);
            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }
    
            const response = await fetch(`${API_URL}/api/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`Error fetching products: ${response.statusText}`);
            }
    
            const data = await response.json();
            setProducts(data); // Update the state with the fetched products
        } catch (error) {
            console.error('Error fetching products:', error);
            alert(error.message); // Optional: Show an alert to the user
        }
    };

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToCart = (product) => {
        const existingItem = cart.find((item) => item._id === product._id);
        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const handleViewCart = () => {
        navigate('/cart', { state: { cart } }); // Navigate to CartPage and pass the cart state
    };

    if (!isLoggedIn) {
        // Landing Page UI
        return (
            <div className="hotel-dashboard">
                <Navbar showAuthButtons={false} />
                <SearchBar onSearch={setSearchQuery} />
                <div className="dashboard-content">
                    <div className="main-content">
                        <div className="product-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} isGuestView={true} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Logged-in Dashboard UI
    return (
        <div className="store">
            {/* Navbar with Cart Integration */}
            <Navbar
                showAuthButtons={false}
                cartItems={cart}
                onSearch={setSearchQuery}
                onToggleCartModal={handleViewCart} // Use View Cart navigation
            />
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
                    onClick={handleViewCart} // Navigate to CartPage instead of showing a modal
                >
                    View Cart
                </button>
            </div>
        </div>
    );
};

export default Store;
