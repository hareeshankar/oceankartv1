const express = require('express');
const { sendOtp, verifyOtp } = require('../utils/twilio');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Check if Phone Number Exists
router.post('/check-phone', async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });
        res.status(200).json({ exists: !!user });
    } catch (error) {
        console.error('Error checking phone number:', error.message);
        res.status(500).json({ error: 'Error checking phone number.' });
    }
});

// Send OTP
router.post('/send', async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const response = await sendOtp(phoneNumber);
        res.status(200).json({ success: true, message: 'OTP sent successfully.', response });
    } catch (error) {
        console.error('Error sending OTP:', error.message);
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
});

// Verify OTP
router.post('/verify', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
        const isValid = await verifyOtp(phoneNumber, otp);
        if (isValid) {
            res.status(200).json({ success: true, message: 'OTP verified successfully.' });
        } else {
            res.status(400).json({ error: 'Invalid OTP.' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        res.status(500).json({ error: 'Failed to verify OTP.' });
    }
});

// Register User
router.post('/register', async (req, res) => {
    const { phoneNumber, name, email, address } = req.body;

    // Validate input fields
    if (
        !phoneNumber ||
        !name ||
        !email ||
        !address ||
        !address.addressLine1 ||
        !address.area ||
        !address.city ||
        !address.state ||
        !address.zipcode
    ) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    try {
        // Check if the phone number is already registered
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'Phone number is already registered.' });
        }

        // Create a new user
        const newUser = new User({
            phoneNumber,
            fullName: name,
            email,
            address: {
                line1: address.addressLine1,
                line2: address.addressLine2 || '', // Optional field
                area: address.area,
                city: address.city,
                state: address.state,
                zipcode: address.zipcode,
            },
            // role will default to 'customer' as defined in the User schema
        });

        await newUser.save();

        // Generate JWT token with _userId and role
        const tokenPayload = {
            userId: newUser._id,
            role: newUser.role, // The role should be set by default in the schema
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with success and token
        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ error: 'Failed to register user. Please try again.' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ error: 'User not found. Please register.' });
        }

        // Generate JWT token with _userId and role
        const tokenPayload = {
            userId: user._id,
            role: user.role,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: 'Failed to log in user.' });
    }
});

module.exports = router;
