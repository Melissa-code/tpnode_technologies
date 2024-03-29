const db = require('../database/database.js'); 
const path = require('path');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config(); 

/**
 * Get all the users in the database
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllUsers = async function (req, res) {
    try {
        //console.log('Lancement de la requete SQL'); // ok
        const [result, field] = await db.query('SELECT * FROM utilisateur');
        res.status(200).json(result);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des utilisateurs.' });
    } 
}; 

/**
 * Display the list of the users in a HTML template
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllUsersInTemplateHtml = async function (req, res) {
    try {
        const filePath = path.join(__dirname, '../users.html');
        res.sendFile(filePath);
    } catch (err) {
        console.error('Erreur :', err);
        res.status(500).send(`Erreur : ${err.message}`);
    }
}

/**
 * Get one user in the database 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getOneUser = async function (req, res) {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({ error: "L'identifiant d'utilisateur doit être un nombre entier positif." });
        }
        const [result, field] = await db.query('SELECT nom, prenom, email FROM utilisateur WHERE id = ?', [userId]);
        // Check if the user exists in the database 
        if (result.length === 0) {
            return res.status(404).json({ error: `Aucun utilisateur trouvé avec l'identifiant ${userId}.` });
        }
        res.status(200).json(result[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération de l\'utilisateur numéro ${req.params.id}`, err);
        res.status(500).json({ error: `Une erreur est survenue lors de la récupération de l\'utilisateur numéro ${req.params.id}`});
    } 
}; 

/**
 * Add a new user in the database 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.addUser = async function (req, res) {
    try {
        const { nom, prenom, email, mdp } = req.body;
        // Check if there are a nom prenom email in Postman 
        if (!nom || !prenom || !email || !mdp) {
            return res.status(400).json({ error: "Veuillez fournir le nom, le prénom, l'email et le mot de passe de l'utilisateur." });
        }
        // Insert the user in the DB 
        const result = await db.query('INSERT INTO utilisateur (nom, prenom, email, mdp) VALUES (?, ?, ?, ?)', [nom, prenom, email, mdp]);
        res.status(200).json({ message: "Utilisateur créé avec succès.", insertedId: result.insertId });

    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la création de l'utilisateur." });
    }
}; 

/**
 * Update a user in the database 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateUser = async function (req, res) {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({ error: "L'identifiant d'utilisateur doit être un nombre entier positif." });
        }
        const { nom, prenom, email, mdp } = req.body;
        // Check if there are a nom prenom email in Postman 
        if (!nom || !prenom || !email || !mdp) {
            return res.status(400).json({ error: "Veuillez fournir le nom, le prénom, l'email et le mot de passe de l'utilisateur." });
        }
        // Update the user
        const [result, field] = await db.query('UPDATE utilisateur SET nom = ?, prenom = ?, email = ?, mdp = ? WHERE id = ?', [nom, prenom, email, mdp, userId]);
        
        // Check if the user exists in the database 
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Aucun utilisateur trouvé avec l'identifiant ${userId}.` });
        }      
        res.status(200).json({ message: `Utilisateur avec l'identifiant ${userId} mis à jour avec succès.` });
    } catch (err) {
        console.error('Erreur lors de la modification de l\'utilisateur :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la modification de l\'utilisateur.' });
    } 
}

/**
 * Delete a user in the database 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteUser = async function (req, res) {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({ error: "L'identifiant d'utilisateur doit être un nombre entier positif." });
        }
        const [result, field] = await db.query('DELETE FROM utilisateur WHERE id = ?', [userId]);
        // Check if the user exists in the database 
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Aucun utilisateur trouvé avec l'identifiant ${userId}.` });
        }      
        res.status(200).json({ message: `Utilisateur avec l'identifiant ${userId} a bien été supprimé.` });
    } catch (err) {
        console.error(`Erreur lors de la suppression de l\'utilisateur numero ${userId} :`, err);
        res.status(500).json({ error: `Une erreur est survenue lors de la suppression de l\'utilisateur ${userId}.` });
    } 
}

/**
 * Register a user 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.register = async function (req, res) {
    try {
        // Check the email because it is unique 
        const { nom, prenom, email, mdp } = req.body;
        const [result, field] = await db.query('SELECT email, mdp FROM utilisateur WHERE email = ?', [email]);

        if (result.length > 0) {
            return res.status(400).json({error: "Inscription impossible. Cet utilisateur existe déjà."});
        }
        // If new email, hash mdp with bcrypt 
        const hashMdp = await bcrypt.hash(mdp, 10); // 10 turns
        // save the new user
        await db.query('INSERT INTO utilisateur (nom, prenom, email, mdp, role) VALUES (?, ?, ?, ?, ?)', [nom, prenom, email, hashMdp, null]);

        // send jwt token for signature 
        const token = jwt.sign({email}, process.env.SECRET_KEY, {expiresIn: '1h'});
        res.json({token}); 
    } catch(err) {
        console.error(`Erreur lors de la création du compte utilisateur.`);
        res.status(500).json({ error: `Une erreur est survenue lors de la création du compte utilisateur.` });
    }    
}

/**
 * Log-in a user 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.login = async function (req, res) {
    try {
        // Check if the email already exists 
        const { email, mdp } = req.body; 
        const [result, field] = await db.query('SELECT * FROM utilisateur WHERE email = ?', [email]); 
        if (result.length === 0) {
            return res.status(401).json({error: "Connexion impossible. Utilisateur non existant."}); 
        }
        // Get the hash mdp 
        const user = result[0]; 
        console.log(user); 
        // compare mdp avec mdp bcrypt (first parm = no hash)
        const sameMdp = await bcrypt.compare(mdp, user.mdp)
        // if mdp = hash mdp return jwt token fir sign
        if (!sameMdp) {
            return res.status(401).json({error: "Mot de passe incorrect. "})
        } 
        console.log('connexion reussie.')
        const token = jwt.sign({email}, process.env.SECRET_KEY, {expiresIn: '1h'})
        res.json({token})
    } catch(err) {
        console.error('Erreur durant la connexion :', err); 
        res.status(500).json({ error: 'Erreur serveur.' });
    }
}

/**
 * Display the login form in a HTML template
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.loginInTemplateHtml = async function (req, res) {
    try {
        const filePath = path.join(__dirname, '../login.html');
        res.sendFile(filePath);
    } catch (err) {
        console.error('Erreur :', err);
        res.status(500).send(`Erreur : ${err.message}`);
    }
}