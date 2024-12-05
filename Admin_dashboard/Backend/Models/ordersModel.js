const mongoose = require('mongoose')
const connectDB = require('../Config/config')

connectDB()

const OrdersSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
    },
    products: {
        type: Map,
        of: [String, Number], // Values will be arrays with a string and a number
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrdersSchema);
