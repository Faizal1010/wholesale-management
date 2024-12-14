const express = require('express')
const { addPayment, getAllPayments } = require('../Controller/paymentController')
const router = express.Router()

router.post('/add-payment', addPayment)

router.get('/get-all-payments', getAllPayments)

module.exports = router