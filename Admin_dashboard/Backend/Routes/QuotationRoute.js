const express = require('express')
const { quoteSubmissionByClient, getQuotes, getById } = require('../Controller/QuotationController')
const router = express.Router()


// client submitting the quote
router.post('/submit-quote', quoteSubmissionByClient)

router.get('/get-quote/:clientId', getQuotes)

router.get('/fetch-by-quoteId/:id', getById)

module.exports = router