const express = require('express'); 
const router = express.Router(); 
const utilisateurController = require('../controllers/utilisateurController'); 

/**
 * Route to get all the users 
 */
router.get('/', utilisateurController.getAllUsers); 

/**
 * Route to get all the users in the template HTML 
 */
router.get('/liste_utilisateurs', utilisateurController.getAllUsersInTemplateHtml); 

/**
 * Route to get one user 
 */
router.get('/:id', utilisateurController.getOneUser); 

/**
 * Route to add a new user 
 */
router.post('/', utilisateurController.addUser); 

/**
 * Route to update a user 
 */
router.put('/:id', utilisateurController.updateUser); 

/**
 * Route to delete a user
 */
router.delete('/:id', utilisateurController.deleteUser); 

/**
 * Route to register a user 
 */
router.post('/inscription', utilisateurController.register)

/**
 * Route to login a user 
 */
//router.get('/connexion', userController.login)

module.exports = router; 