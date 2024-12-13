import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import {
    Container,
    Typography,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    CircularProgress,
    Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const API_URL = process.env.REACT_APP_API_URL;

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext); // Retrieve token and user from AuthContext

    // Fetch orders from the backend
    useEffect(() => {
        if (!token || !user) {
            // If not logged in, redirect to OTP Login
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                alert('You are not logged in. Redirecting to login page.');
                navigate('/otp-login');
            }
            return;
        }

        const fetchOrders = async () => {
            let attempts = 0;
            const maxRetries = 3;

            while (attempts < maxRetries) {
                try {
                    const response = await fetch(`${API_URL}/api/orders`, {
                        headers: {
                            Authorization: `Bearer ${token}`, // Use token for authentication
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setOrders(data);
                        setLoading(false);
                        return;
                    } else if (response.status === 403 || response.status === 404) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    } else {
                        throw new Error('Failed to fetch orders');
                    }
                } catch (err) {
                    attempts++;
                    if (attempts === maxRetries) {
                        setError(err.message);
                        setLoading(false);
                        return;
                    }
                }
            }
        };

        fetchOrders();
    }, [token, user, navigate]);

    const handleContinueShopping = () => {
        navigate('/store'); // Redirect to Store.js
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
                <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                    Loading your order history...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Order History
            </Typography>
            {orders.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    You have no orders yet.
                </Typography>
            ) : (
                orders.map((order) => (
                    <Accordion key={order._id} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>
                                <strong>Order ID:</strong> {order._id} | <strong>Date:</strong>{' '}
                                {new Date(order.createdAt).toLocaleDateString()} |{' '}
                                <strong>Total:</strong> ₹{order.totalAmount}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">
                                        <strong>Payment Status:</strong> {order.paymentStatus}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        <strong>Delivery Status:</strong> {order.deliveryStatus}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">
                                        <strong>Address:</strong> {`${order.address.line1}, ${order.address.line2 || ''}, ${order.address.area || ''}, ${order.address.city}, ${order.address.state} - ${order.address.zipcode}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        <strong>Items:</strong>
                                    </Typography>
                                    <List dense>
                                        {order.items.map((item) => (
                                            <ListItem key={item._id}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        src={item.image}
                                                        alt={item.name}
                                                        variant="square"
                                                        sx={{ width: 56, height: 56 }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`${item.name} (Size: ${item.size || 'N/A'})`}
                                                    secondary={`Qty: ${item.quantity} | Price: ₹${item.price}`}
                                                    sx={{ ml: 2 }} // Add spacing between image and text
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleContinueShopping}
            >
                Continue Shopping
            </Button>
        </Container>
    );
};

export default OrderHistoryPage;
