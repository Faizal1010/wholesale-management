const mongoose = require('mongoose');
const Order = require('../Models/ordersModel'); // Import the model




// Add Order Controller
const addOrder = async (req, res) => {
    console.log(req.body)
    try {
        const { orderId, customerName, customerId, products, totalPrice } = req.body;

        // Validate required fields
        if (!orderId || !customerName || !customerId || !products || !totalPrice) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new order instance
        const newOrder = new Order({
            orderId,
            customerName,
            customerId,
            products,
            totalPrice,
        });

        // Save the order to the database
        await newOrder.save();

        res.status(201).json({ message: 'Order created successfully!', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error });
    }
};

const getOrders = async (req, res) => {
    try {
        // Check if the model already exists
        const orderModel = Order;

        // Fetch all clients from the database
        const clients = await orderModel.find();  // Retrieves all documents from the clients collection

        // Check if there are any clients
        if (clients.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No clients found"
            });
        }

        // Send success response with all clients
        res.status(200).json({
            success: true,
            message: "Clients retrieved successfully",
            clients: clients
        });
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({
            success: false,
            message: "Could not retrieve clients due to an internal error",
            error: error.message
        });
    }
}

module.exports = { addOrder, getOrders };