const db = require('../database/database.js'); 

/**
 * Get all the technologies in the database
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllTechnologies = async function (req, res) {
    try {
        const [result, field] = await db.query('SELECT * FROM technologie');
        res.status(200).json(result);
    } catch (err) {
        console.error('Erreur lors de la récupération des technologies :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des technologies.' });
    } 
}; 

/**
 * Get one technology in the database 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getOneTechnology = async function (req, res) {
    try {
        const technologyId = parseInt(req.params.id);
        if (isNaN(technologyId) || technologyId <= 0) {
            return res.status(400).json({ error: "L'identifiant de la technologie doit être un nombre entier positif." });
        }
        const [result, field] = await db.query('SELECT nom_technologie, date_creation_technologie, nom_createur_technologie FROM technologie WHERE id = ?', [technologyId]);
        if (result.length === 0) {
            return res.status(404).json({ error: `Aucune technologie trouvée avec l'identifiant ${technologyId}.` });
        }
        res.status(200).json(result[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération de la technologie numéro ${req.params.id}`, err);
        res.status(500).json({ error: `Une erreur est survenue lors de la récupération de la technologie numéro ${req.params.id}`});
    } 
}; 

/**
 * Add a new technology in the database 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.addTechnology = async function (req, res) {
    try {
        const { nom_technologie, date_creation_technologie, nom_createur_technologie } = req.body;
        if (!nom_technologie  || !date_creation_technologie || !nom_createur_technologie ) {
            return res.status(400).json({ error: "Veuillez fournir le nom, la date et le créateur de la technologie." });
        }
        // Insert the user in the DB 
        const result = await db.query('INSERT INTO technologie (nom_technologie, date_creation_technologie, nom_createur_technologie) VALUES (?, ?, ?)', [nom_technologie, date_creation_technologie, nom_createur_technologie]);
        res.status(200).json({ message: "Technologie créée avec succès.", insertedId: result.insertId });

    } catch (error) {
        console.error("Erreur lors de la création de la technologie  :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la création de la technologie ." });
    }
}; 


/**
 * Update a technology in the database 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateTechnology = async function (req, res) {
    try {
        const technologyId = parseInt(req.params.id);
        if (isNaN(technologyId) || technologyId <= 0) {
            return res.status(400).json({ error: "L'identifiant de la technologie doit être un nombre entier positif." });
        }
        const { nom_technologie, date_creation_technologie, nom_createur_technologie } = req.body;
        if (!nom_technologie  || !date_creation_technologie || !nom_createur_technologie) {
            return res.status(400).json({ error: "Veuillez fournir le nom, la date de création et le créateur de la technologie." });
        }
        const [result, field] = await db.query('UPDATE technologie SET nom_technologie = ?, date_creation_technologie = ?, nom_createur_technologie = ? WHERE id = ?', [nom_technologie, date_creation_technologie, nom_createur_technologie, technologyId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Aucune technologie trouvée avec l'identifiant ${technologyId}.` });
        }      
        res.status(200).json({ message: `Technologie avec l'identifiant ${technologyId} mise à jour avec succès.` });
    } catch (err) {
        console.error('Erreur lors de la modification de la technologie :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la modification de la technologie.' });
    } 
}

/**
 * Delete a technology in the database 
 * TO DO : add on update cascade on delete cascade to the table commentaire (FK : technologie_id)
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteTechnology = async function (req, res) {
    try {
        const technologyId = parseInt(req.params.id);
        console.log(technologyId)
        if (isNaN(technologyId ) || technologyId  <= 0) {
            return res.status(400).json({ error: "L'identifiant de la technologie doit être un nombre entier positif." });
        }
        const [result, field] = await db.query('DELETE FROM technologie WHERE id = ?', [technologyId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Aucune technologie trouvée avec l'identifiant ${technologyId}.` });
        }      
        res.status(200).json({ message: `La technologieavec avec l'identifiant ${technologyId} a bien été supprimée.` });
    } catch (error) {
        console.error(`Erreur lors de la suppression de la technologie:`, error);
        res.status(500).json({ error: `Une erreur est survenue lors de la suppression de la technologie ${technologyId}.` });
    } 
}
