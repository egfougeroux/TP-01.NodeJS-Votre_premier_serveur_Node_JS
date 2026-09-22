const http = require('http');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer(function(req, res) {
    const parsedUrl = url.parse(req.url);
    const page = parsedUrl.pathname;
    const params = querystring.parse(parsedUrl.query);

    console.log("Page demandée : " + page);

    // Vérification de la route
    if (page === '/') {
        // Page d'accueil : statut 200 OK
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

        if ("name" in params && "age" in params) {
            res.end("Bonjour " + params.name + ", vous avez " + params.age + " ans !");
        } else if ("name" in params) {
            res.end("Bonjour " + params.name + " !");
        } else {
            res.end("Bonjour inconnu");
        }
    } else {
        // Route inconnue (ex: /etape5) : statut 404 Not Found
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Erreur 404 : Page introuvable !");
    }
});

server.listen(8085);
