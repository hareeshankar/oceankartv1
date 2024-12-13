import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;

const RazorpayButton = ({ amount, deliveryAddress, cartItems, onPaymentError, navigateTo }) => {
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { token, user } = useContext(AuthContext);

    const handlePayment = () => {
        if (!window.Razorpay) {
            console.error('Razorpay SDK not loaded.');
            alert('Payment gateway is not available. Please try again.');
            return;
        }
        // Validate user
        if (!user?.id) {
            alert('User information is missing. Please log in again.');
            navigate('/login');
            return;
        }
        // Validate delivery address fields
        if (!deliveryAddress?.line1 || !deliveryAddress?.city || !deliveryAddress?.zipcode) {
            alert('Please fill in all required delivery address fields.');
            return;
        }

        const formattedAddress = {
            line1: deliveryAddress.line1,
            line2: deliveryAddress.line2,
            area: deliveryAddress.area,
            city: deliveryAddress.city,
            state: deliveryAddress.state,
            zipcode: deliveryAddress.zipcode,
        };

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
                    userId: user.id,
                    address: formattedAddress,
                    items: cartItems.map((item) => ({
        name: item.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        image: item.image, // Include the image field
    })),
                    totalAmount: amount,
                    paymentId: response.razorpay_payment_id,
                    paymentStatus: 'Paid',
                    deliveryStatus: 'Pending'
                };

                try {
                    const res = await fetch(`${API_URL}/api/orders`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(orderDetails),
                    });

                    if (res.ok) {
                        console.log('Order stored successfully:', await res.json());
                        clearCart();
                        navigate(navigateTo, { replace: true }); // Redirect to the specified route
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
                address: formattedAddress,
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
        <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePayment}
            sx={{ mt: 2, py: 1.5 }}
        >
            Pay ₹{amount}
        </Button>
    );
};

export default RazorpayButton;
