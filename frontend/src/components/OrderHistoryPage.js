import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OrderHistoryPage.css';

const API_URL = process.env.REACT_APP_API_URL;

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch orders from the backend
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_URL}/api/orders`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Use your authentication token
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
    }, []);

    const handleContinueShopping = () => {
        navigate('/store'); // Redirect to Store.js
    };

    if (loading) {
        return <p>Loading your order history...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="order-history-container">
            <h1>Order History</h1>
            {orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                <table className="order-history-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                            <th>Payment Status</th>
                            <th>Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>₹{order.totalAmount}</td>
                                <td>{order.paymentStatus}</td>
                                <td>
                                    <ul>
                                        {order.items.map((item) => (
                                            <li key={item.productId}>
                                                {item.name} - Qty: {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="order-history-actions">
                <button className="primary-button" onClick={handleContinueShopping}>
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderHistoryPage;
