import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import RazorpayButton from './RazorpayButton';

const CheckoutPage = () => {
    const location = useLocation();
    const cartItems = location.state?.cartItems || [];
    const [deliveryAddress, setDeliveryAddress] = useState('');

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleAddressChange = (e) => {
        setDeliveryAddress(e.target.value);
    };

    return (
        <div>
            <h1>Checkout</h1>
            <h2>Order Summary</h2>
            <ul>
                {cartItems.map((item) => (
                    <li key={item._id}>
                        {item.name} - Quantity: {item.quantity} - Price: ₹{item.price}
                    </li>
                ))}
            </ul>
            <h3>Total: ₹{calculateTotal()}</h3>

            <h3>Delivery Address</h3>
            <textarea
                value={deliveryAddress}
                onChange={handleAddressChange}
                rows="4"
                placeholder="Enter your delivery address"
                style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
            ></textarea>

            {/* Pass the navigateTo prop */}
            <RazorpayButton
                amount={calculateTotal()}
                deliveryAddress={deliveryAddress}
                cartItems={cartItems}
                navigateTo="/order-history" // Navigate to Order History after payment
                onPaymentError={(error) => {
                    console.error('Payment failed:', error);
                    alert('Payment could not be completed.');
                }}
            />
        </div>
    );
};

export default CheckoutPage;
