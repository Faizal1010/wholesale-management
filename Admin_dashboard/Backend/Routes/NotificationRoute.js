const express = require('express')
const { sendNotification, fetchNotifications, fetchById, fetchByClientId } = require('../Controller/NotificationController')
const router = express.Router()

router.post('/send-notification', sendNotification)

router.get('/fetch-notifications', fetchNotifications)

router.get('/by-id-notification/:id', fetchById)

router.get('/by-client-id/:id', fetchByClientId)

module.exports = router