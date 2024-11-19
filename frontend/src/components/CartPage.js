import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve cart data from state
    const initialCartItems = location.state?.cart || [];
    const [cartItems, setCartItems] = useState(initialCartItems);

    // Function to update the quantity of a cart item
    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity === 0) {
            handleRemoveFromCart(productId); // If quantity is 0, remove the item
        } else {
            setCartItems((prevCart) =>
                prevCart.map((item) =>
                    item._id === productId ? { ...item, quantity } : item
                )
            );
        }
    };

    // Function to remove an item from the cart
    const handleRemoveFromCart = (productId) => {
        setCartItems((prevCart) =>
            prevCart.filter((item) => item._id !== productId)
        );
    };

    const handleCheckout = () => {
        navigate('/checkout', { state: { cartItems } }); // Pass updated cart to CheckoutPage
    };

    const handleClose = () => {
        navigate('/store'); // Navigate to Dashboard
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div className="cart-item" key={item._id}>
                                <div className="item-details">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price">
                                        Price: ₹{item.price}
                                    </span>
                                </div>
                                <div className="item-controls">
                                    <button
                                        onClick={() =>
                                            handleUpdateQuantity(
                                                item._id,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        -
                                    </button>
                                    <span className="item-quantity">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            handleUpdateQuantity(
                                                item._id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                    <button
                                        className="remove-item-button"
                                        onClick={() => handleRemoveFromCart(item._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Total: ₹{calculateTotal()}</h3>
                        <button className="checkout-button" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                        <button className="close-button" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
