import React, { useState } from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product, isGuestView, onAddToCart }) => {
    const [showLoginAlert, setShowLoginAlert] = useState(false);

    const handleAddToCart = () => {
        if (isGuestView) {
            setShowLoginAlert(true); // Show custom alert for logged-out users
        } else if (onAddToCart) {
            onAddToCart(product); // Add product to cart
        }
    };

    return (
        <>
            {/* Product Card */}
            <div className="product-card">
                <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <button
                        className="add-button"
                        onClick={handleAddToCart}
                        style={isGuestView ? { cursor: 'not-allowed', backgroundColor: '#ccc' } : {}}
                    >
                        +
                    </button>
                </div>
                <div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-size">{product.size}</p>
                    <p className="product-price">₹{product.price}</p>
                </div>
            </div>

            {/* Custom Modal Alert */}
            {showLoginAlert && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <p>Please log in to add products to your cart.</p>
                        <button
                            className="close-modal-button"
                            onClick={() => setShowLoginAlert(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;
