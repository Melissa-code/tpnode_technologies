const express = require('express'); 
const router = express.Router(); 
const technologieController = require('../controllers/technologieController'); 

/**
 * Route to get all the technologies 
 */
router.get('/', technologieController.getAllTechnologies); 

/**
 * Route to get one technology
 */
router.get('/:id', technologieController.getOneTechnology); 

/**
 * Route to add a new technology 
 */
router.post('/', technologieController.addTechnology); 

module.exports = router; 

/**
 * Route to update a technology 
 */
router.put('/:id', technologieController.updateTechnology); 

/**
 * Route to delete a technology 
 */
router.delete('/:id', technologieController.deleteTechnology); 

module.exports = router; 