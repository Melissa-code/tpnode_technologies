const express = require('express'); 
const app = express();
const db = require('./database.js'); 
//console.log(db);

// middleware
app.use(express.json())

/**
 * Home page 
 */
app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}).end('<h1>Bienvenue sur la Page accueil</h1>');
});

/**
 * Get all the users in the database
 */
app.get('/utilisateurs', async function (req, res) {
    try {
        const [result, field] = await db.query('SELECT * FROM utilisateur');
        //console.log(result);
        res.status(200).json(result);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des utilisateurs.' });
    } 
});

/**
 * Add a new user in the database 
 */
app.post('/utilisateur', async function (req, res) {
    try {
        const { nom, prenom, email } = req.body;
        const result = await db.query('INSERT INTO utilisateur (nom, prenom, email) VALUES (?, ?, ?)', [nom, prenom, email]);
        res.status(200).json({ message: "Utilisateur créé avec succès.", insertedId: result.insertId });

    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la création de l'utilisateur." });
    }
}); 


app.listen(8000, function() {
    console.log('serveur sur le port 8000');
});