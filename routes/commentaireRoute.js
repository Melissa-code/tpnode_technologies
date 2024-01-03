const express = require('express'); 
const router = express.Router(); 
const commentaireController = require('../controllers/commentaireController'); 
const middlewareAuth = require('../middleware/middleware'); 

/**
 * Route to add a new feedback
 */
router.post('/', commentaireController.addFeedback); 

/**
 * Route get all feedbacks about a technology (user must be logged in)
 */
router.get('/:nomTechnologie', middlewareAuth.authenticator, commentaireController.getAllFeedbackAboutTechnology); 

/**
 * Route to get all the feedbacks in the template HTML 
 */
router.get('/liste_commentaires_technologie', middlewareAuth.authenticator, commentaireController.getAllFeedbacksAboutTechnologyInTemplateHtml); 

/**
 * Route get all feedbacks about a technology before a date in params
 */
router.get('/:nomTechnologie/:dateCreation', middlewareAuth.authenticator, commentaireController.getAllFeedbackAboutTechnologyBeforeDateInParams); 

module.exports = router; 
