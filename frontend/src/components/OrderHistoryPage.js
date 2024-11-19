// Order History Page Component here
import React, { useEffect, useState } from 'react';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch orders from the backend
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders', {
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

    if (loading) {
        return <p>Loading your order history...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>Order History</h1>
            {orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                padding: '20px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            }}
                        >
                            <h3>Order ID: {order._id}</h3>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p><strong>Delivery Address:</strong> {order.address}</p>
                            <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                            <h4>Items:</h4>
                            <ul>
                                {order.items.map((item) => (
                                    <li key={item.productId}>
                                        {item.name} - Quantity: {item.quantity} - Price: ₹{item.price}
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
