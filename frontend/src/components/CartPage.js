import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import CartContext
import '../styles/CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateCartItem } = useCart();
    const [showModal, setShowModal] = useState(false);

    // Redirect to store if the cart is empty
    useEffect(() => {
        if (cart.length === 0) {
            setShowModal(true);
        }
    }, [cart]);

    const closeModal = () => {
        setShowModal(false);
        navigate('/store'); // Redirect to Store.js
    };

    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId); // If quantity is 0, remove the item
        } else {
            updateCartItem(productId, quantity); // Update the cart item's quantity
        }
    };

    const handleCheckout = () => {
        navigate('/checkout'); // Navigate to CheckoutPage
    };

    const calculateTotal = () => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    return (
        <div className="cart-container">
             {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>No items in cart to checkout.</p>
                        <button onClick={closeModal}>Go to Store</button>
                    </div>
                </div>
            )}
            <h1>Your Cart</h1>
            <div className="cart-items-grid">
                {cart.map((item) => (
                    <div className="cart-item-card" key={item._id}>
                        <div className="item-details">
                            <h3 className="item-name">{item.name}</h3>
                            <p className="item-price">₹{item.price}</p>
                            <div className="item-controls">
                                <button
                                    onClick={() =>
                                        handleUpdateQuantity(item._id, item.quantity - 1)
                                    }
                                >
                                    -
                                </button>
                                <span className="item-quantity">{item.quantity}</span>
                                <button
                                    onClick={() =>
                                        handleUpdateQuantity(item._id, item.quantity + 1)
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button
                            className="remove-item-button"
                            onClick={() => removeFromCart(item._id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h3>Total: ₹{calculateTotal()}</h3>
                <button className="checkout-button" onClick={handleCheckout}>
                    Proceed to Checkout
                </button>
                <button
                    className="continue-shopping-button"
                    onClick={() => navigate('/store')}
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default CartPage;
