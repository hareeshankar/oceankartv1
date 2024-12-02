// Order Controller logic here
const Order = require('../models/Orders');

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `authMiddleware` attaches the user ID to the request
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { userId, address, items, totalAmount, paymentId } = req.body;

        const newOrder = new Order({
            userId,
            address,
            items,
            totalAmount,
            paymentId,
            paymentStatus: 'Paid', // Update based on payment gateway response
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};