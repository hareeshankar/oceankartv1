const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true,
    },
    address: {
        line1: { type: String, required: true }, // Address Line 1
        line2: { type: String, required: false }, // Address Line 2 (optional)
        area: { type: String, required: true },  // Area/Neighborhood
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipcode: { type: String, required: true },
    },
    password: {
        type: String,
        required: false, // Optional for OTP-based flow
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'vendor','delivery'],
        default: 'customer',
        required: true,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
