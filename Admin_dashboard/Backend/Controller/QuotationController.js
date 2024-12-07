const Quotation = require('../Models/QuotationModel');
const mongoose = require('mongoose');

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
      products, // Use products array as-is
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

  

module.exports = { quoteSubmissionByClient, getQuotes, getById };