const express = require('express'); 
const app = express();
const db = require('./database.js'); 
let cors = require('cors');

// middleware
app.use(express.json());
// cors
app.use(cors());

/**
 * Home page 
 */
app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}).end('<h1>Bienvenue sur la Page accueil</h1>');
});

/**
 * Display the list of the users in a HTML template
 */
app.get('/liste_utilisateurs', function (req, res) {
    res.sendFile(__dirname + '/users.html');
});

/**
 * Display the list of the feedbacks about a technology in a HTML template
 */
app.get('/liste_commentaires_technologie', function (req, res) {
    res.sendFile(__dirname + '/feedbacks.html');
});


/* **************************** */
/* Users API */
/* **************************** */

/**
 * Get all the users in the database
 */
app.get('/utilisateurs', async function (req, res) {
    try {
        const [result, field] = await db.query('SELECT * FROM utilisateur');
        res.status(200).json(result);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des utilisateurs.' });
    } 
});

/**
 * Get one user only in the database 
 */
app.get('/utilisateurs/:id', async function (req, res) {
    try {
        // Get the param of the url
        const userId = parseInt(req.params.id);
        // Check if the id is an integer and a positive number
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
});

/**
 * Add a new user in the database (with Postman)
 */
app.post('/utilisateur', async function (req, res) {
    try {
        const { nom, prenom, email } = req.body;
        // Check if there are a nom prenom email in Postman 
        if (!nom || !prenom || !email) {
            return res.status(400).json({ error: "Veuillez fournir le nom, le prénom et l'email de l'utilisateur." });
        }
        // Insert the user in the DB 
        const result = await db.query('INSERT INTO utilisateur (nom, prenom, email) VALUES (?, ?, ?)', [nom, prenom, email]);
        res.status(200).json({ message: "Utilisateur créé avec succès.", insertedId: result.insertId });

    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la création de l'utilisateur." });
    }
}); 

/**
 * Update a user in the database
 */
app.put('/utilisateurs/:id', async function (req, res) {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({ error: "L'identifiant d'utilisateur doit être un nombre entier positif." });
        }

        const { nom, prenom, email } = req.body;
        // Check if there are a nom prenom email in Postman 
        if (!nom || !prenom || !email) {
            return res.status(400).json({ error: "Veuillez fournir le nom, le prénom et l'email de l'utilisateur." });
        }
        // Update the user
        const [result, field] = await db.query('UPDATE utilisateur SET nom = ?, prenom = ?, email = ? WHERE id = ?', [nom, prenom, email, userId]);
        
        // Check if the user exists in the database 
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Aucun utilisateur trouvé avec l'identifiant ${userId}.` });
        }      
        res.status(200).json({ message: `Utilisateur avec l'identifiant ${userId} mis à jour avec succès.` });
    } catch (err) {
        console.error('Erreur lors de la modification de l\'utilisateur :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la modification de l\'utilisateur.' });
    } 
});

/**
 * Delete a user in the database (with Postman)
 */
app.delete('/utilisateurs/:id', async function (req, res) {
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
});

/* **************************** */
/* Feedbacks API */
/* **************************** */

/**
 * Add a new feedback in the database (with Postman)
 */
app.post('/commentaire', async function (req, res) {
    try {
        const { date, utilisateur_id, technologie_id } = req.body;
        // Check the data in Postman 
        if (!date || !utilisateur_id || !technologie_id) {
            return res.status(400).json({ error: "Veuillez fournir la date, l'id de l'utilisateur et l'id de la technologie." });
        }
        // Insert the user in the DB 
        const result = await db.query('INSERT INTO commentaire (date_creation_commentaire, utilisateur_id, technologie_id) VALUES (?, ?, ?)', [date, utilisateur_id, technologie_id]);
        res.status(200).json({ message: "Commentaire créé avec succès.", insertedId: result.insertId });

    } catch (error) {
        console.error("Erreur lors de la création du commentaire :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la création du commentaire." });
    }
}); 

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
 */
app.get('/commentaires/:nomTechnologie', async function (req, res) {
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
});

/**
 * Get all the messages written by a user in the database
 */
app.get('/messages/:userId', async function (req, res) {
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
});

/**
 * Get all the feedbacks in the database about a technology before the date in params 
 */
app.get('/commentaires/:nomTechnologie/:dateCreation', async function (req, res) {
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
});

app.listen(8000, function() {
    console.log('serveur sur le port 8000');
});