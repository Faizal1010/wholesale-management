const mongoose = require('mongoose');
const connectDB = require('../Config/config');

connectDB();

const PaymentsSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },
    clientEmail: {
        type: String,
        required: true,
    },
    dueAmount: {
        type: Number,
        required: true,
    },
    paidAmount: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentNote: {
        type: String,
        required: true,
    },
    clientProfile:{
        type:String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Payments', PaymentsSchema);