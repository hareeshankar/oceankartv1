const express = require('express');
const productsController = require('../controllers/productsController');

const router = express.Router();

// Unprotected route (no authentication required)
router.get('/', productsController.getAllProducts);

module.exports = router;
