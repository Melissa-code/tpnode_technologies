const db = require('../database/database.js'); 

/**
 * Get all the messages written by a user (userId) in the database
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getAllMessagesOfUser = async function (req, res) {
    try {
        let userId = parseInt(req.params.userId);
        if (userId <= 0) {
            return res.status(400).json({ error: "L'identifiant d'utilisateur doit être un nombre entier positif." });
        }
       
        const [result, field] = await db.query('SELECT c.id, c.date_creation_commentaire, u.nom, u.prenom FROM commentaire AS c INNER JOIN utilisateur AS u ON c.utilisateur_id = u.id WHERE c.utilisateur_id = ?', [userId]);
        res.status(200).json(result);
    } catch (err) {
        console.error('Erreur lors de la récupération des commentaires rédigés par une personne :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des commentaires rédigés par une personne.' });
    } 
}