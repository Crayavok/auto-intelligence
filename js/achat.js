// Aide à l'achat : préparation de la visite, questions au vendeur et prix de négociation.
// Tout est construit à partir de la base de connaissances et des résultats de l'analyse.

import { defautConcerne, ANNEE_COURANTE } from "./notation.js";

const unique = (l) => [...new Set(l)];

export function aideAchat(r, saisie, valeurRef) {
  const { moteur, boite, modele } = r;
  const ve = moteur.carburant === "électrique";
  const age = ANNEE_COURANTE - saisie.annee;
  const defauts = [...moteur.defauts.map((d) => ({ ...d, sur: "moteur" })), ...(boite?.defauts ?? []).map((d) => ({ ...d, sur: "boîte" }))]
    .filter((d) => defautConcerne(d, saisie.annee));

  // ── Visite
  const documents = [
    "Carte grise au nom du vendeur, et numéro de série (VIN) identique sur la voiture",
    "Carnet d'entretien et factures",
    age > 4 ? "Contrôle technique de moins de 6 mois (obligatoire pour la vente)" : "Contrôle technique (si plus de 4 ans)",
    "Rapport HistoVec (gratuit, à demander au vendeur)",
  ];
  if (saisie.pays && saisie.pays !== "FR") documents.push("Certificat de conformité (COC) et facture d'achat, pour l'immatriculation en France");
  const essai = ve
    ? ["Certificat d'état de la batterie (SOH)", "Tester une recharge (prise domestique et borne rapide si prévue)", "Autonomie affichée cohérente avec la charge", "Bruits du réducteur et des trains roulants"]
    : ["Démarrage moteur froid (posez la main sur le capot avant l'essai)", "Fumée à l'échappement au démarrage et à l'accélération", "Voyants au tableau de bord", "Essai sur route et voie rapide, freinage, tenue de cap", "Passages de vitesses à froid et à chaud"];
  const specifique = unique([
    ...defauts.filter((d) => d.gravite >= 2).map((d) => `${d.titre} (${d.sur})`),
    ...moteur.entretien,
    ...(boite?.entretien ?? []),
    ...(modele.pointsAchat ?? []),
  ]);
  const visite = [
    { titre: "Documents", items: documents },
    { titre: "Essai", items: essai },
    { titre: `Points propres à ce véhicule`, items: specifique },
    { titre: "Carrosserie et intérieur", items: ["Écarts de carrosserie et différences de teinte (signes de choc)", "Usure des pneus régulière et identique par essieu", "Usure du volant, du pommeau et du siège cohérente avec le kilométrage", "Climatisation et équipements électriques"] },
  ];

  // ── Questions au vendeur
  const questions = [
    "Pourquoi vendez-vous la voiture ?",
    "Depuis quand l'avez-vous, et avez-vous toutes les factures d'entretien ?",
    "La voiture a-t-elle déjà été accidentée ou repeinte ?",
    "Quels travaux sont à prévoir prochainement ?",
    ...defauts.filter((d) => d.gravite >= 2 || d.nature === "rappel").map((d) =>
      d.question ?? (d.nature === "rappel" ? `Le rappel « ${d.titre} » a-t-il été effectué ? Avez-vous le justificatif ?` : `Avez-vous constaté ou fait réparer : ${d.titre.toLowerCase()} ? Avez-vous la facture ?`)),
  ];
  if (ve) questions.push("Pouvez-vous fournir un certificat d'état de santé de la batterie (SOH) ?");

  // ── Négociation
  const risques = r.alertes.filter((a) => a.niveau === "risque").length;
  const vigilances = r.alertes.filter((a) => a.niveau === "vigilance").length;
  let remise = 0.04 + 0.03 * vigilances + 0.05 * risques + (saisie.historique === "inconnu" ? 0.03 : 0);
  remise = Math.min(remise, 0.15);
  const reference = valeurRef ? Math.min(saisie.prix, valeurRef) : saisie.prix;
  const arrondi = (v) => Math.round(v / 50) * 50;
  const negociation = {
    reference, remise,
    cible: arrondi(reference * (1 - remise)),
    ouverture: arrondi(reference * (1 - remise - 0.04)),
    plafond: arrondi(Math.min(saisie.prix, valeurRef ? valeurRef * 1.03 : saisie.prix)),
    arguments: unique([
      ...(valeurRef && saisie.prix > valeurRef ? [`Prix supérieur à la valeur estimée (${valeurRef.toLocaleString("fr-FR")} €)`] : []),
      ...r.alertes.filter((a) => a.niveau !== "info").map((a) => a.titre),
      ...defauts.filter((d) => d.gravite >= 2).map((d) => `Risque connu : ${d.titre.toLowerCase()}`),
      ...(saisie.ct === "defauts" ? ["Défauts au contrôle technique à chiffrer"] : []),
    ]),
  };
  return { visite, questions: unique(questions), negociation };
}
