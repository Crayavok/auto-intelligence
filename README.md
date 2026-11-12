# Auto Intelligence

Assistant intelligent d'achat de voitures d'occasion : recherche, fiabilité par motorisation, analyse d'annonces et détection des bonnes affaires (France, Belgique, Allemagne, Autriche).

**Application en ligne :** https://crayavok.github.io/auto-intelligence/

## Installer sur iPhone
1. Ouvrir l'adresse ci-dessus dans **Safari**.
2. Toucher **Partager**, puis **Sur l'écran d'accueil**.
3. L'application s'ouvre ensuite en plein écran, comme une application classique.

## Version 0.4 : ce qui fonctionne
- **Base élargie** : 35 générations, 57 motorisations et 34 boîtes, dont Land Rover, Mini, Smart, Maserati, Audi, Mercedes, Skoda, Dacia, Porsche, Volvo et quatre électriques. Sources datées pour les rappels et faits officiels.
- **Valeur de marché** : estimée par un modèle de décote, puis calculée à partir de vos propres annonces comparables dès qu'il y en a 3.
- **Calculateur d'import** (Belgique, Allemagne, Autriche → France) : transport, plaques, COC, contrôle technique, malus CO2 et masse avec décote, carte grise selon la région, TVA des véhicules quasi neufs.
- **Aide à l'achat** : prix de négociation argumenté, questions au vendeur, liste de visite à cocher.
- **Coût de possession** (énergie, entretien, assurance, décote), **suivi des baisses de prix**, **état de batterie** des électriques.
- **Serveur IA facultatif** (dossier `serveur`) pour comprendre les recherches en langage naturel.
- **Lecture de captures d'écran et de photos** : la reconnaissance de texte (Tesseract.js, en français et en allemand) s'exécute sur l'appareil ; l'image n'est envoyée à aucun serveur. Le module (quelques Mo) est téléchargé à la première utilisation.
- **Import d'annonce** : collez (ou glissez-déposez) le texte d'une annonce Leboncoin, La Centrale, AutoScout24 ou mobile.de. Prix, kilométrage, année, modèle, motorisation, boîte, vendeur, historique et contrôle technique sont reconnus (texte français ou allemand) et l'analyse se lance automatiquement.
- **Recherche en description libre** (mode C) : la phrase est transformée en critères (budget, carburant, cylindres, boîte, carrosserie, marque, fiabilité, puissance), avec des alternatives « auxquelles vous n'auriez pas pensé ».
- **Recherche par critères** (mode A) et **par marque et modèle** (mode B).
- **Fiches** génération, motorisation (expertise moteur) et boîte de vitesses : défauts connus avec gravité, récurrence, niveau de confiance et nature de l'information.
- **Analyse d'une annonce** : notes sur 100 (moteur, boîte, entretien, prix, kilométrage, état et historique, revente), note globale pondérée selon vos priorités, alertes indépendantes et niveau de confiance.
- **Comparateur** (jusqu'à 3 véhicules), **favoris**, thème sombre ou clair, fonctionnement hors ligne.

## Ce qui n'est pas encore connecté
- Annonces en direct (Leboncoin, La Centrale, AutoScout24, mobile.de…).
- IA conversationnelle (compréhension avancée et synthèse) : nécessite un serveur et une clé d'API.
- Rapports d'historique et cotes de marché automatiques.

La base de connaissances est une **première rédaction par IA, à vérifier**. Les prix affichés sont des **estimations**. Voir [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Structure
```
index.html             Page de l'application
css/app.css            Thème et mise en page
js/app.js              Écrans et navigation
js/notation.js         Moteur de notation déterministe et alertes
js/recherche.js        Interprétation des demandes et filtrage
js/stockage.js         Favoris et analyses (stockés sur l'appareil)
js/import.js           Lecture du texte d'une annonce copiée ou glissée
js/valeur.js           Estimation de la valeur de marché
js/couts.js            Calculateur d'import et coût de possession
js/achat.js            Visite, questions au vendeur, négociation
serveur/               Serveur IA facultatif (Cloudflare Worker)
js/data/moteurs.js     Base de connaissances : motorisations
js/data/boites.js      Base de connaissances : boîtes de vitesses
js/data/modeles.js     Base de connaissances : marques, modèles, générations
sw.js                  Fonctionnement hors ligne
```
