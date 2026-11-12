# Serveur IA (facultatif)

Sans serveur, l'application interprète les recherches par mots-clés. Avec ce serveur, une vraie IA (Claude) comprend les demandes formulées librement.

## Coût
- Hébergement : offre gratuite de Cloudflare Workers.
- IA : facturée à l'usage par l'API Claude. Pour un usage personnel, de l'ordre de quelques euros par mois au maximum.

## Mise en place (faisable depuis un téléphone, dans Safari)
1. Créer un compte sur la console Claude (platform.claude.com), ajouter un moyen de paiement et créer une **clé d'API**.
2. Créer un compte gratuit sur **dash.cloudflare.com**, puis **Workers & Pages → Créer → Worker**. Le nommer `auto-intelligence-ia`.
3. Ouvrir l'éditeur du Worker, remplacer le code par le contenu de `worker.js`, puis **Déployer**.
4. Dans **Paramètres → Variables** du Worker :
   - ajouter le secret `ANTHROPIC_API_KEY` avec la clé d'API ;
   - ajouter la variable `ORIGINE_AUTORISEE` = `https://crayavok.github.io`.
5. Copier l'adresse du Worker (du type `https://auto-intelligence-ia.<compte>.workers.dev`).
6. Dans l'application : **Sources et connexions → Serveur IA**, coller cette adresse et enregistrer.

La clé d'API n'est jamais stockée dans l'application ni dans ce dépôt public.
