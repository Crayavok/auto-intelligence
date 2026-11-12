// Calculateur du coût réel d'un véhicule importé (Belgique, Allemagne, Autriche → France)
// et coût total de possession.
//
// Règles fiscales vérifiées en novembre 2026 sur service-public.gouv.fr (fiches F35947 et F35950) :
// - le malus CO2 d'un véhicule importé se calcule avec le barème de l'année de sa 1re immatriculation à l'étranger,
//   réduit d'une décote selon son âge en mois ; il est nul si cette 1re immatriculation est antérieure au 1er janvier 2015 ;
// - le malus masse s'applique aussi aux occasions importées, avec la même logique (barème de l'année, décote) ;
//   il n'existe que depuis 2022 ; les électriques en sont exonérés, les hybrides bénéficient d'un abattement.
// SIMPLIFICATION : l'application n'a que le barème CO2 2026, le plus sévère. Pour une voiture immatriculée avant 2026,
// le montant affiché est donc un MAJORANT ; le simulateur officiel donne le montant exact.

export const PAYS = {
  FR: { nom: "France", transport: 0, plaques: 0 },
  BE: { nom: "Belgique", transport: 450, plaques: 100 },
  DE: { nom: "Allemagne", transport: 900, plaques: 150 },
  AT: { nom: "Autriche", transport: 1300, plaques: 150 },
};

// Prix du cheval fiscal 2026 (taxe régionale), d'après guichetcartegrise.com, novembre 2026.
export const REGIONS = {
  "Auvergne-Rhône-Alpes": 43, "Bourgogne-Franche-Comté": 60, "Bretagne": 60, "Centre-Val de Loire": 60, "Corse": 53,
  "Grand Est": 60, "Hauts-de-France": 43, "Île-de-France": 68.95, "Normandie": 60, "Nouvelle-Aquitaine": 58,
  "Occitanie": 59.5, "Pays de la Loire": 51, "Provence-Alpes-Côte d'Azur": 60,
};
const TAXE_FIXE = 11, ACHEMINEMENT = 2.76;

// Barème malus CO2 2026 (WLTP), de 108 à 191 g/km ; 80 000 € au-delà. Source : simmalus.com, à recouper avec le barème officiel.
const MALUS_CO2_2026 = [50, 75, 100, 125, 150, 170, 190, 210, 230, 240, 260, 280, 310, 330, 360, 400, 450, 540, 580, 631, 690, 756, 983, 1074, 1172, 1276, 1386, 1504, 1629, 1761, 1901, 2049, 2205, 2370, 2544, 2726, 2918, 3119, 3331, 3552, 3784, 4026, 4279, 4636, 5013, 5410, 5827, 6267, 6512, 6761, 7012, 7266, 7462, 8032, 8626, 9246, 9891, 10562, 10852, 11145, 11440, 11738, 12012, 13052, 14147, 15300, 16512, 17786, 17786, 17786, 17786, 17786, 18188, 19701, 21149, 22504, 23441, 23441, 23441, 23441, 24370, 25490, 26247, 27358];

export function malusCO2Bareme2026(co2) {
  if (!co2 || co2 < 108) return 0;
  if (co2 >= 192) return 80000;
  return MALUS_CO2_2026[Math.round(co2) - 108];
}

// Décote des véhicules importés selon l'âge en mois (service-public.gouv.fr)
const DECOTE = [[3, 3], [6, 6], [9, 9], [12, 12], [18, 16], [24, 20], [36, 28], [48, 33], [60, 38], [72, 43], [84, 48], [96, 53], [108, 58], [120, 64], [132, 70], [144, 76], [156, 82], [168, 88], [180, 94]];
export function decoteImport(ageMois) {
  if (ageMois < 1) return 0;
  for (const [max, pct] of DECOTE) if (ageMois <= max) return pct / 100;
  return 1;
}

// Malus masse selon l'année de 1re immatriculation (masse en ordre de marche, en kg)
function malusMasse(masse, annee, carburant) {
  if (!masse || annee < 2022 || carburant === "électrique") return { montant: 0, note: annee < 2022 ? "malus masse inexistant avant 2022" : carburant === "électrique" ? "électrique : exonéré" : "masse non renseignée" };
  const abattement = carburant === "hybride" ? 100 : 0;
  const m = masse - abattement;
  if (annee <= 2023) return { montant: Math.max(0, m - 1800) * 10, note: "barème 2022-2023 : 10 €/kg au-delà de 1 800 kg" };
  const seuil = annee <= 2025 ? 1600 : 1500;
  const tranches = [[seuil, 1700, 10], [1700, 1800, 15], [1800, 1900, 20], [1900, 2000, 25], [2000, Infinity, 30]];
  let montant = 0;
  for (const [a, b, taux] of tranches) if (m > a) montant += (Math.min(m, b) - a) * taux;
  return { montant, note: `barème ${annee <= 2025 ? "2024-2025" : "2026"} : à partir de ${seuil} kg${abattement ? ", abattement hybride de 100 kg" : ""}` };
}

export function chevauxFiscaux(co2, kw) {
  if (!co2 || !kw) return null;
  return Math.max(1, Math.round(co2 / 45 + Math.pow(kw / 40, 1.6)));
}

/**
 * Coût réel d'un véhicule acheté à l'étranger une fois immatriculé en France.
 * p = { pays, prix, annee, mois, km, co2, masse, kw, cv, carburant, region, transport, plaques, coc, ct }
 */
export function coutImport(p) {
  const maintenant = new Date();
  const ageMois = (maintenant.getFullYear() - p.annee) * 12 + (maintenant.getMonth() + 1 - (p.mois || 6));
  const ageAns = ageMois / 12;
  const decote = decoteImport(ageMois);
  const lignes = [];
  const notes = [];

  lignes.push({ libelle: `Prix d'achat (${PAYS[p.pays].nom})`, montant: p.prix });

  // TVA : véhicule « neuf » au sens fiscal (moins de 6 mois ou moins de 6 000 km)
  if (ageMois <= 6 || p.km <= 6000) {
    lignes.push({ libelle: "TVA française (20 %)", montant: Math.round(p.prix * 0.2), estime: true });
    notes.push("Moins de 6 mois ou moins de 6 000 km : véhicule « neuf » au sens fiscal, la TVA est due en France. Le prix étranger doit alors être facturé hors taxes ; le montant affiché suppose un prix HT.");
  }

  lignes.push({ libelle: "Transport ou convoyage", montant: p.transport, estime: true });
  if (p.plaques) lignes.push({ libelle: "Plaques temporaires / export et assurance de transit", montant: p.plaques, estime: true });
  if (p.coc) lignes.push({ libelle: "Certificat de conformité (COC)", montant: p.coc, estime: true });
  if (p.ct) lignes.push({ libelle: "Contrôle technique français", montant: p.ct, estime: true });
  lignes.push({ libelle: "Quitus fiscal", montant: 0 });

  // Malus CO2
  let malusCO2 = 0;
  if (p.carburant === "électrique") notes.push("Électrique : pas de malus CO2.");
  else if (p.annee < 2015) notes.push("Première immatriculation avant 2015 : malus CO2 nul.");
  else if (!p.co2) notes.push("CO2 non renseigné : malus CO2 non calculé (valeur en g/km sur le certificat de conformité).");
  else {
    malusCO2 = Math.round(malusCO2Bareme2026(p.co2) * (1 - decote));
    notes.push(`Malus CO2 : barème 2026 avec décote de ${Math.round(decote * 100)} % (âge ${Math.max(0, ageMois)} mois). Le barème réel est celui de ${p.annee}, généralement plus favorable : montant MAJORANT, à vérifier sur le simulateur officiel.${p.annee < 2021 ? " Pour une immatriculation avant 2021, la valeur de CO2 peut être en norme NEDC : vérifier sur le certificat de conformité." : ""}`);
  }
  lignes.push({ libelle: "Malus CO2", montant: malusCO2, estime: true });

  // Malus masse
  const mm = malusMasse(p.masse, p.annee, p.carburant);
  const malusM = Math.round(mm.montant * (1 - decote));
  lignes.push({ libelle: "Malus masse", montant: malusM, estime: true });
  notes.push(`Malus masse : ${mm.note}${mm.montant ? `, décote de ${Math.round(decote * 100)} %` : ""}.`);

  // Carte grise
  const cv = p.cv || chevauxFiscaux(p.co2, p.kw);
  const tarif = REGIONS[p.region] ?? 60;
  let regionale = cv ? cv * tarif : null;
  if (regionale != null && ageAns > 10) { regionale /= 2; notes.push("Plus de 10 ans : taxe régionale divisée par deux."); }
  if (regionale == null) notes.push("Puissance fiscale inconnue : renseignez les CV fiscaux, ou le CO2 et la puissance.");
  if (p.carburant === "électrique") notes.push("Électrique : certaines régions réduisent la taxe régionale, à vérifier.");
  const carteGrise = Math.round((regionale ?? 0) + TAXE_FIXE + ACHEMINEMENT);
  lignes.push({ libelle: `Carte grise${cv ? ` (${cv} CV × ${tarif.toLocaleString("fr-FR")} €${ageAns > 10 ? " ÷ 2" : ""})` : ""}`, montant: carteGrise, estime: !p.cv });

  const total = lignes.reduce((s, l) => s + (l.montant || 0), 0);
  return { lignes, total, notes, cv, decote, ageMois };
}

// ─────────────────────────── Coût total de possession ───────────────────────────

export const PRIX_ENERGIE_DEFAUT = { essence: 1.75, diesel: 1.70, hybride: 1.75, électrique: 0.25 };
const ENTRETIEN_ANNUEL = { "faible": 450, "modéré": 750, "élevé": 1200, "très élevé": 2000 };
const DECOTE_ANNUELLE = { forte: 0.06, moyenne: 0.09, faible: 0.13 };

export function consoDefaut(moteur) {
  if (moteur.carburant === "électrique") return 16;
  if (moteur.carburant === "hybride") return 4.8;
  const c = moteur.cylindres;
  if (moteur.carburant === "diesel") return c >= 8 ? 10 : c >= 6 ? 7.5 : 5.5;
  return c >= 8 ? 13.5 : c >= 6 ? 10 : c === 3 ? 5.8 : 7;
}

/** Coût annuel estimé : énergie, entretien, assurance, perte de valeur. */
export function coutPossession({ moteur, modele, valeur, kmAn, conso, prixEnergie, assurance }) {
  const energie = Math.round((kmAn / 100) * conso * prixEnergie);
  const entretien = ENTRETIEN_ANNUEL[moteur.coutEntretien] ?? 750;
  const decote = Math.round((valeur || 0) * (DECOTE_ANNUELLE[modele.revente] ?? 0.09));
  const lignes = [
    { libelle: moteur.carburant === "électrique" ? "Électricité" : "Carburant", montant: energie },
    { libelle: "Entretien et réparations (moyenne estimée)", montant: entretien },
    { libelle: "Assurance", montant: assurance },
    { libelle: "Perte de valeur (décote estimée)", montant: decote },
  ];
  const total = lignes.reduce((s, l) => s + l.montant, 0);
  return { lignes, total, parKm: kmAn ? total / kmAn : 0, parMois: total / 12 };
}
