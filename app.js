// Importer les modules nécessaires
const http = require('http');
const url = require('url');
const querystring = require('querystring'); // 1. Ajout du module querystring

// Création du serveur
const server = http.createServer(function(req, res) {
    // 2. Affichage du chemin dans la console
    const page = url.parse(req.url).pathname;
    console.log("Page: " + page);

    // 3. Récupération des paramètres (query params)
    const params = querystring.parse(url.parse(req.url).query);

    // Création des Headers de la réponse
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

    // 4. Gestion des conditions pour name et age
    if ("name" in params && "age" in params) {
        res.end("Bonjour " + params.name + ", vous avez " + params.age + " ans !");
    } else if ("name" in params) {
        res.end("Bonjour " + params.name + " !");
    } else {
        res.end("Bonjour inconnu");
    }
});

// Démarrage du serveur sur le port 8085
server.listen(8085);