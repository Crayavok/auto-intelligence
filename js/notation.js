// Moteur de notation : calculs DÉTERMINISTES et explicables.
// Aucune note n'est produite par une IA : chaque point retiré ou ajouté est justifié dans `details`.

import { MOTEURS } from "./data/moteurs.js";
import { BOITES } from "./data/boites.js";
import { MODELES } from "./data/modeles.js";

export const moteurParId = Object.fromEntries(MOTEURS.map((m) => [m.id, m]));
export const boiteParId = Object.fromEntries(BOITES.map((b) => [b.id, b]));
export const modeleParId = Object.fromEntries(MODELES.map((m) => [m.id, m]));

export const ANNEE_COURANTE = new Date().getFullYear();

const POINTS_GRAVITE = { 1: 5, 2: 12, 3: 25 };
const FACTEUR_RECURRENCE = { "confirmée": 1, "fréquente": 0.7, "occasionnelle": 0.4, "isolée": 0.15 };
const FACTEUR_CONFIANCE = { "élevée": 1, "moyenne": 0.85, "faible": 0.6 };
const NOTE_BASE = 95;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** Interprète un champ « annees » de défaut : "2013-2022", "2018+", "2001-2008 surtout". */
export function plageAnnees(texte) {
  if (!texte) return null;
  const m = String(texte).match(/(\d{4})\s*(?:-\s*(\d{4})|(\+))?/);
  if (!m) return null;
  const debut = +m[1];
  const fin = m[2] ? +m[2] : m[3] ? 9999 : debut;
  return [debut, fin];
}

export function defautConcerne(defaut, annee) {
  if (!annee) return true;
  const p = plageAnnees(defaut.annees);
  return !p || (annee >= p[0] && annee <= p[1]);
}

/**
 * Note de fiabilité d'un moteur ou d'une boîte, éventuellement pour une année donnée.
 * Base 95, puis retrait pour chaque défaut connu : gravité × récurrence × confiance.
 */
export function noteFiabilite(element, annee = null) {
  if (!element) return { score: null, details: [], insuffisant: true };
  const details = [{ label: "Note de départ", delta: NOTE_BASE, base: true }];
  let score = NOTE_BASE;
  for (const d of element.defauts) {
    if (d.horsFiabilite) {
      details.push({ label: `${d.titre} : point d'achat, sans effet sur la fiabilité`, delta: 0 });
      continue;
    }
    if (!defautConcerne(d, annee)) {
      details.push({ label: `${d.titre} : non concerné pour ${annee}`, delta: 0 });
      continue;
    }
    const retrait = Math.round(
      POINTS_GRAVITE[d.gravite] * FACTEUR_RECURRENCE[d.recurrence] * FACTEUR_CONFIANCE[d.confiance]
    );
    score -= retrait;
    details.push({ label: `${d.titre} (gravité ${d.gravite}/3, ${d.recurrence}, confiance ${d.confiance})`, delta: -retrait });
  }
  // Un élément peu documenté n'est pas présumé fiable : sa note est rapprochée d'une valeur neutre (70).
  const facteur = clamp(element.connaissance / 80, 0.4, 1);
  if (facteur < 1) {
    const ajuste = 70 + (score - 70) * facteur;
    details.push({ label: `Indice de connaissance ${element.connaissance}/100 : note rapprochée de la valeur neutre (70), faute de données suffisantes`, delta: Math.round(ajuste - score) });
    score = ajuste;
  }
  score = clamp(Math.round(score), 15, 95);
  return { score, details, insuffisant: element.connaissance < 50 };
}

const NOTE_COUT = { "faible": 85, "modéré": 65, "élevé": 45, "très élevé": 25 };

export function noteEntretien(moteur, boite) {
  if (!moteur) return { score: null, details: [] };
  const sm = NOTE_COUT[moteur.coutEntretien];
  const sb = boite ? NOTE_COUT[boite.coutEntretien] : null;
  const score = sb == null ? sm : Math.round(sm * 0.7 + sb * 0.3);
  const details = [{ label: `Coût d'entretien du moteur : ${moteur.coutEntretien}`, delta: sm, base: true }];
  if (sb != null) details.push({ label: `Coût d'entretien de la boîte : ${boite.coutEntretien} (pèse 30 %)`, delta: sb, base: true });
  return { score, details };
}

const NOTE_REVENTE = { forte: 80, moyenne: 60, faible: 40 };
export function noteRevente(modele) {
  return { score: NOTE_REVENTE[modele.revente] ?? null, details: [{ label: `Tenue de valeur estimée : ${modele.revente}`, delta: 0 }] };
}

/** Niveau de couleur d'une note : favorable / vigilance / risque. */
export function niveau(score) {
  if (score == null) return "inconnu";
  if (score >= 75) return "bon";
  if (score >= 50) return "moyen";
  return "mauvais";
}

/** Liste « à plat » de toutes les versions (génération × motorisation) avec leurs notes. */
export function toutesVersions() {
  const res = [];
  for (const modele of MODELES) {
    for (const mot of modele.motorisations) {
      const moteur = moteurParId[mot.moteur];
      const boites = mot.boites.map((id) => boiteParId[id]).filter(Boolean);
      const fiabMoteur = noteFiabilite(moteur);
      const notesBoites = boites.map((b) => ({ boite: b, note: noteFiabilite(b) }))
        .sort((a, b) => b.note.score - a.note.score);
      const meilleure = notesBoites[0];
      const entretien = noteEntretien(moteur, meilleure?.boite);
      res.push({
        cle: `${modele.id}|${moteur.id}`,
        modele, mot, moteur, boites: notesBoites,
        fiabMoteur, meilleureBoite: meilleure, entretien,
        revente: noteRevente(modele),
        pertinence: Math.round(fiabMoteur.score * 0.5 + (meilleure?.note.score ?? 60) * 0.25 + entretien.score * 0.25),
      });
    }
  }
  return res;
}

// ─────────────────────────── Analyse d'une annonce ───────────────────────────

export const PROFILS = {
  fiabilite: { nom: "Priorité fiabilité", poids: { moteur: 35, boite: 20, entretien: 15, prix: 20, kilometrage: 0, etat: 10, revente: 0, batterie: 15 } },
  equilibre: { nom: "Équilibré", poids: { moteur: 25, boite: 15, entretien: 10, prix: 20, kilometrage: 15, etat: 10, revente: 5, batterie: 15 } },
  affaire: { nom: "Bonne affaire", poids: { moteur: 15, boite: 10, entretien: 10, prix: 40, kilometrage: 10, etat: 10, revente: 5, batterie: 15 } },
};

export const LIBELLES_NOTES = {
  moteur: "Fiabilité moteur", boite: "Fiabilité boîte / transmission", entretien: "Coût d'entretien",
  prix: "Prix vs marché", kilometrage: "Kilométrage", etat: "État et historique", revente: "Potentiel de revente", batterie: "Batterie (électriques)",
};

function noteKilometrage(moteur, annee, km, alertes) {
  const age = Math.max(0.5, ANNEE_COURANTE - annee);
  const kmAn = Math.round(km / age);
  const attendu = moteur.carburant === "diesel" ? 20000 : 15000;
  const usure = km / moteur.kmReference;
  const details = [
    { label: `${km.toLocaleString("fr-FR")} km pour une durée de vie indicative de ${moteur.kmReference.toLocaleString("fr-FR")} km`, delta: Math.round(100 - usure * 75), base: true },
  ];
  let score = 100 - usure * 75;
  details.push({ label: `Soit environ ${kmAn.toLocaleString("fr-FR")} km/an (moyenne attendue : ${attendu.toLocaleString("fr-FR")} km/an)`, delta: 0 });

  if (age >= 4 && kmAn < attendu * 0.25) {
    score -= 5;
    details.push({ label: "Kilométrage très faible pour l'âge", delta: -5 });
    alertes.push({ niveau: "vigilance", titre: "Kilométrage incohérent ou très faible", texte: `Environ ${kmAn.toLocaleString("fr-FR")} km/an seulement : exiger les contrôles techniques et factures (ou un rapport HistoVec) pour exclure une manipulation du compteur.` });
  }
  if (kmAn > 40000) {
    score -= 5;
    details.push({ label: "Usage très intensif", delta: -5 });
    alertes.push({ niveau: "vigilance", titre: "Usage intensif", texte: `Environ ${kmAn.toLocaleString("fr-FR")} km/an : vérifier l'usure des trains roulants, de l'embrayage et de la boîte.` });
  }
  if (moteur.carburant === "diesel" && kmAn < 10000 && age >= 2) {
    score -= 5;
    details.push({ label: "Diesel peu roulé : risque d'encrassement FAP / EGR", delta: -5 });
  }
  return { score: clamp(Math.round(score), 5, 100), details };
}

function notePrix(modele, prix, valeur, alertes, estimation = null, importe = false) {
  const quoi = importe ? "Le coût total une fois en France" : "Le prix";
  if (!(valeur > 0) && estimation?.valeur) {
    const v = estimation.valeur;
    const ecart = (v - prix) / v;
    const score = clamp(Math.round(50 + ecart * 200), 0, 100);
    const pct = Math.round(Math.abs(ecart) * 100);
    if (ecart >= 0.3) {
      alertes.push({ niveau: "vigilance", titre: "Prix très inférieur à l'estimation", texte: `${quoi} est ${pct} % sous la valeur estimée (${v.toLocaleString("fr-FR")} €). L'estimation est approximative : confirmez avec une cote, puis méfiez-vous d'un prix trop beau.` });
    }
    return {
      score, ecart, insuffisant: true, estimation,
      details: [
        { label: `${quoi} (${Math.round(prix).toLocaleString("fr-FR")} €) est ${pct} % ${ecart >= 0 ? "sous" : "au-dessus de"} la valeur estimée de ${v.toLocaleString("fr-FR")} €`, delta: score, base: true },
        { label: estimation.explication, delta: 0 },
      ],
    };
  }
  if (valeur > 0) {
    const ecart = (valeur - prix) / valeur;
    const score = clamp(Math.round(50 + ecart * 200), 0, 100);
    const pct = Math.round(Math.abs(ecart) * 100);
    const sens = ecart >= 0 ? "sous" : "au-dessus de";
    if (ecart >= 0.3) {
      alertes.push({ niveau: "risque", titre: "Prix anormalement bas", texte: `${pct} % sous la valeur de marché indiquée : risque d'arnaque, de vice caché ou de véhicule accidenté. Ne jamais verser d'acompte sans avoir vu le véhicule.` });
    }
    return {
      score, ecart,
      details: [{ label: `${importe ? "Coût total en France : " : ""}${pct} % ${sens} la valeur de marché que vous avez indiquée (${valeur.toLocaleString("fr-FR")} €)`, delta: score, base: true }],
    };
  }
  const [min, max] = modele.prix;
  if (prix < min * 0.8) {
    alertes.push({ niveau: "vigilance", titre: "Prix très inférieur à la fourchette indicative", texte: `Fourchette indicative ${min.toLocaleString("fr-FR")}–${max.toLocaleString("fr-FR")} € (estimation non vérifiée). Renseignez une cote réelle pour confirmer.` });
  }
  return {
    score: null, ecart: null,
    details: [{ label: `Note non calculée : renseignez une cote (La Centrale, L'argus, mobile.de…) pour comparer. Fourchette indicative de la génération : ${min.toLocaleString("fr-FR")}–${max.toLocaleString("fr-FR")} € (estimation non vérifiée).`, delta: 0 }],
  };
}

function noteEtat(a, alertes) {
  const base = { complet: 80, partiel: 55, inconnu: 30 }[a.historique] ?? 30;
  const details = [{ label: `Historique d'entretien : ${a.historique}`, delta: base, base: true }];
  let score = base;
  if (a.historique !== "complet") {
    alertes.push({ niveau: a.historique === "inconnu" ? "risque" : "vigilance", titre: "Historique incomplet", texte: "L'absence d'information n'est pas une absence de problème : demander factures, carnet et rapport HistoVec au vendeur." });
  }
  if (a.proprietaires === 1) { score += 5; details.push({ label: "Première main", delta: 5 }); }
  if (a.proprietaires >= 4) { score -= 10; details.push({ label: `${a.proprietaires} propriétaires ou plus`, delta: -10 }); }
  if (a.ct === "ok") { score += 10; details.push({ label: "Contrôle technique favorable", delta: 10 }); }
  if (a.ct === "defauts") {
    score -= 15; details.push({ label: "Défauts signalés au contrôle technique", delta: -15 });
    alertes.push({ niveau: "vigilance", titre: "Défauts au contrôle technique", texte: "Chiffrer les réparations avant de négocier." });
  }
  if (a.ct === "inconnu" && ANNEE_COURANTE - a.annee > 4) {
    alertes.push({ niveau: "info", titre: "Contrôle technique à demander", texte: "En France, un contrôle technique de moins de 6 mois est obligatoire pour vendre un véhicule de plus de 4 ans." });
  }
  if (a.vendeur === "pro") { score += 5; details.push({ label: "Vendeur professionnel (garantie légale de conformité)", delta: 5 }); }
  return { score: clamp(score, 0, 100), details };
}

/**
 * Analyse complète d'une annonce saisie par l'utilisateur.
 * a = { modeleId, moteurId, boiteId, annee, km, prix, valeur, historique, proprietaires, ct, vendeur, lien }
 */
function noteBatterie(moteur, soh, alertes) {
  if (moteur.carburant !== "électrique") return { score: null, details: [{ label: "Sans objet (véhicule thermique ou hybride)", delta: 0 }], sansObjet: true };
  if (!soh) {
    alertes.push({ niveau: "vigilance", titre: "État de la batterie inconnu", texte: "Demandez un certificat d'état de santé de la batterie (SOH) : c'est l'élément le plus coûteux d'une voiture électrique." });
    return { score: null, details: [{ label: "SOH non renseigné : demandez un certificat batterie au vendeur", delta: 0 }] };
  }
  const score = clamp(Math.round(soh >= 95 ? 95 : soh >= 90 ? 85 + (soh - 90) * 2 : soh >= 80 ? 55 + (soh - 80) * 3 : soh >= 70 ? 25 + (soh - 70) * 3 : 15), 0, 100);
  if (soh < 70) alertes.push({ niveau: "risque", titre: "Batterie très usée", texte: `SOH de ${soh} % : autonomie fortement réduite, remplacement possible à moyen terme.` });
  else if (soh < 80) alertes.push({ niveau: "vigilance", titre: "Batterie usée", texte: `SOH de ${soh} % : vérifier si la garantie batterie (souvent 70 % sur 8 ans) s'applique encore.` });
  return { score, details: [{ label: `État de santé de la batterie : ${soh} %`, delta: score, base: true }] };
}

/**
 * contexte = { estimation: résultat de estimerValeur (facultatif), coutImport: résultat de coutImport (facultatif) }
 */
export function analyserAnnonce(a, poids, contexte = {}) {
  const modele = modeleParId[a.modeleId];
  const moteur = moteurParId[a.moteurId];
  const boite = boiteParId[a.boiteId];
  const mot = modele?.motorisations.find((m) => m.moteur === a.moteurId);
  const alertes = [];

  // Cohérence de l'annonce
  if (mot && (a.annee < mot.annees[0] || a.annee > mot.annees[1])) {
    alertes.push({ niveau: "vigilance", titre: "Incohérence dans l'annonce", texte: `Cette motorisation est connue pour ce modèle entre ${mot.annees[0]} et ${mot.annees[1]}, l'annonce indique ${a.annee}. Vérifier la carte grise.` });
  }
  if (mot && boite && !mot.boites.includes(boite.id)) {
    alertes.push({ niveau: "vigilance", titre: "Incohérence dans l'annonce", texte: "Cette boîte n'est pas répertoriée avec cette motorisation : vérifier la fiche technique." });
  }

  const notes = {};
  const fm = noteFiabilite(moteur, a.annee);
  notes.moteur = { ...fm, insuffisant: fm.insuffisant };
  notes.boite = noteFiabilite(boite, a.annee);
  notes.entretien = noteEntretien(moteur, boite);
  const prixCompare = contexte.coutImport ? contexte.coutImport.total : a.prix;
  notes.prix = notePrix(modele, prixCompare, a.valeur, alertes, contexte.estimation, !!contexte.coutImport);
  notes.kilometrage = noteKilometrage(moteur, a.annee, a.km, alertes);
  notes.etat = noteEtat(a, alertes);
  notes.revente = noteRevente(modele);
  notes.batterie = noteBatterie(moteur, a.soh, alertes);

  // Risques mécaniques et rappels applicables à l'année
  const risques = [];
  for (const [element, type] of [[moteur, "moteur"], [boite, "boîte"]]) {
    for (const d of element?.defauts ?? []) {
      if (!defautConcerne(d, a.annee)) continue;
      risques.push({ ...d, element: type });
      if (d.nature === "rappel") {
        alertes.push({ niveau: "vigilance", titre: "Rappel constructeur", texte: `${d.titre} : vérifier sur RappelConso ou auprès du réseau que l'intervention a été réalisée.` });
      } else if (d.gravite === 3 && (d.recurrence === "confirmée" || d.recurrence === "fréquente")) {
        alertes.push({ niveau: "risque", titre: "Risque mécanique identifié", texte: `${d.titre} (${type}).` });
      }
    }
  }

  // Note globale pondérée, renormalisée sur les notes disponibles
  let somme = 0, poidsUtilise = 0, poidsTotal = 0;
  for (const [cle, p] of Object.entries(poids)) {
    if (!p) continue;
    if (notes[cle]?.sansObjet) continue;
    poidsTotal += p;
    const s = notes[cle]?.score;
    if (s == null) continue;
    somme += s * p;
    poidsUtilise += p;
  }
  const couverture = poidsTotal ? poidsUtilise / poidsTotal : 0;
  const connaissance = Math.min(moteur?.connaissance ?? 0, boite?.connaissance ?? 0);
  let confiance = "faible";
  if (couverture >= 0.9 && connaissance >= 70 && !notes.prix.insuffisant) confiance = "élevée";
  else if (couverture >= 0.7 && connaissance >= 50) confiance = "moyenne";
  const globale = couverture >= 0.5 ? Math.round(somme / poidsUtilise) : null;

  const opportunite = globale != null && globale >= 75 && (notes.prix.score ?? 0) >= 70
    && !alertes.some((x) => x.niveau === "risque");

  return { modele, moteur, boite, mot, notes, alertes, risques, globale, confiance, couverture, connaissance, opportunite };
}
