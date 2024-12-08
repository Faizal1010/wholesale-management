const mongoose = require('mongoose');
const connectDB = require('../Config/config');

connectDB();

const QuotationSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true
  },
  clientCode: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
  },
  // Change products to an array of objects
  products: [
    {
      ProductTitle: {
        type: String,
        required: true
      },
      properties: {
        type: String,
        required: true
      }
    }
  ],
  quoteCode: {
    type: String,
    required: true
  },
  terms: {
    type: String,
  },
  attended:{
    type: Boolean,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quotation', QuotationSchema);
