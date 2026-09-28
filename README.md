# TP - 01. NodeJS - Votre premier serveur Node JS

**Nom :** Emma-Gabrielle FOUGEROUX <br>
**Classe :** BTS SIO SLAM2

---

## Mission 1 : Créer un serveur web

### Questions & Réponses
---

**1. Quelle commande vous permet d'afficher les ports utilisés sur votre machine (serveur) ?**

`ss -tuln` (ou alternativement netstat `-tuln`).

*Explication :* l'option `-t` filtre TCP, `-u` UDP, `-l` affiche les sockets en écoute (listening) et `-n` affiche les ports en format numérique.

<br>

**2. Quelle commande vous permet d'afficher les ports ouverts sur une machine distante ?**

`nmap <IP_DISTANTE>` (ou `nc -zv <IP_DISTANTE> <PORT>` pour tester un port précis).

*Explication :* L'outil `nmap` permet de scanner les ports et d'identifier les services ouverts à distance.

<br>

**3. Rendez-vous à l'adresse `[http://172.16.](http://172.16.XXX.254:8085`. Que remarquez-vous ?**

Le navigateur affiche en texte brut la phrase envoyée par le serveur : `Hello BTS SIO SLAM!`.

<br>

**4. Sauriez-vous identifier le contenu qui s'affiche dans la page web dans les sources du serveur `app.js` ?**

Oui, il s'agit de la chaîne passée en argument de la méthode `res.end('Hello BTS SIO SLAM!')`.

<br>

**5. Dans le fichier `app.js`, changer le message en 'Bienvenue sur le site officiel du BTS SIO SLAM'. Rechargez la page web ! Le contenu est mis à jour. Pourquoi ?**

Le contenu se met à jour car le script a été lancé avec la commande node `--watch app.js`. Le paramètre `--watch` surveille en continu les modifications du fichier source et redémarre automatiquement le serveur Node.js à chaque enregistrement.

<br>

**6. À quoi correspond le numéro 200 dans le code ?**

Le code `200` est le code de statut HTTP standard **OK**. Il indique au client que la requête a été reçue, comprise et traitée avec succès par le serveur.

<br>

**7. Ouvrez le panneau de développeur sur votre navigateur (F12) > onglet Network > rechargez la page. Que voyez-vous ?**

- Une requête HTTP de méthode GET vers l'URL du serveur avec un statut `200 OK`. 
- Dans les en-têtes de réponse (Response Headers), on retrouve `Content-Type: text/plain`. 
- Souvent, une seconde requête apparaît automatiquement pour demander l'icône de favori (`/favicon.ico`).

---

## Mission 2 : Créer un serveur web

### Questions & Réponses
---

**1. Sauvegardez le changement puis rechargez la page web, que remarquez-vous ?**

Dans la console du terminal (côté serveur), le serveur affiche `Page: /` (et éventuellement un second log `Page: /favicon.ico` suite à la requête du navigateur).

<br>

**2. Ajoutez un paramètre de requête dans l'URL (e.g. `http://IP-DU-SERVEUR:8085?test=btssioslam`) ; que remarquez-vous ?**

Dans le terminal, le log affiche toujours `Page: /`. En effet, `url.parse(req.url)`.pathname ne prend en compte que le chemin de la ressource et ignore volontairement la chaîne de requête *(query string)* qui commence après le point d'interrogation `?`.

<br>

**3. Connaissez-vous d'autres méthodes d'affichage dans la console que `console.log()` ?**

- `console.error()` : affiche un message d'erreur (souvent en rouge / canal stderr).
- `console.warn()` : affiche un avertissement (souvent en jaune).
- `console.info()` : affiche une information informative.
- `console.table()` : affiche des données complexes (tableaux ou objets) sous forme d'un tableau lisible.
- `console.clear()` : efface la console.

---

## Mission 3 : Gestion des query params avec le module

### Questions & Réponses
---

**1. Rechargez la page en passant le paramètre `name` dans l'URL (ex: `http://localhost:8085/?name=Jean`). Que remarquez-vous ?**

Le serveur extrait la valeur du paramètre via `params.name` et la page affiche désormais dynamiquement `Bonjour Jean !` au lieu de `Bonjour inconnu`.

<br>

**2. Modifiez le programme pour prendre en compte un paramètre `age`, puis affichez le message `"Bonjour [name], vous avez [age] ans !"`**

- **Test dans le navigateur :** <br>
    En appelant l'URL :
    `http://localhost:8085/?name=Alex&age=20` (ou avec l'IP de la VM)
    
- **Résultat obtenu :** <br>
    Le navigateur affiche : `Bonjour Alex, vous avez 20 ans !`.

---

## Mission 4 : Limiter l'accès à certaines URLs

### Gestion des routes et erreurs 404

L'application filtre les requêtes selon le chemin demandé (`pathname`) :

- Seules les URLs autorisées renvoient le code de statut HTTP `200 OK`.
- Toute autre URL non reconnue renvoie une erreur HTTP `404 Not Found`

### Exemples d'appels

| URL demandée | Statut HTTP retourné | Explication / Réponse |
| :--- | :--- | :--- |
| `http://localhost:8085/etape1` | `200 OK` | URL autorisée (affiche "Bonjour inconnu") |
| `http://localhost:8085/etape1?name=Alex&age=20` | `200 OK` | URL autorisée avec paramètres ("Bonjour Alex, vous avez 20 ans !") |
| `http://localhost:8085/` | `200 OK` | Racine du serveur (autorisée) |
| `http://localhost:8085/autre` | `404 Not Found` | URL non existante ("Erreur 404 : Page introuvable !") |

---

## Mission 5 : Limiter l'accès en fonction d'un Header présent dans la requête

### Paramètres définis
- **Route protégée :** `/secret`
- **Header exigé :** `x-mon-token`
- **Valeur attendue :** `secret123`

### Fonctionnement
Le serveur extrait les en-têtes via `req.headers['x-mon-token']`.
- Si le header correspond à la valeur demandée, le serveur renvoie un statut `200 OK`.
- Si le header est absent ou incorrect, le serveur renvoie un statut `401 Unauthorized`.

### Tests réalisés (via Postman / Insomnia)

| URL appelée | En-tête (Header) fourni | Statut HTTP obtenu | Message reçu |
| :--- | :--- | :--- | :--- |
| `/secret` | *(aucun)* | `401 Unauthorized` | 401 Non autorisé : en-tête manquant ou invalide. |
| `/secret` | `x-mon-token: faux` | `401 Unauthorized` | 401 Non autorisé : en-tête manquant ou invalide. |
| `/secret` | `x-mon-token: secret123` | `200 OK` | Accès autorisé : en-tête valide ! |

---

## Mission 6 : Utiliser les différents types d'authentification d'API

### Tableau récapitulatif des endpoints

| Endpoint | Type d'authentification | Emplacement & Format attendu | Valeur de test | Statut succès | Statut échec |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/basic-auth` | Basic Authentication | Header `Authorization: Basic <base64>` | `admin:secret` (`YWRtaW46c2VjcmV0`) | 200 OK | 401 Unauthorized |
| `/api-key` | API Key | Header `x-api-key: <clé>` | `cle-secrete-bts-2026` | 200 OK | 403 Forbidden |
| `/bearer-token` | Bearer Token | Header `Authorization: Bearer <token>` | `token-secret-jwt-2026` | 200 OK | 401 Unauthorized |
