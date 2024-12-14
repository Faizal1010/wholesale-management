const mongoose = require('mongoose');
const Payments = require('../Models/paymentModel'); // Import the model
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const emailFolder = path.join(__dirname, '../../Frontend/assets/payments', req.body.paymentId);
    
    // Ensure the folder exists or create it
    if (!fs.existsSync(emailFolder)) {
      fs.mkdirSync(emailFolder, { recursive: true });
    }

    cb(null, emailFolder); // Set the destination folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  }
});

const upload = multer({ storage }).single('invoiceFile'); // Single file upload with 'invoiceFile' field name

const addPayment = (req, res) => {
  // Handle file upload
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file',
        error: err.message
      });
    }

    try {
      // Extract payment details from the request body
      const {
        clientName,
        paymentId,
        clientId,
        clientEmail,
        dueAmount,
        paidAmount,
        amount,
        paymentMethod,
        paymentNote,
        clientProfile
      } = req.body;

      // Get the uploaded file's name
      const fileName = req.file ? req.file.originalname : null;

      // Create a new payment document
      const newPayment = new Payments({
        clientName,
        paymentId,
        clientId,
        clientEmail,
        dueAmount,
        paidAmount,
        amount,
        fileName,
        paymentMethod,
        paymentNote,
        clientProfile
      });

      // Save the document to the database
      await newPayment.save();

      // Send a success response
      res.status(201).json({
        success: true,
        message: 'Payment details added successfully',
        data: newPayment
      });
    } catch (error) {
      console.error('Error adding payment details:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add payment details',
        error: error.message
      });
    }
  });
};

const getAllPayments = async (req, res) => {
  try {
    // Fetch all payment documents from the database
    const payments = await Payments.find();

    // Check if payments exist
    if (!payments || payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No payment records found'
      });
    }

    // Send the fetched payments as a response
    res.status(200).json({
      success: true,
      message: 'Payments retrieved successfully',
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};


module.exports = { addPayment, getAllPayments };
