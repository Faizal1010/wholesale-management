const express = require('express')
const { addClient, getClient, deleteClient, uploadProfile, getLatestClients, getClientById, getClientByCustomerId, addDueAmount, subtractDueAmount } = require('../Controller/clientController')
const router = express.Router()

router.post('/add-client', addClient)

router.get('/get-client', getClient)

router.delete('/delete-client/:id', deleteClient)

router.post('/upload-profile', uploadProfile)

router.get('/latest-Clients', getLatestClients)

router.get('/by-id-client/:id', getClientById)

//this handler is to get client by customer code(eg. CJH45P)
router.get('/code-client/:customerId', getClientByCustomerId)


// this handler is for adding the amount of new orders
router.post('/dueAmount-add', addDueAmount)

router.post('/subtract-dueAmount', subtractDueAmount)

module.exports = router


// const authenticate = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1]; // Token sent in the Authorization header

//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: 'Access denied. No token provided.',
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Add user info to request object
//         next(); // Proceed to the next route handler
//     } catch (error) {
//         return res.status(403).json({
//             success: false,
//             message: 'Invalid or expired token.',
//         });
//     }
// };