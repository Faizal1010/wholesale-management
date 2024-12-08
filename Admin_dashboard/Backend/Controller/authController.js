const jwt = require('jsonwebtoken');
const Client = require('../Models/clientModel'); // User model
const mongoose = require('mongoose')

// JWT Secret Key
const JWT_SECRET = 'sjbublbclqNRl893bp  83t395vb8nm3;cn'; // Replace with a strong, secure key

// Login Controller
exports.login = async (req, res) => {
    console.log('Login attempt');
    try {
        const { Email, Password } = req.body;

        // Validate input
        if (!Email || !Password) {
            return res.status(400).json({ success: false, message: 'Email and Password are required' });
        }

        // Convert Email to lowercase for case-insensitive matching
        const emailLowerCase = Email.toLowerCase();

        // Check if the user is in the 'Client' model
        let user = await Client.findOne({ Email: emailLowerCase });

        if (user) {
            // If found in 'Client', check password and generate token
            console.log('Found user in Client collection');
            if (user.Password !== Password) {
                return res.status(401).json({ success: false, message: 'Invalid password' });
            }

            // Generate JWT with client information
            const token = jwt.sign(
                { id: user._id, email: user.Email, clientId: user.CustomerId, role: 'client' },
                JWT_SECRET,
                { expiresIn: '3d' }
            );

            // Send response with token for client
            return res.status(200).json({ success: true, message: 'Login successful', token });
        } else {
            // If not found in 'Client', check in 'admins' collection dynamically
            const adminsCollection = mongoose.connection.db.collection('admins');
            user = await adminsCollection.findOne({ email: emailLowerCase });

            if (user) {
                // If found in 'admins', check password and generate token
                console.log('Found user in Admins collection');
                if (user.password !== Password) {
                    return res.status(401).json({ success: false, message: 'Invalid password' });
                }

                // Generate JWT with admin information
                const token = jwt.sign(
                    { email: user.email, role: 'admin' },
                    JWT_SECRET,
                    { expiresIn: '3d' }
                );

                // Send response with token for admin
                return res.status(200).json({ success: true, message: 'Login successful', token });
            } else {
                // If user is not found in both collections
                console.log('User not found in either collection');
                return res.status(404).json({ success: false, message: 'User not found' });
            }
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// Middleware to Verify Token
exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add user info to the request
        console.log("req.use is ->",req.user)
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};








// Example Protected Route
exports.protectedRoute = (req, res) => {
    res.status(200).json({ message: `Welcome, ${req.user.email}` });
};
