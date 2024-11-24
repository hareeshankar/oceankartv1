const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Unprotected route (no authentication required)
router.get('/', productsController.getAllProducts);

module.exports = router;
