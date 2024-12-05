const express = require('express')
const { addOrder, getOrders } = require('../Controller/OrdersController')
const router = express.Router()

router.post('/add-order', addOrder)

router.get('/get-orders', getOrders)

module.exports = router