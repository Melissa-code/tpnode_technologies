const express = require('express'); 
const router = express.Router(); 
const commentaireController = require('../controllers/commentaireController'); 

/**
 * Route to add a new feedback
 */
router.post('/', commentaireController.addFeedback); 

/**
 * Route get all feedbacks about a technology 
 */
router.get('/:nomTechnologie', commentaireController.getAllFeedbackAboutTechnology); 

/**
 * Route to get all the feedbacks in the template HTML 
 */
router.get('/liste_commentaires_technologie', commentaireController.getAllFeedbacksAboutTechnologyInTemplateHtml); 

/**
 * Route get all feedbacks about a technology before a date in params
 */
router.get('/:nomTechnologie/:dateCreation', commentaireController.getAllFeedbackAboutTechnologyBeforeDateInParams); 

module.exports = router; 
