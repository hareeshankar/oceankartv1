const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const productsController = require('../controllers/productsController');

router.post('/register', register);
router.post('/login', login);

// Route to get all products
router.get('/api/products', productsController.getProducts);

module.exports = router;
