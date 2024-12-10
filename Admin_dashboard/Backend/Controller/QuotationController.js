const Quotation = require('../Models/QuotationModel');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');





const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './tempUploads'); // Temporary folder for initial file storage
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage }).single('file'); // Handles single file upload









const quoteSubmissionByClient = async (req, res) => {
  console.log(req.body);
  try {
    const {
      client,
      clientCode,
      quoteCode,
      quoteDate,
      dueDate,
      notes,
      terms,
      products,
      Profile,
      Email
    } = req.body;

    // Validate required fields
    if (!client || !clientCode || !quoteCode || !products || !products.length) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Create a new quotation
    const newQuotation = new Quotation({
      client,
      clientCode,
      quoteCode,
      quoteDate,
      dueDate,
      notes,
      terms,
      products,
      Profile,
      Email, // Use products array as-is
      attended: false,
      responseFile: 'N/A'
    }); 
      // Save the quotation to the database
    const savedQuotation = await newQuotation.save();

    // Respond with the saved quotation
    res.status(201).json({ message: 'Quotation created successfully!', data: savedQuotation });
  } catch (error) {
    console.error('Error saving quotation:', error);
    res.status(500).json({ error: 'Failed to create quotation.' });
  }
};

const getQuotes = async (req, res) => {
        try {
            const { clientId } = req.params;
    
            // Validate the clientId parameter
            if (!clientId) {
                return res.status(400).json({ error: 'Client ID is required.' });
            }
    
            // Query the database for quotations matching the clientId
            const quotes = await Quotation.find({ clientCode: clientId });
    
            // Check if any quotes were found
            if (quotes.length === 0) {
                return res.status(404).json({ message: 'No quotes found for this client.' });
            }
    
            // Respond with the found quotes
            res.status(200).json({ message: 'Quotes retrieved successfully.', data: quotes });
        } catch (error) {
            console.error('Error fetching quotes:', error);
            res.status(500).json({ error: 'Failed to fetch quotes.' });
        }
};

const getById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format.' });
  }

  try {
    // Find the quotation by its ID
    const quotation = await Quotation.findById(id);

    // Check if the quotation exists
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found.' });
    }

    // Respond with the found quotation
    res.status(200).json({ message: 'Quotation retrieved successfully.', data: quotation });
  } catch (error) {
    console.error('Error fetching quotation:', error);
    res.status(500).json({ error: 'Failed to fetch quotation.' });
  }
};



// These handlers are for admins
const getAllClients = async (req, res) => {
  try {
    // Fetch all quotations from the database
    const quotations = await Quotation.find();

    // Check if quotations exist
    if (quotations.length === 0) {
      return res.status(404).json({ message: 'No quotations found.' });
    }

    // Respond with the retrieved quotations
    res.status(200).json({ message: 'Quotations retrieved successfully.', data: quotations });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({ error: 'Failed to fetch quotations.' });
  }
};


const respondQuotation = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(500).json({ error: "File upload failed." });
    }

    try {
      const { note, dataId } = req.body;
      const file = req.file;

      // Log received data for debugging
      console.log("Received FormData:", {
        note,
        fileName: file.originalname,
        dataId,
        filePath: file.path,
      });

      // Find and update the document in the Quotation model
      const quotation = await Quotation.findOneAndUpdate(
        { _id: dataId },
        { responseFile: file.originalname, attended: true }, // Set attended to true
        { new: true }
      );

      if (!quotation) {
        return res.status(404).json({
          success: false,
          message: "Quotation not found.",
        });
      }

      // Create the folder named with dataId in the specified directory
      const targetDir = path.resolve(
        __dirname,
        "../../Frontend/assets/quotations",
        dataId
      );
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Move the file to the new directory
      const targetPath = path.join(targetDir, file.originalname);
      fs.renameSync(file.path, targetPath);

      console.log(`File saved at: ${targetPath}`);

      res.json({
        success: true,
        message: "Quotation responded to successfully.",
      });
    } catch (error) {
      console.error("Error in respondQuotation:", error);
      res.status(500).json({ error: "Server error. Please try again later." });
    }
  });
};


module.exports = { quoteSubmissionByClient, getQuotes, getById, getAllClients, respondQuotation };