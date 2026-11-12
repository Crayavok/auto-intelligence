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

/**
 * Impact du malus CO2 pour un véhicule importé : montant, explication et évolution selon la date d'immatriculation.
 * p = { annee, mois, co2, carburant, malusOfficiel }
 */
export function impactMalusCO2(p) {
  const maintenant = new Date();
  const ageMois = Math.max(0, (maintenant.getFullYear() - p.annee) * 12 + (maintenant.getMonth() + 1 - (p.mois || 6)));
  const base = { ageMois, seuil: 108, plafondCO2: 192, co2: p.co2 || null, anneeBareme: p.annee };
  if (p.carburant === "électrique") return { ...base, statut: "exonere", montant: 0, raison: "Les voitures 100 % électriques ne paient pas de malus CO2." };
  if (p.annee < 2015) return { ...base, statut: "exonere", montant: 0, raison: "Première immatriculation avant le 1er janvier 2015 : malus CO2 nul pour un véhicule importé." };
  if (ageMois > 180) return { ...base, statut: "exonere", montant: 0, raison: "Plus de 15 ans (181 mois) : décote de 100 %, aucun malus." };
  if (p.malusOfficiel != null && p.malusOfficiel >= 0 && p.malusOfficiel !== "") {
    return { ...base, statut: "officiel", montant: p.malusOfficiel, raison: "Montant que vous avez relevé sur le simulateur officiel." };
  }
  if (!p.co2) return { ...base, statut: "inconnu", montant: null, raison: "Renseignez le CO2 (g/km) figurant sur l'annonce ou le certificat de conformité." };

  const bareme = malusCO2Bareme2026(p.co2);
  const decote = decoteImport(ageMois);
  const montant = Math.round(bareme * (1 - decote));

  // Évolution : prochains paliers de décote si l'immatriculation en France a lieu plus tard
  const prochains = [];
  for (const [max, pct] of DECOTE) {
    if (max + 1 <= ageMois) continue;
    const dans = max + 1 - ageMois;
    if (dans <= 0 || prochains.length >= 3) continue;
    const date = new Date(maintenant.getFullYear(), maintenant.getMonth() + dans, 1);
    const d = decoteImport(max + 1);
    prochains.push({ dans, date, decote: d, montant: Math.round(bareme * (1 - d)) });
  }
  // Courbe du malus (après décote) selon le CO2, pour situer le véhicule
  const courbe = [];
  for (let c = 100; c <= 200; c += 5) courbe.push({ co2: c, montant: Math.round(malusCO2Bareme2026(c) * (1 - decote)) });

  return {
    ...base, statut: p.annee >= 2026 ? "exact" : "majorant", montant, bareme, decote, prochains, courbe,
    ecartSeuil: p.co2 - 108,
    nedc: p.annee < 2021,
    raison: p.annee >= 2026
      ? "Barème 2026, celui de l'année de première immatriculation."
      : `Calculé avec le barème 2026, le plus sévère. Le barème réellement appliqué est celui de ${p.annee}, aux seuils plus élevés : le montant réel est en principe inférieur.`,
  };
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
  const impact = impactMalusCO2(p);
  const malusCO2 = impact.montant ?? 0;
  notes.push(`Malus CO2 : ${impact.raison}`);
  lignes.push({ libelle: `Malus CO2${impact.statut === "majorant" ? " (maximum)" : impact.statut === "officiel" ? " (officiel)" : ""}`, montant: malusCO2, estime: impact.statut !== "officiel" && impact.statut !== "exonere" });

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
  return { lignes, total, notes, cv, decote, ageMois, impact };
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
