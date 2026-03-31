const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName:  { type: String, default: "" },
    userEmail: { type: String, default: "" },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
        name:      { type: String, required: true },
        price:     { type: Number, required: true },
        quantity:  { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    pickupTime:  { type: String, default: "" },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);