# Architecture d'Auto Intelligence

## Principe
Une architecture **gratuite au départ**, pilotable depuis un téléphone, et qui peut évoluer vers un service commercial sans tout réécrire.

| Brique | Version 0.1 (actuelle) | Cible |
|---|---|---|
| Interface | Application web installable (PWA), HTML/CSS/JS sans compilation, hébergée sur GitHub Pages | Idem, puis Next.js si besoin |
| Base de connaissances | Fichiers JavaScript structurés (`js/data`) | PostgreSQL (Supabase, offre gratuite) |
| Notation | Calculs déterministes côté navigateur (`js/notation.js`) | Même logique, exécutée aussi côté serveur |
| Recherche en langage naturel | Interprétation par mots-clés | Modèle d'IA via API, appelé par le serveur (clé jamais exposée) |
| Collecte d'annonces | Saisie manuelle d'une annonce | Connecteurs par source, tâches planifiées (GitHub Actions) |
| Favoris et analyses | Stockés sur l'appareil | Comptes utilisateurs (Supabase Auth) |

## Modules séparés
1. **Collecte des annonces** : un connecteur par source, uniquement lorsque ses conditions d'utilisation l'autorisent (API officielle, flux partenaire, ou saisie manuelle).
2. **Normalisation** : rattacher chaque annonce à marque → modèle → génération → motorisation → boîte.
3. **Base de connaissances** : défauts avec source, date, élément concerné, gravité, récurrence, confiance et nature (consensus, rappel, témoignages, statistique).
4. **Analyse des annonces** : cohérence (année, boîte, kilométrage), prix, historique.
5. **Notation** : notes indépendantes sur 100 et note globale pondérée, toujours avec explication.
6. **Détection d'opportunités** : note globale élevée, prix favorable et absence d'alerte de risque.
7. **Utilisateurs** : favoris, alertes, préférences de pondération.
8. **Interface**.

## Règles de notation
- **Fiabilité** : note de départ 95, puis retrait pour chaque défaut = points de gravité (5 / 12 / 25) × récurrence (1 / 0,7 / 0,4 / 0,15) × confiance (1 / 0,85 / 0,6). Les défauts hors de l'année du véhicule ne comptent pas.
- **Indice de connaissance** : en dessous de 80/100, la note est rapprochée d'une valeur neutre (70), pour qu'un moteur peu documenté ne soit présumé ni fiable ni fragile.
- **Prix** : calculé uniquement à partir d'une valeur de marché fournie. Jamais inventé.
- **Note globale** : moyenne pondérée sur les notes disponibles, avec un niveau de confiance (part des critères notés et indice de connaissance).
- **Alertes** : indépendantes du score (prix anormalement bas, historique incomplet, kilométrage incohérent, rappel constructeur, incohérence de l'annonce, risque mécanique).

## Limites d'accès aux données
- **Leboncoin, La Centrale** : la collecte automatique est interdite par leurs conditions d'utilisation.
- **AutoScout24, mobile.de** : des API existent, mais sont réservées aux professionnels.
- **HistoVec** : gratuit, mais le rapport doit être fourni par le vendeur.
- **IA** : l'appel à un modèle d'IA par API est payant (quelques euros par mois pour un usage personnel).

## Prochaines étapes proposées
1. Enrichir et sourcer la base de connaissances (plus de modèles, références datées pour chaque défaut).
2. Ajouter les marchés étrangers dans l'analyse : coût d'import, malus, carte grise.
3. Mettre en place Supabase et une première tâche planifiée.
4. Brancher l'IA côté serveur pour la recherche en langage naturel et les synthèses.
5. Connecter une première source d'annonces autorisée.
