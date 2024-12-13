import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
} from '@mui/material';

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
            alert('You are not logged in. Redirecting to login page.');
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_URL}/api/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Use token for authentication
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
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
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"><strong>Order ID</strong></TableCell>
                                <TableCell align="left"><strong>Date</strong></TableCell>
                                <TableCell align="left"><strong>Total Amount</strong></TableCell>
                                <TableCell align="left"><strong>Payment Status</strong></TableCell>
                                <TableCell align="left"><strong>Delivery Status</strong></TableCell>
                                <TableCell align="left"><strong>Items</strong></TableCell>
                                <TableCell align="left"><strong>Address</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order._id}</TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>₹{order.totalAmount}</TableCell>
                                    <TableCell>{order.paymentStatus}</TableCell>
                                    <TableCell>{order.deliveryStatus}</TableCell>
                                    <TableCell>
                                        <ul style={{ paddingLeft: '20px' }}>
                                            {order.items.map((item, index) => (
                                                <li key={index}>
                                                    {item.name} - Qty: {item.quantity} - ₹{item.price}
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                    <TableCell>
                                        {`${order.address.line1}, ${order.address.line2 || ''}, ${
                                            order.address.area || ''
                                        }, ${order.address.city}, ${order.address.state} - ${
                                            order.address.zipcode
                                        }`}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
