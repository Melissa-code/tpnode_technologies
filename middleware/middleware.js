const jwt = require('jsonwebtoken')
require('dotenv').config(); 
const db = require('../database/database.js') 

/**
 * Check if the user is logged in
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.authenticator = (req, res, next) => {
    // Get the token (login)
    const token = req.query.token ? req.query.token : req.headers.authorization
    // 
    if (token && process.env.SECRET_KEY) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({erreur: "accès refusé"}); 
            } else {
                next(); 
            }
        })
    } else {
        res.status(401).json({erreur: "accès refusé"});
    }
}; 

/**
 * Get the email of the user from token 
 * 
 * @param {*} token 
 * @returns 
 */
const getEmailFromToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return decoded.email; 
    } catch(err) {
        return null; 
    }
}; 

/**
 * Check in the database if the user (get by his unique email) is an administrateur
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.isAdmin = async (req, res, next) => {
    const token = req.query.token || req.headers.authorization; 
    if (!token) {
        return res.status(401).json({error: "Accès refusé. Aucun token"});
    }
    const email = getEmailFromToken(token); 
    if (!email) {
        return res.status(401).json({error: "Token invalide." });
    }
    try {
        const [result, field] = await db.query('SELECT role FROM utilisateur WHERE email = ?' , [email]); 
        console.log(result[0].role);
        if (result.length === 1 && result[0].role === "administrateur") {
            next(); 
        } else {
            res.status(403).json({error: 'Accès refusé. Seul un utilisateur de rôle administrateur a un droit d\'acccès.'});
        }
    } catch(error) {
        console.error(error); 
        res.status(500).json({error: 'Erreur serveur.'})
    }
}