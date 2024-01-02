const mysql = require('mysql2/promise'); 
require('dotenv').config(); 

const pool = mysql.createPool({
    host: process.env.DBHOST,
    database: process.env.DBDATABASE,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD
})

pool.getConnection(); // OK
module.exports = pool; 




// Configurer les paramètres de connexion à la base de données
// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'tpnode_technologies',
// };

// // Créer une connexion à la base de données
// const connection = mysql.createConnection(dbConfig);

// // Tester la connexion à la base de données
// connection.connect((err) => {
//   if (err) {
//     console.error('Erreur lors de la connexion à la base de données:', err);
//     return;
//   }

//   console.log('Connexion à la base de données réussie !');

//   // Vous pouvez exécuter d'autres opérations de base de données ici si nécessaire

//   // Fermer la connexion après avoir terminé
//   connection.end((err) => {
//     if (err) {
//       console.error('Erreur lors de la fermeture de la connexion à la base de données:', err);
//     } else {
//       console.log('Connexion à la base de données fermée avec succès.');
//     }
//   });
// });
