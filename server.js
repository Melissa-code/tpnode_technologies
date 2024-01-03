const express = require('express'); 
const db = require('./database/database.js'); 
const bodyParser = require('body-parser'); 
const cors = require('cors');
const app = express();
const homeRoute = require('./routes/homeRoute.js'); 
const utilisateurRoute = require('./routes/utilisateurRoute.js'); 
const commentaireRoute = require('./routes/commentaireRoute.js');
const messageRoute = require('./routes/messageRoute.js');

app.use(bodyParser.json());
app.use(cors());

// Routes 
app.use('/', homeRoute); 

app.use('/utilisateurs', utilisateurRoute); 

app.use('/commentaires', commentaireRoute); 

app.use('/messages', messageRoute); 

// Server 
app.listen(8000, function() {
    console.log('serveur sur le port 8000');
});