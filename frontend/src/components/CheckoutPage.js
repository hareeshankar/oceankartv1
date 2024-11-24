import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import CartContext
import RazorpayButton from './RazorpayButton';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
    const { cart } = useCart(); // Access the cart from context
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const navigate = useNavigate();

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleAddressChange = (e) => {
        setDeliveryAddress(e.target.value);
    };

    const handleContinueShopping = () => {
        navigate('/store'); // Navigate back to the store
    };

    const handleManageCart = () => {
        navigate('/cart'); // Navigate back to the cart
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            {/* Total Amount */}
            <div className="checkout-summary-header">
                <h2>Total: ₹{calculateTotal()}</h2>
            </div>

            {/* Order Summary */}
            <h3>Order Summary</h3>
            <div className="checkout-items-grid">
                {cart.map((item) => (
                    <div className="checkout-item" key={item._id}>
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                        <span className="item-price">₹{item.price}</span>
                    </div>
                ))}
            </div>

            {/* Delivery Address */}
            <h3>Delivery Address</h3>
            <textarea
                value={deliveryAddress}
                onChange={handleAddressChange}
                rows="4"
                placeholder="Enter your delivery address"
                className="delivery-address-textbox"
            ></textarea>

            {/* Actions */}
            <div className="checkout-actions">
                <button
                    className="checkout-button secondary"
                    onClick={handleContinueShopping}
                >
                    Continue Shopping
                </button>
                <button
                    className="checkout-button secondary"
                    onClick={handleManageCart}
                >
                    Manage Cart
                </button>
            </div>

            {/* Razorpay Button */}
            <RazorpayButton
                amount={calculateTotal()}
                deliveryAddress={deliveryAddress}
                cartItems={cart} // Pass cart from context
                navigateTo="/orders" // Navigate to Order History after payment
                onPaymentError={(error) => {
                    console.error('Payment failed:', error);
                    alert('Payment could not be completed.');
                }}
            />
        </div>
    );
};

export default CheckoutPage;
