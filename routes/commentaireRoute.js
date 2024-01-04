const express = require('express'); 
const router = express.Router(); 
const commentaireController = require('../controllers/commentaireController'); 
const middlewareAuth = require('../middleware/middleware'); 
const middlewareIsAdminOrIsJournalist = require('../middleware/middleware'); 

/**
 * Route to add a new feedback (user logged-in & admin or journalist)
 */
router.post('/', middlewareIsAdminOrIsJournalist.isAdminOrIsJournalist, middlewareAuth.authenticator, commentaireController.addFeedback); 

/**
 * Route get all feedbacks about a technology (user must be logged in)
 */
router.get('/:nomTechnologie', middlewareAuth.authenticator, commentaireController.getAllFeedbackAboutTechnology); 

/**
 * Route to get all the feedbacks in the template HTML (user must be logged in)
 */
router.get('/liste_commentaires_technologie', middlewareAuth.authenticator, commentaireController.getAllFeedbacksAboutTechnologyInTemplateHtml); 

/**
 * Route get all feedbacks about a technology before a date in params (user must be logged in)
 */
router.get('/:nomTechnologie/:dateCreation', middlewareAuth.authenticator, commentaireController.getAllFeedbackAboutTechnologyBeforeDateInParams); 

module.exports = router; 
