const express = require('express'); 
const router = express.Router(); 
const technologieController = require('../controllers/technologieController'); 
const middlewareIsAdmin = require('../middleware/middleware'); 

/**
 * Route to get all the technologies 
 */
router.get('/', technologieController.getAllTechnologies); 

/**
 * Route to get one technology
 */
router.get('/:id', technologieController.getOneTechnology); 

/**
 * Route to add a new technology (user must be an admin)
 */
router.post('/', middlewareIsAdmin.isAdmin, technologieController.addTechnology); 

/**
 * Route to update a technology (user must be an admin)
 */
router.put('/:id', middlewareIsAdmin.isAdmin, technologieController.updateTechnology); 

/**
 * Route to delete a technology (user must be an admin)
 */
router.delete('/:id', middlewareIsAdmin.isAdmin, technologieController.deleteTechnology); 

module.exports = router; 