const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
// Port de demarrage du serveur
const port = 8409;
// Middleware pour parser le corps des requêtes
app.use(bodyParser.json());

// Demarrer a partir du repertoire "public"
// Middleware pour servir les fichiers HTML statiques
app.use(express.static(path.join(__dirname, 'public')));

// faire des requetes a partir du repertoire root
app.get('/', (req, res) => {
    // extraire les parametres de requete
    const query = req.query;
    // Serve the query.html page with the query parameters
    res.sendFile(path.join(__dirname, 'public', 'index.html'), {
        query: JSON.stringify(query),
    });
});

// creation de la connexion a postgres
const pool = new Pool({
    user: 'yamuser',
    host: 'localhost',
    database: 'yamgenodb',
    password: 'yampass'

});

// Demarrage du serveur
app.listen(port, () => {
    console.log(`Acceder au serveur http://localhost:${port}`);
    console.log(`+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);

});
