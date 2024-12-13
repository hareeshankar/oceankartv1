// User Routes logic here
const express = require('express');
const router = express.Router();
const { getUserAddress, getUserDetails, updateUserDetails } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is authenticated

// Route to get user address
router.get('/:id/address', authMiddleware, getUserAddress);

// Route to get user details
router.get('/details', authMiddleware, getUserDetails);

// Route to update user details
router.put('/update', authMiddleware, updateUserDetails);

module.exports = router;

