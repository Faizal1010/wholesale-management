const Notification = require('../Models/notificationModel');
const mongoose = require('mongoose');


const sendNotification = async (req, res) => {
    console.log('sendNotification')
    const { Notification: notificationText, ClientName, ClientId, ClientEmail } = req.body;
  
    // Validate required fields
    if (!notificationText || !ClientName || !ClientId || !ClientEmail) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
  
    try {
      // Create a new notification
      const newNotification = new Notification({
        Notification: notificationText,
        ClientName,
        ClientId,
        ClientEmail,
      });
  
      // Save the notification to the database
      const savedNotification = await newNotification.save();
  
      // Respond with the saved notification
      res.status(201).json({
        message: 'Notification sent successfully!',
        data: savedNotification,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ error: 'Failed to send notification.' });
    }
  };

  const fetchNotifications = async (req, res) => {
    console.log('Fetching notifications');
    
    try {
      // Fetch all notifications from the database
      const notifications = await Notification.find();
  
      // Check if notifications exist
      if (!notifications || notifications.length === 0) {
        return res.status(404).json({ message: 'No notifications found.' });
      }
  
      // Send the fetched notifications as a response
      res.status(200).json({
        message: 'Notifications retrieved successfully.',
        data: notifications,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
  };


  const fetchById = async (req, res) => {
    console.log('Fetching notification by ID');
  
    // Extract ID from the request parameters
    const { id } = req.params;
  
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid notification ID.' });
    }
  
    try {
      // Fetch the notification by ID from the database
      const notification = await Notification.findById(id);
  
      // If notification not found, return a 404
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found.' });
      }
  
      // Send the fetched notification as a response
      res.status(200).json({
        message: 'Notification retrieved successfully.',
        data: notification,
      });
    } catch (error) {
      console.error('Error fetching notification by ID:', error);
      res.status(500).json({ error: 'Failed to fetch notification.' });
    }
  };


  const fetchByClientId = async (req, res) => {
    console.log('Fetching notifications by ClientId');
  
    // Extract ClientId from the request parameters
    const { id: clientId } = req.params;

    try {
        // Fetch notifications by ClientId from the database
        const notifications = await Notification.find({ ClientId: clientId });

        // If no notifications are found, return a 404 response
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found for the specified ClientId.' });
        }

        // Send the fetched notifications as a response
        res.status(200).json({
            message: 'Notifications retrieved successfully.',
            data: notifications,
        });
    } catch (error) {
        console.error('Error fetching notifications by ClientId:', error);
        res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
};


module.exports = { sendNotification, fetchNotifications, fetchById, fetchByClientId };