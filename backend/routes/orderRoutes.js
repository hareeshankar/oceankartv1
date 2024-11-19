// Order Routes logic here
const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const { getUserOrders } = require('../controllers/orderController');

// Protected Routes (All routes below will require authentication)
// GET /api/orders - Fetch user's order history
router.get('/', authMiddleware, getUserOrders);
// POST /api/orders - Create a new order
router.post('/', authMiddleware, createOrder);

module.exports = router;