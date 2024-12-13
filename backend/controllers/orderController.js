const Order = require('../models/Orders');

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `authMiddleware` attaches the user ID to the request
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Fetch orders by user ID
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `authMiddleware` attaches the user ID to the request
        console.log('Incoming Payload:', req.body); // Log the payload
        const { address, items, totalAmount, paymentId, paymentStatus, deliveryStatus } = req.body;

        if (!userId || !address || !items || !totalAmount || !paymentId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate each item in the order to ensure the `image` field exists
        const validatedItems = items.map((item) => {
            if (!item.image) {
                throw new Error(`Image is missing for item: ${item.name}`);
            }
            return item;
        });

        const newOrder = new Order({
            userId, // Link the order to the user's ID
            address,
            items: validatedItems,
            totalAmount,
            paymentId,
            paymentStatus, // Update based on payment gateway response
            deliveryStatus // Default delivery status
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order - backend' });
    }
};
