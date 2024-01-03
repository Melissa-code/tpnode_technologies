const express = require('express'); 
const router = express.Router(); 
const messageController = require('../controllers/messageController'); 

/**
 * Route to get messages written by a user (userId)
 */
router.get('/:userId', messageController.getAllMessagesOfUser); 

module.exports = router; 