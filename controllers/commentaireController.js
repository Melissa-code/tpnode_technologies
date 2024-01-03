const db = require('../database/database.js'); 
const path = require('path');

/**
 * Add a new feedback 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.addFeedback = async function (req, res) {
    try {
        const { date, utilisateur_id, technologie_id, message } = req.body;
        // Check the data in Postman 
        if (!date || !utilisateur_id || !technologie_id || !message) {
            return res.status(400).json({ error: "Veuillez fournir la date, l'id de l'utilisateur, l'id de la technologie et le message." });
        }
        // Insert the user in the DB 
        const result = await db.query('INSERT INTO commentaire (date_creation_commentaire, utilisateur_id, technologie_id, message) VALUES (?, ?, ?, ?)', [date, utilisateur_id, technologie_id, message]);
        res.status(200).json({ message: "Commentaire créé avec succès.", insertedId: result.insertId });

    } catch (error) {
        console.error("Erreur lors de la création du commentaire :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la création du commentaire." });
    }
}

/**
 * Capitalize the first letter 
 * @param {*} str 
 * @returns 
 */
function strUcFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get all the feedbacks about a technology in the database
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllFeedbackAboutTechnology = async function (req, res) {
    try {
        let nomTechnologie = req.params.nomTechnologie;
        nomTechnologie = nomTechnologie.toLowerCase();
        nomTechnologie = strUcFirst(nomTechnologie);

        if (nomTechnologie === 'Javascript') {
            nomTechnologie = 'JavaScript';
        } else if (nomTechnologie === 'Typescript') {
            nomTechnologie = 'TypeScript';
        } else if(nomTechnologie === 'Php') {
            nomTechnologie = 'PHP'; 
        }
     
        const [result, field] = await db.query('SELECT c.id,c.date_creation_commentaire, c.utilisateur_id, c.technologie_id FROM commentaire AS c LEFT JOIN technologie AS t ON c.technologie_id = t.id WHERE nom_technologie = ?', [nomTechnologie]);
        res.status(200).json(result);
    } catch (err) {
        console.error('Erreur lors de la récupération des commentaires sur une technologie :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des commentaires sur une technologie.' });
    } 
}

/**
 * Display the list of the feedbacks about a technology in a HTML template
 *  
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllFeedbacksAboutTechnologyInTemplateHtml = async function (req, res) {
    try {
        const filePath = path.join(__dirname, '../feedbacks.html');
    res.sendFile(filePath);
    } catch (err) {
        console.error('Erreur :', err);
        res.status(500).send(`Erreur : ${err.message}`);
    }
}

/**
 * Get all the feedbacks in the database about a technology before the date in params 
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllFeedbackAboutTechnologyBeforeDateInParams = async function (req, res) {
    try {
        let nomTechnologie = req.params.nomTechnologie;
        nomTechnologie = nomTechnologie.toLowerCase();
        nomTechnologie = strUcFirst(nomTechnologie);

        if (nomTechnologie === 'Javascript') {
            nomTechnologie = 'JavaScript';
        } else if (nomTechnologie === 'Typescript') {
            nomTechnologie = 'TypeScript';
        } else if(nomTechnologie === 'Php') {
            nomTechnologie = 'PHP'; 
        }

        let dateCreation =  req.params.dateCreation;
     
        const [result, field] = await db.query('SELECT c.id,c.date_creation_commentaire, c.utilisateur_id, c.technologie_id FROM commentaire AS c LEFT JOIN technologie AS t ON c.technologie_id = t.id WHERE nom_technologie = ? AND c.date_creation_commentaire < ?', [nomTechnologie, dateCreation]);
        res.status(200).json(result);
    } catch (err) {
        console.error('Erreur lors de la récupération des commentaires sur une technologie :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des commentaires sur une technologie.' });
    } 
}