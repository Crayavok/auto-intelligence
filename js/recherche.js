// Recherche : interprétation d'une demande en langage naturel (par mots-clés, sans IA externe)
// et filtrage des versions de la base de connaissances.

import { MODELES } from "./data/modeles.js";
import { toutesVersions } from "./notation.js";

export const MARQUES = [...new Set(MODELES.map((m) => m.marque))].sort();
export const CARROSSERIES = ["citadine", "compacte", "berline", "break", "coupé", "cabriolet", "suv"];

const ALIAS_MARQUES = { vw: "Volkswagen", volkswagen: "Volkswagen", mercedes: "Mercedes-Benz", "mercedes-benz": "Mercedes-Benz", merco: "Mercedes-Benz" };

const NOMBRE = "(\\d{1,3}(?:[\\s.\\u202f\\u00a0]\\d{3})+|\\d+(?:[.,]\\d+)?)";
const versNombre = (s) => parseFloat(String(s).replace(/[\s.  ]/g, "").replace(",", "."));

/** Transforme une phrase en critères structurés. Retourne aussi la liste de ce qui a été compris. */
export function interpreter(texte) {
  const t = ` ${texte.toLowerCase()} `;
  const f = { budget: null, kmMax: null, anneeMin: null, carburants: [], cylindres: [], boite: null, carrosseries: [], marques: [], fiabMin: null, puissanceMin: null, priorite: "pertinence" };
  const compris = [];

  // Kilométrage (avant le budget pour ne pas confondre « 100 000 km » et un prix)
  const km = t.match(new RegExp(NOMBRE + "\\s*(k\\s*)?km"));
  if (km) {
    f.kmMax = versNombre(km[1]) * (km[2] ? 1000 : 1);
    compris.push(`moins de ${f.kmMax.toLocaleString("fr-FR")} km`);
  }
  const tSansKm = km ? t.replace(km[0], " ") : t;

  const prix = tSansKm.match(new RegExp(NOMBRE + "\\s*(k\\s*€|k€|k(?![a-z])|€|euros?)"));
  if (prix) {
    const mult = /^k/.test(prix[2]) ? 1000 : 1;
    f.budget = Math.round(versNombre(prix[1]) * mult);
    compris.push(`budget ${f.budget.toLocaleString("fr-FR")} €`);
  }

  const annee = t.match(/(?:après|apres|à partir de|a partir de|depuis|postérieure? à|plus récente? que|minimum|mini)\s*((?:19|20)\d{2})/);
  if (annee) { f.anneeMin = +annee[1]; compris.push(`à partir de ${f.anneeMin}`); }

  if (/\bessence\b/.test(t)) f.carburants.push("essence");
  if (/\b(diesel|gazole|gasoil)\b/.test(t)) f.carburants.push("diesel");
  if (/\bhybride?s?\b/.test(t)) f.carburants.push("hybride");
  if (/(?<![a-zà-ÿ])([ée]lectriques?)(?![a-zà-ÿ])/.test(t)) f.carburants.push("électrique");
  if (f.carburants.length) compris.push(f.carburants.join(" ou "));

  const cyl = [
    [/\bv\s?12\b|12 cylindres/, 12], [/\bv\s?10\b|10 cylindres/, 10], [/\bv\s?8\b|8 cylindres|huit cylindres/, 8],
    [/\bv\s?6\b|6 cylindres|six cylindres/, 6], [/\b4 cylindres|quatre cylindres/, 4], [/\b3 cylindres|trois cylindres/, 3],
  ];
  for (const [re, n] of cyl) if (re.test(t)) f.cylindres.push(n);
  if (f.cylindres.length) compris.push(f.cylindres.map((n) => `${n} cylindres`).join(" ou "));

  if (/\b(automatique|auto|bva|dsg|edc)\b/.test(t)) { f.boite = "auto"; compris.push("boîte automatique"); }
  else if (/\b(manuelle|bvm)\b/.test(t)) { f.boite = "manuelle"; compris.push("boîte manuelle"); }

  const carro = [
    [/\bberlines?\b/, "berline"], [/\bbreaks?\b/, "break"], [/\b(suv|4x4)\b/, "suv"], [/\bcoup[ée]s?(?![a-zà-ÿ])/, "coupé"],
    [/\bcabrio(let)?s?(?![a-zà-ÿ])/, "cabriolet"], [/\bcitadines?\b/, "citadine"], [/\bcompactes?\b/, "compacte"],
  ];
  for (const [re, c] of carro) if (re.test(t)) f.carrosseries.push(c);
  if (f.carrosseries.length) compris.push(f.carrosseries.join(" ou "));

  for (const m of MARQUES) if (t.includes(m.toLowerCase())) f.marques.push(m);
  for (const [alias, m] of Object.entries(ALIAS_MARQUES)) if (new RegExp(`\\b${alias}\\b`).test(t) && !f.marques.includes(m)) f.marques.push(m);
  if (f.marques.length) compris.push(f.marques.join(", "));

  if (/fiab|robuste|increvable|solide|sans souci/.test(t)) { f.fiabMin = 75; f.priorite = "fiabilite"; compris.push("fiabilité prioritaire (≥ 75/100)"); }
  if (/performant|sporti|puissant|rapide|nerveu/.test(t)) { f.puissanceMin = 200; compris.push("performante (≥ 200 ch)"); }
  if (/économique|economique|sobre|pas cher à entretenir|entretien/.test(t) && f.priorite === "pertinence") { f.priorite = "entretien"; compris.push("coût d'entretien prioritaire"); }

  return { filtres: f, compris };
}

/** Raisons pour lesquelles une version ne respecte pas les filtres (vide = correspond). */
export function ecarts(v, f) {
  const r = [];
  const pmax = Math.max(...v.mot.puissances);
  if (f.budget && v.modele.prix[0] > f.budget) r.push("budget");
  if (f.anneeMin && v.mot.annees[1] < f.anneeMin) r.push("année");
  if (f.carburants?.length && !f.carburants.includes(v.moteur.carburant)) r.push("carburant");
  if (f.cylindres?.length && !f.cylindres.includes(v.moteur.cylindres)) r.push("cylindres");
  if (f.boite === "auto" && !v.boites.some((b) => b.boite.type !== "manuelle")) r.push("boîte");
  if (f.boite === "manuelle" && !v.boites.some((b) => b.boite.type === "manuelle")) r.push("boîte");
  if (f.carrosseries?.length && !v.modele.carrosseries.some((c) => f.carrosseries.includes(c))) r.push("carrosserie");
  if (f.marques?.length && !f.marques.includes(v.modele.marque)) r.push("marque");
  if (f.fiabMin && v.fiabMoteur.score < f.fiabMin) r.push("fiabilité");
  if (f.puissanceMin && pmax < f.puissanceMin) r.push("puissance");
  return r;
}

export const TRIS = {
  pertinence: { nom: "Pertinence", fn: (a, b) => b.pertinence - a.pertinence },
  fiabilite: { nom: "Fiabilité", fn: (a, b) => b.fiabMoteur.score - a.fiabMoteur.score || b.pertinence - a.pertinence },
  entretien: { nom: "Coût d'entretien", fn: (a, b) => b.entretien.score - a.entretien.score || b.pertinence - a.pertinence },
  prix: { nom: "Prix indicatif", fn: (a, b) => a.modele.prix[0] - b.modele.prix[0] },
  puissance: { nom: "Puissance", fn: (a, b) => Math.max(...b.mot.puissances) - Math.max(...a.mot.puissances) },
};

export function rechercher(f, tri = "pertinence") {
  const toutes = toutesVersions();
  const resultats = toutes.filter((v) => ecarts(v, f).length === 0).sort(TRIS[tri]?.fn ?? TRIS.pertinence.fn);

  // Mode découverte : alternatives qui ne respectent pas un ou deux critères « de goût »,
  // mais respectent le budget et restent très fiables.
  const cles = new Set(resultats.map((v) => v.cle));
  const souples = new Set(["carrosserie", "marque", "cylindres", "carburant", "boîte", "puissance"]);
  const alternatives = toutes
    .filter((v) => !cles.has(v.cle))
    .map((v) => ({ v, manque: ecarts(v, f) }))
    .filter(({ v, manque }) => manque.length > 0 && manque.length <= 2 && manque.every((m) => souples.has(m)) && v.fiabMoteur.score >= 80)
    .sort((a, b) => b.v.pertinence - a.v.pertinence)
    .slice(0, 4);

  return { resultats, alternatives };
}

/** Explication lisible d'une recommandation, construite à partir des données. */
export function pourquoi(v) {
  const p = [];
  const fm = v.fiabMoteur.score;
  const graves = v.moteur.defauts.filter((d) => d.gravite === 3 && ["confirmée", "fréquente"].includes(d.recurrence));
  if (graves.length) p.push(`Défaut majeur connu : ${graves[0].titre.toLowerCase()}`);
  else if (fm >= 85) p.push("Aucun défaut majeur récurrent connu sur ce moteur");
  if (v.meilleureBoite) p.push(`Meilleure boîte : ${v.meilleureBoite.boite.nom.split(",")[0]} (${v.meilleureBoite.note.score}/100)`);
  if (v.moteur.forces[0]) p.push(v.moteur.forces[0]);
  return p;
}
