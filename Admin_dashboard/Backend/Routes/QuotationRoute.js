const express = require('express')
const { quoteSubmissionByClient, getQuotes, getById, getAllClients, respondQuotation } = require('../Controller/QuotationController')
const router = express.Router()


// client submitting the quote
router.post('/submit-quote', quoteSubmissionByClient)

router.get('/get-quote/:clientId', getQuotes)

router.get('/fetch-by-quoteId/:id', getById)


// These are the routes for admins
router.get('/all-clients', getAllClients)

router.post('/respond-quotation', respondQuotation)

module.exports = router