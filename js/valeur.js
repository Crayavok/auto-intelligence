// Estimation de la valeur de marché (France).
// 1) Si vous avez analysé au moins 3 annonces comparables, la valeur est tirée de leurs prix (médiane ajustée).
// 2) Sinon, un modèle de décote simple est appliqué à la fourchette indicative de la génération.
// Dans les deux cas, il s'agit d'une ESTIMATION affichée comme telle.

import { ANNEE_COURANTE } from "./notation.js";

const arrondi = (v) => Math.round(v / 100) * 100;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mediane = (l) => { const s = [...l].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/** Annonces enregistrées comparables : même génération et motorisation, ±2 ans, ±50 000 km, annonces françaises. */
export function comparables(analyses, { modeleId, moteurId, annee, km, idExclu }) {
  return analyses.filter((a) => {
    const s = a.saisie;
    return a.id !== idExclu && s.modeleId === modeleId && s.moteurId === moteurId
      && (s.pays ?? "FR") === "FR" && Math.abs(s.annee - annee) <= 2 && Math.abs(s.km - km) <= 50000 && s.prix > 0;
  });
}

export function estimerValeur({ modele, mot, moteur, annee, km }, analyses = [], idExclu = null) {
  const comp = comparables(analyses, { modeleId: modele.id, moteurId: moteur.id, annee, km, idExclu });
  if (comp.length >= 3) {
    // Ajustement de chaque prix : 7 % par année d'écart, 1,5 % par tranche de 10 000 km d'écart.
    const ajustes = comp.map((a) => a.saisie.prix * (1 + 0.07 * (annee - a.saisie.annee)) * (1 - 0.015 * ((km - a.saisie.km) / 10000)));
    return {
      valeur: arrondi(mediane(ajustes)), methode: "comparables", n: comp.length,
      confiance: comp.length >= 6 ? "moyenne" : "faible",
      explication: `Médiane de ${comp.length} annonces comparables que vous avez analysées (même génération et moteur, ±2 ans, ±50 000 km), ajustée de l'année et du kilométrage.`,
    };
  }

  const [pmin, pmax] = modele.prix;
  const [y0, y1] = modele.annees;
  const pos = clamp((annee - y0) / Math.max(1, Math.min(y1, ANNEE_COURANTE) - y0), 0, 1);
  const base = pmin + (pmax - pmin) * (0.1 + 0.8 * pos);

  // Position de la motorisation dans la gamme (les versions puissantes valent plus cher)
  const maxi = modele.motorisations.map((m) => Math.max(...m.puissances));
  const lo = Math.min(...maxi), hi = Math.max(...maxi);
  const fPuissance = hi > lo ? 0.9 + 0.2 * ((Math.max(...mot.puissances) - lo) / (hi - lo)) : 1;

  // Kilométrage par rapport à la moyenne attendue pour l'âge
  const age = Math.max(0.5, ANNEE_COURANTE - annee);
  const attendu = age * (moteur.carburant === "diesel" ? 20000 : 15000);
  const fKm = clamp(1 - (km / attendu - 1) * 0.12, 0.8, 1.15);

  const valeur = arrondi(base * fPuissance * fKm);
  return {
    valeur, methode: "modele", n: comp.length, confiance: "faible",
    explication: `Estimation par modèle de décote : fourchette indicative de la génération (${pmin.toLocaleString("fr-FR")}–${pmax.toLocaleString("fr-FR")} €), position de l'année, niveau de la motorisation dans la gamme et kilométrage. ${comp.length ? `${comp.length} annonce(s) comparable(s) seulement : il en faut 3 pour une cote basée sur vos annonces.` : "Analysez des annonces comparables pour l'affiner."}`,
  };
}
