const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Route to get all products
router.get('/', productsController.getProducts);

module.exports = router;
