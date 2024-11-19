import React from 'react';
import { useNavigate } from 'react-router-dom';

const RazorpayButton = ({ amount, deliveryAddress, cartItems, onPaymentError, navigateTo }) => {
    const navigate = useNavigate(); // Initialize navigate function

    const handlePayment = () => {
        if (!window.Razorpay) {
            console.error('Razorpay SDK not loaded.');
            alert('Payment gateway is not available. Please try again.');
            return;
        }

        if (!deliveryAddress?.trim()) {
            alert('Please enter a valid delivery address.');
            return;
        }

        const options = {
            key: 'rzp_test_MxgNkfR5sT3tE7', // Replace with your Razorpay Test or Live Key ID
            amount: amount * 100, // Convert amount to paise
            currency: 'INR',
            name: 'OceanKart',
            description: 'Order Payment',
            image: 'https://www.oceankart.co.in/oceankart-logo2.png', // Path to your logo
            handler: async (response) => {
                console.log('Payment Successful:', response);

                // Save the order to the backend
                const orderDetails = {
                    deliveryAddress,
                    cartItems,
                    totalAmount: amount,
                    paymentId: response.razorpay_payment_id,
                    paymentStatus: 'Paid',
                };

                try {
                    const res = await fetch('https://oceankartv1.onrender.com/api/orders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
                        },
                        body: JSON.stringify(orderDetails),
                    });

                    if (res.ok) {
                        console.log('Order stored successfully:', await res.json());
                        navigate(navigateTo); // Redirect to the specified route
                    } else {
                        console.error('Failed to store order:', await res.text());
                        alert('Order could not be saved. Please contact support.');
                    }
                } catch (error) {
                    console.error('Error storing order:', error);
                    alert('An error occurred. Please try again.');
                }
            },
            prefill: {
                name: 'Customer Name',
                email: 'customer@example.com',
                contact: '9999999999',
            },
            notes: {
                address: deliveryAddress,
            },
            theme: {
                color: '#3399cc',
            },
            modal: {
                ondismiss: () => {
                    console.log('Payment popup closed.');
                    if (onPaymentError) onPaymentError('Payment canceled or failed.');
                },
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    return (
        <button
            onClick={handlePayment}
            style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#3399cc',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
            }}
        >
            Pay Now
        </button>
    );
};

export default RazorpayButton;
