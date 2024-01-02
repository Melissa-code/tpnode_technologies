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
 * Users page 
 */
app.get('/utilisateurs', async function (req, res) {
    try {
        console.log('Lancement de la connexion');
        console.log('Lancement de la requête');
        const [result, field] = await db.query('SELECT * FROM utilisateur');
        //console.log(result);
        res.status(200).json(result);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des utilisateurs.' });
    } 
});




app.listen(8000, function() {
    console.log('serveur sur le port 8000');
});