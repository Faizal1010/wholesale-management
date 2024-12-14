const Client = require('../Models/clientModel');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');


const formatCategoryName = (name) => {
    return name.trim().toLowerCase().replace(/\s+/g, '-'); // Lowercase and hyphens for spaces
};

// Define multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const email = req.body.email;
console.log("the req.body at destination is ->",req.body)
        if (!email) {
            return cb(new Error('Email not provided'), null);
        }

        const emailFolderPath = path.join(__dirname, '../../Frontend/assets/clientsProfiles', email);

        // Create the email folder if it doesn't exist
        fs.mkdirSync(emailFolderPath, { recursive: true });
        cb(null, emailFolderPath);
    },
    filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage }).single('profile');

const uploadProfile = async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Error uploading profile image:', err);
            return res.status(500).json({
                success: false,
                message: "Image couldn't be uploaded due to an internal error",
                error: err.message,
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            filePath: path.relative(path.join(__dirname, '../../Frontend'), req.file.path), // Return relative path for frontend usage
        });
    });
};

const addClient = async (req, res) => {
    try {
        const { FirstName, LastName, Email, Password, PostalCode, State, City, Address, Notes, GSTIN, Profile, CustomerId } = req.body;

        console.log(CustomerId)
        // Validate the input
        if (!FirstName || !LastName || !Email || !Password || !PostalCode || !State || !City || !Address || !Notes || !GSTIN || !Profile || !CustomerId) {
            return res.status(400).json({
                success: false,
                message: "All client details are required!"
            });
        }

        // Use the schema to create a model and explicitly set the collection name
        const ClientModel = Client;

        // Create a new client document
        const newClient = await ClientModel.create({
            FirstName,
            LastName,
            Email,
            Password,
            PostalCode,
            State,
            City,
            Address,
            Notes,
            GSTIN,
            Profile,
            CustomerId,
            DueAmount: 0,
            PaidAmount:0
        });

        // Send success response
        res.status(201).json({
            success: true,
            message: "Client added successfully",
            client: newClient
        });
    } catch (error) {
        console.error('Error adding client:', error);
        res.status(500).json({
            success: false,
            message: "Client couldn't be added due to an internal error",
            error: error.message
        });
    }
};



const getClient = async (req, res) => {
    try {
        // Check if the model already exists
        const ClientModel = Client;

        // Fetch all clients from the database
        const clients = await ClientModel.find();  // Retrieves all documents from the clients collection

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
};


const deleteClient = async (req, res) => {
    const clientId = req.params.id;

    try {
        // Check if the model already exists or create it dynamically
        const ClientModel = Client;

        // Fetch client data by its ID to get the email (required for folder path)
        const client = await ClientModel.findById(clientId);

        // If no client is found with the given ID, return a 404 error
        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        // Get the email from the client document to delete the profile folder
        const email = client.Email;

        // Define the folder path where the profile picture is stored
        const emailFolderPath = path.join(__dirname, '../../Frontend/assets/clientsProfiles', email);

        // Remove the folder and its contents
        try {
            // Use fs.rm for recursive deletion of the folder and its content (Node.js >= 14.14.0)
            fs.rmSync(emailFolderPath, { recursive: true, force: true });
            console.log(`Successfully deleted the folder for ${email}`);
        } catch (err) {
            console.error('Error deleting folder:', err);
            return res.status(500).json({
                success: false,
                message: "An error occurred while deleting the profile folder",
                error: err.message
            });
        }

        // Delete the client from the database
        const deletedClient = await ClientModel.findByIdAndDelete(clientId);

        // If no client is found with the given ID (again), return a 404 error
        if (!deletedClient) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        // Send success response if the client was deleted
        res.status(200).json({
            success: true,
            message: "Client and profile folder deleted successfully"
        });
    } catch (error) {
        // Handle any other errors
        console.error('Error deleting client:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the client",
            error: error.message
        });
    }
};



const getLatestClients = async (req, res) => {
    try {
        // Check if the model already exists
        const ClientModel = Client;

        // Fetch the newest 5 clients from the database, sorted by createdAt in descending order
        const clients = await ClientModel.find()  // Retrieves all documents from the clients collection
            .sort({ createdAt: -1 })  // Sort by createdAt field, descending order (most recent first)
            .limit(5);  // Limit to the newest 5 clients

        // Check if there are any clients
        if (clients.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No clients found"
            });
        }

        // Send success response with the newest clients
        res.status(200).json({
            success: true,
            message: "Newest clients retrieved successfully",
            clients: clients
        });
    } catch (error) {
        console.error('Error fetching newest clients:', error);
        res.status(500).json({
            success: false,
            message: "Could not retrieve clients due to an internal error",
            error: error.message
        });
    }
};




const getClientById = async (req, res) => {
    const clientId = req.params.id; // Retrieve client ID from the request parameters

    try {
        // Check if the model already exists
        const ClientModel = Client;

        // Fetch the client by their ID from the database
        const client = await ClientModel.findById(clientId);  // Find the client by ID

        // If no client is found, return a 404 error
        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        // Send success response with the client data
        res.status(200).json({
            success: true,
            message: "Client retrieved successfully",
            client: client
        });
    } catch (error) {
        console.error('Error fetching client by ID:', error);
        res.status(500).json({
            success: false,
            message: "Could not retrieve the client due to an internal error",
            error: error.message
        });
    }
};



const getClientByCustomerId = async (req, res) => {
    const customerId = req.params.customerId; // Retrieve the CustomerId from the request parameters

    try {
        // Check if the model already exists
        const ClientModel = Client;

        // Fetch the client by their CustomerId from the database
        const client = await ClientModel.findOne({ CustomerId: customerId });  // Find the client by CustomerId

        // If no client is found, return a 404 error
        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        // Send success response with the client data
        res.status(200).json({
            success: true,
            message: "Client retrieved successfully",
            client: client
        });
    } catch (error) {
        console.error('Error fetching client by CustomerId:', error);
        res.status(500).json({
            success: false,
            message: "Could not retrieve the client due to an internal error",
            error: error.message
        });
    }
};




const addDueAmount = async (req, res) => {
    try {
        const { CustomerId, additionalAmount } = req.body;

        // Validate the input
        if (!CustomerId || additionalAmount == null) {
            return res.status(400).json({
                success: false,
                message: "Customer ID and additional amount are required",
            });
        }

        // Ensure additionalAmount is a valid number
        const parsedAmount = Number(additionalAmount);
        if (isNaN(parsedAmount)) {
            return res.status(400).json({
                success: false,
                message: "Additional amount must be a valid number",
            });
        }

        // Find the client by CustomerId
        const client = await Client.findOne({ CustomerId });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        }

        // Add the new amount to the existing DueAmount
        client.DueAmount += parsedAmount;

        // Save the updated client document
        await client.save();

        res.status(200).json({
            success: true,
            message: "Due amount updated successfully",
            client,
        });
    } catch (error) {
        console.error('Error updating due amount:', error);
        res.status(500).json({
            success: false,
            message: "Could not update due amount due to an internal error",
            error: error.message,
        });
    }
};


const subtractDueAmount = async (req, res) => {
    try {
        const { CustomerId, subtractAmount } = req.body;
        console.log(CustomerId, subtractAmount)
        // Validate the input
        if (!CustomerId || subtractAmount == null) {
            return res.status(400).json({
                success: false,
                message: "Customer ID and subtract amount are required",
            });
        }

        // Ensure subtractAmount is a valid number
        const parsedAmount = Number(subtractAmount);
        if (isNaN(parsedAmount) || parsedAmount < 0) {
            return res.status(400).json({
                success: false,
                message: "Subtract amount must be a valid non-negative number",
            });
        }

        // Find the client by CustomerId
        const client = await Client.findOne({ CustomerId });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        }

        // Ensure the DueAmount does not go negative
        if (client.DueAmount < parsedAmount) {
            return res.status(400).json({
                success: false,
                message: "Subtract amount exceeds the due amount",
            });
        }

        // Subtract the amount from DueAmount and add to PaidAmount
        client.DueAmount -= parsedAmount;
        client.PaidAmount += parsedAmount;

        // Save the updated client document
        await client.save();

        res.status(200).json({
            success: true,
            message: "Due amount updated successfully",
            client,
        });
    } catch (error) {
        console.error('Error updating due amount:', error);
        res.status(500).json({
            success: false,
            message: "Could not update due amount due to an internal error",
            error: error.message,
        });
    }
};

module.exports = { addClient, getClient, deleteClient, uploadProfile, getLatestClients, getClientById, getClientByCustomerId, addDueAmount, subtractDueAmount };