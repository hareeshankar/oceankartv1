const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        address: {
            line1: { type: String, required: true },
            line2: { type: String },
            area: { type: String },
            city: { type: String, required: true },
            state: { type: String },
            zipcode: { type: String, required: true },
        },
        items: [
            {
                name: { type: String, required: true },
                size: { type: String },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                image: { type: String, required: true }, // Add image field
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentId: {
            type: String,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['Paid', 'Failed', 'Pending'],
            default: 'Pending',
        },
        deliveryStatus: {
            type: String,
            enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Order', orderSchema);
