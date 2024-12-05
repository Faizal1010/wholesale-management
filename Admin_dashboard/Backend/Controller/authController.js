const jwt = require('jsonwebtoken');
const Client = require('../Models/clientModel'); // User model

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

        // Find user by email
        const user = await Client.findOne({ Email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check password
        if (user.Password !== Password) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.Email }, JWT_SECRET, { expiresIn: '3d' });

        // Send token to client
        res.status(200).json({ success: true, message: 'Login successful', token });
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
