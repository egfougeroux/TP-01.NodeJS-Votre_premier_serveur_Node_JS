const http = require('http');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer(function(req, res) {
    const parsedUrl = url.parse(req.url);
    const page = parsedUrl.pathname;
    const params = querystring.parse(parsedUrl.query);

    console.log("Page demandée : " + page);

    // Mission 4 : routes autorisées
    if (page === '/' || page === '/etape1') {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

        if ("name" in params && "age" in params) {
            res.end("Bonjour " + params.name + ", vous avez " + params.age + " ans !");
        } else if ("name" in params) {
            res.end("Bonjour " + params.name + " !");
        } else {
            res.end("Bonjour inconnu");
        }
    }

    // --- Mission 5 ---
    else if (page === '/secret') {
        // On vérifie la présence et la valeur du Header
        if (req.headers['x-mon-token'] === 'secret123') {
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Accès autorisé : en-tête valide !");
        } else {
            res.writeHead(401, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("401 Non autorisé : en-tête manquant ou invalide.");
        }
    }

    // --- Mission 6 ---

    // Mission 6.1 : Basic Auth
    else if (page === '/basic-auth') {
        const auth = req.headers['authorization'];

        if (auth && auth.startsWith('Basic ')) {
            // Décodage de la chaîne en Base64
            const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString('ascii');
            
            // Vérification utilisateur:motdepasse (ici admin:secret)
            if (credentials === 'admin:secret') {
                res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                return res.end("Authentification Basic Auth réussie !");
            }
        }

        // Si identifiants absents ou faux : 401 Unauthorized
        res.writeHead(401, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("401 Non autorisé : identifiants Basic Auth incorrects.");
    }

    // Mission 6.2 : API Key
    else if (page === '/api-key') {
        const apiKey = req.headers['x-api-key'];

        if (apiKey === 'cle-secrete-bts-2026') {
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Authentification API Key réussie !");
        } else {
            res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("403 Accès interdit : Clé API manquante ou invalide.");
        }
    }

    // Mission 6.3 : Bearer Token
    else if (page === '/bearer-token') {
        const auth = req.headers['authorization'];

        if (auth && auth.startsWith('Bearer ')) {
            const token = auth.split(' ')[1];

            if (token === 'token-secret-jwt-2026') {
                res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                return res.end("Authentification Bearer Token réussie !");
            }
        }

        res.writeHead(401, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("401 Non autorisé : Bearer Token manquant ou invalide.");
    }

    // Erreur 404 pour le reste
    else {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Erreur 404 : Page introuvable !");
    }
});

server.listen(8085);
