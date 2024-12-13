import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import CartContext
import { useAuth } from '../context/AuthContext'; // Import AuthContext
import RazorpayButton from './RazorpayButton';
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Paper,
    Box,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import axios from 'axios';

const CheckoutPage = () => {
    const { cart } = useCart(); // Access the cart from context
    const { user } = useAuth(); // Access user information from AuthContext
    const [address, setAddress] = useState({
        line1: '',
        line2: '',
        area: '',
        city: '',
        state: '',
        zipcode: '',
    });
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    // Fetch user address using userId
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                if (!user?.id || !user?.token) {
                    console.error('User ID or token is missing.');
                    return;
                }

                console.log('Fetching address for user:', user.id);
                const response = await axios.get(`${API_URL}/api/users/${user.id}/address`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`, // Include token for authentication
                    },
                });

                if (response.status === 200) {
                    console.log('Address retrieved successfully:', response.data);
                    setAddress(response.data.address); // Populate address state with response
                } else {
                    console.error('Failed to fetch address. Status:', response.status);
                }
            } catch (error) {
                console.error('Error fetching address:', error.response?.data || error.message);
            }
        };

        fetchAddress();
    }, [user]);

    const handleAddressChange = (field, value) => {
        setAddress((prevAddress) => ({
            ...prevAddress,
            [field]: value,
        }));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleContinueShopping = () => {
        navigate('/store'); // Navigate back to the store
    };

    const handleManageCart = () => {
        navigate('/cart'); // Navigate back to the cart
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Checkout
            </Typography>

            {/* Total Amount */}
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6">Total: ₹{calculateTotal()}</Typography>
            </Paper>

            {/* Order Summary */}
            <Typography variant="h5" gutterBottom>
                Order Summary
            </Typography>
            <List>
                {cart.map((item) => (
                    <ListItem key={item._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <ListItemText
                            primary={item.name}
                            secondary={`Qty: ${item.quantity} | Price: ₹${item.price}`}
                        />
                    </ListItem>
                ))}
            </List>

            {/* Delivery Address */}
            <Box sx={{ mt: 4, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Delivery Address
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Address Line 1"
                            value={address.line1}
                            onChange={(e) => handleAddressChange('line1', e.target.value)}
                            placeholder="Enter Address Line 1"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Address Line 2"
                            value={address.line2}
                            onChange={(e) => handleAddressChange('line2', e.target.value)}
                            placeholder="Enter Address Line 2"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Area"
                            value={address.area}
                            onChange={(e) => handleAddressChange('area', e.target.value)}
                            placeholder="Enter Area"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="City"
                            value={address.city}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                            placeholder="Enter City"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="State"
                            value={address.state}
                            onChange={(e) => handleAddressChange('state', e.target.value)}
                            placeholder="Enter State"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Zipcode"
                            value={address.zipcode}
                            onChange={(e) => handleAddressChange('zipcode', e.target.value)}
                            placeholder="Enter Zipcode"
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Actions */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={handleContinueShopping}
                    >
                        Continue Shopping
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        onClick={handleManageCart}
                    >
                        Manage Cart
                    </Button>
                </Grid>
            </Grid>

            {/* Razorpay Button */}
            <Box sx={{ mt: 4 }}>
                <RazorpayButton
                    amount={calculateTotal()}
                    deliveryAddress={address}
                    cartItems={cart} // Pass cart from context
                    navigateTo="/orders" // Navigate to Order History after payment
                    onPaymentError={(error) => {
                        console.error('Payment failed:', error);
                        alert('Payment could not be completed.');
                    }}
                />
            </Box>
        </Container>
    );
};

export default CheckoutPage;
