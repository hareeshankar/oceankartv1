const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // e.g., fish, crab, etc.
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    stock: { type: Number, default: 0 },
});

module.exports = mongoose.model('Item', itemSchema);
