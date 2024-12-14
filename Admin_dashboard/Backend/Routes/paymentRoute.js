const express = require('express')
const { addPayment, getAllPayments, GetPaymentsByClientId } = require('../Controller/paymentController')
const router = express.Router()

router.post('/add-payment', addPayment)

router.get('/get-all-payments', getAllPayments)


// get payments for clients
router.get('/by-client/:id', GetPaymentsByClientId)

module.exports = router