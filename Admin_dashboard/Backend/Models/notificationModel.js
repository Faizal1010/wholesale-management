const mongoose = require('mongoose')
const connectDB = require('../Config/config')

connectDB()

const NotificationSchema = new mongoose.Schema({
    Notification: {
        type: String,
        required: true,
    },
    ClientName: {
        type: String,
        required: true,
    },
    ClientId: {
        type: String,
        required: true,
    },
    ClientEmail: {
        type: String, // Values will be arrays with a string and a number
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Notifications', NotificationSchema);
