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
    const token = req.params.token ? req.params.token : req.headers.authorization
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
}