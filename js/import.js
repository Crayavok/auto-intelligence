// Import d'annonce : extraction des informations à partir du texte copié (ou glissé) d'une annonce.
// Fonctionne en français et en allemand (Leboncoin, La Centrale, AutoScout24, mobile.de…).
// L'utilisateur copie lui-même l'annonce qu'il consulte : aucune collecte automatique des sites.

import { MODELES } from "./data/modeles.js";
import { moteurParId, boiteParId, ANNEE_COURANTE } from "./notation.js";

const NOMBRE = "(?<![\\d.,])(\\d{1,3}(?:[\\s.\\u202f\\u00a0']\\d{3})+|\\d+)";
const versNombre = (s) => parseInt(String(s).replace(/[^\d]/g, ""), 10);

// Comment reconnaître chaque modèle de la base dans un texte libre
const ALIAS = {
  "peugeot-308-2": /\b308\b/,
  "renault-clio-4": /\bclio\b/,
  "renault-megane-4": /\bm[ée]gane\b/,
  "vw-golf-7": /\bgolf\b/,
  "vw-golf-6": /\bgolf\b/,
  "toyota-yaris-3": /\byaris\b/,
  "toyota-corolla-12": /\bcorolla\b/,
  "bmw-serie3-f30": /\bs[ée]rie\s*3\b|\b3er\b|\b3[2-4]\d\s?[id]\b|\bf3[01]\b/,
  "mazda-3-bm": /\bmazda\s*3\b|\bmazda3\b/,
  "lexus-isf": /\bis[\s-]?f\b/,
  "lexus-ls-4": /\bls\s?460\b/,
  "mercedes-classe-e-w211": /\be\s?500\b|\bclasse\s*e\b|\be-klasse\b|\bw211\b/,
  "bmw-serie5-f10-550i": /\b550i\b|\bs[ée]rie\s*5\b|\b5er\b/,
  "audi-s5-b8": /\bs5\b/,
  "ford-mustang-6": /\bmustang\b/,
  "land-rover-rrs-2": /range\s*rover\s*sport|\brrs\b/,
  "land-rover-evoque-1": /\bevoque\b/,
  "mini-r56": /\bcooper\s*s\b|\bjcw\b|john cooper works|\br56\b/,
  "mini-f56": /\bcooper\b|\bf56\b/,
  "smart-fortwo-453": /\bfor\s?two\b|\bfor\s?four\b/,
  "smart-eq": /\beq\s*for\s?(two|four)\b|\bsmart\s*eq\b/,
  "maserati-ghibli-3": /\bghibli\b/,
  "audi-a3-8v": /\ba3\b/,
  "audi-a4-b9": /\ba4\b/,
  "mercedes-c-w205": /\bclasse\s*c\b|\bc-klasse\b|\bc\s?(180|200|220|250|300)\s?d?\b|\bw205\b/,
  "skoda-octavia-3": /\boctavia\b/,
  "dacia-duster-2": /\bduster\b/,
  "dacia-sandero-3": /\bsandero\b/,
  "porsche-911-997": /\b911\b|\b997\b|\bcarrera\b/,
  "porsche-macan-1": /\bmacan\b/,
  "volvo-xc60-2": /\bxc\s?60\b/,
  "renault-zoe": /\bzo[ée](?![a-z])/,
  "tesla-model-3": /\bmodel\s*3\b/,
  "nissan-leaf-2": /\bleaf\b/,
  "hyundai-kona-ev": /\bkona\b/,
};

// Marques reconnues, y compris celles qui ne sont pas encore dans la base
const MARQUES_CONNUES = [
  ["Abarth"], ["Alfa Romeo", /alfa\s*romeo/], ["Alpine"], ["Aston Martin", /aston\s*martin/], ["Audi"], ["Bentley"], ["BMW"],
  ["Chevrolet"], ["Citroën", /citro[eë]n/], ["Cupra"], ["Dacia"], ["Dodge"], ["DS", /\bds\s?[3-9]\b|\bds automobiles\b/],
  ["Ferrari"], ["Fiat"], ["Ford"], ["Honda"], ["Hyundai"], ["Jaguar"], ["Jeep"], ["Kia"], ["Lamborghini"], ["Lancia"],
  ["Land Rover", /land\s*rover|range\s*rover|defender|discovery/], ["Lexus"], ["Maserati"], ["Mazda"],
  ["Mercedes-Benz", /mercedes|\bamg\b/], ["Mini", /\bmini\b/], ["Mitsubishi"], ["Nissan"], ["Opel"], ["Peugeot"], ["Porsche"],
  ["Renault"], ["Seat"], ["Skoda", /[sš]koda/], ["Smart", /\bsmart\b/], ["Subaru"], ["Suzuki"], ["Tesla"], ["Toyota"],
  ["Volkswagen", /volkswagen|\bvw\b/], ["Volvo"],
];

function trouverMarque(t) {
  for (const [nom, re] of MARQUES_CONNUES) {
    const r = re ?? new RegExp(`\\b${nom.toLowerCase()}\\b`);
    if (r.test(t)) return nom;
  }
  return null;
}

function trouverAnnee(t) {
  const prioritaire = t.match(/(?:mise en circulation|1[èe]re (?:mise en circulation|immatriculation)|erstzulassung|\bez\b|ann[ée]e(?:[\s-]mod[èe]le)?|baujahr|mod[èe]le)\s*:?\s*(?:\d{1,2}\s*[\/.\-]\s*)?((?:19|20)\d{2})/);
  if (prioritaire) return +prioritaire[1];
  for (const m of t.matchAll(/(?<!\d|\d[.,]|\d\s)(?:\d{1,2}[\/.])?((?:19[5-9]|20[0-3])\d)(?!\d|[.,]\d|\s*(?:€|km|ch|cv|ps|kw|cm))/g)) {
    const a = +m[1];
    if (a >= 1950 && a <= ANNEE_COURANTE + 1) return a;
  }
  return null;
}

function trouverKm(t) {
  const m = t.match(new RegExp(NOMBRE + "\\s*km\\b(?!\\s*\\/\\s*h)"));
  return m ? versNombre(m[1]) : null;
}

function trouverPrix(t) {
  const candidats = [];
  const avant = new RegExp(NOMBRE + "\\s*(?:€|eur\\b|euros?\\b)(?!\\s*\\/?\\s*(?:mois|monat|mtl))", "g");
  const apres = new RegExp("(?:€|eur)\\s*" + NOMBRE + "(?:,-)?(?!\\s*\\/?\\s*(?:mois|monat|mtl))", "g");
  for (const re of [avant, apres]) for (const m of t.matchAll(re)) candidats.push({ v: versNombre(m[1]), i: m.index });
  const plausibles = candidats.filter((c) => c.v >= 500 && c.v <= 1000000);
  if (!plausibles.length) return null;
  const ancre = t.search(/\bprix\b|\bpreis\b|\bprice\b/);
  if (ancre >= 0) {
    const apresAncre = plausibles.filter((c) => c.i >= ancre).sort((a, b) => a.i - b.i);
    if (apresAncre.length) return apresAncre[0].v;
  }
  return plausibles.sort((a, b) => a.i - b.i)[0].v;
}

function trouverPuissance(t) {
  const ch = t.match(/(\d{2,3})\s*(?:ch|cv|ps|hp)\b/);
  if (ch) return +ch[1];
  const kw = t.match(/(\d{2,3})\s*kw\b/);
  return kw ? Math.round(+kw[1] * 1.36) : null;
}

const MOTS_AUTO = /automatique|\bbva\b|\beat\s?[68]\b|\bdsg\b|\bedc\b|tiptronic|steptronic|automatik|automatic|s[\s-]?tronic|\d?g[\s-]?tronic|e-?cvt|\bcvt\b|bo[îi]te auto/;
const MOTS_MANUELLE = /manuelle|\bbvm\d?\b|schaltgetriebe|\bmanual\b|handschaltung/;

function choisirBoite(t, mot) {
  const boites = mot.boites.map((id) => boiteParId[id]);
  const specifiques = [[/\beat\s?6\b/, "eat6"], [/\beat\s?8\b/, "eat8"], [/\bedc\b/, "renault_edc"], [/\bdsg\s?7\b|dq200/, "dq200"], [/\bdsg\s?6\b|dq250/, "dq250"], [/\bpdk\b/, "porsche_pdk"], [/tiptronic/, "porsche_tip"], [/9g[\s-]?tronic/, "mb_9g"], [/7g[\s-]?tronic/, "mb_7g"]];
  for (const [re, prefixe] of specifiques) {
    if (re.test(t)) {
      const b = boites.find((x) => x.id.startsWith(prefixe));
      if (b) return { boite: b, sur: true };
    }
  }
  if (MOTS_AUTO.test(t)) {
    const autos = boites.filter((b) => b.type !== "manuelle");
    if (autos.length) return { boite: autos[0], sur: autos.length === 1 };
  }
  if (MOTS_MANUELLE.test(t)) {
    const man = boites.find((b) => b.type === "manuelle");
    if (man) return { boite: man, sur: true };
  }
  return { boite: boites[0], sur: boites.length === 1 };
}

function choisirMoteur(t, modele, puissance, annee) {
  let meilleur = null;
  for (const mot of modele.motorisations) {
    const m = moteurParId[mot.moteur];
    let score = 0;
    if (annee) score += annee >= mot.annees[0] && annee <= mot.annees[1] ? 3 : -3;
    const familles = m.nom.match(/PureTech|BlueHDi|TCe|SCe|dCi|TSI|TDI|THP|Ingenium|Hybride|Skyactiv-[GD]|V8|V6|biturbo|compresseur/gi) ?? [];
    if (m.carburant === "électrique" && /[ée]lectri|elektro|\bev\b|kwh/.test(t)) score += 4;
    for (const f of familles) if (t.includes(f.toLowerCase())) score += 3;
    if (m.carburant === "hybride" && /hybrid/.test(t)) score += 3;
    if (m.cylindree) {
      const cyl = m.cylindree.toFixed(1);
      if (t.includes(cyl) || t.includes(cyl.replace(".", ","))) score += 2;
    }
    if (puissance && mot.puissances.some((p) => Math.abs(p - puissance) <= 3)) score += 3;
    if (m.carburant === "diesel" && /diesel|gazole/.test(t)) score += 1;
    if (m.carburant === "essence" && /essence|benzin/.test(t)) score += 1;
    if (m.carburant !== "diesel" && /diesel|gazole/.test(t)) score -= 2;
    if (m.carburant === "diesel" && /essence|benzin/.test(t)) score -= 2;
    if (m.code && t.includes(m.code.toLowerCase().split(" ")[0])) score += 2;
    if (!meilleur || score > meilleur.score) meilleur = { mot, score };
  }
  return meilleur;
}

/**
 * Analyse le texte d'une annonce.
 * Retourne les champs trouvés, ce qui a été reconnu (pour l'affichage) et ce qui reste à vérifier.
 */
export function extraireAnnonce(texteBrut) {
  const texte = String(texteBrut || "");
  const t = texte.toLowerCase().replace(/\s+/g, " ");
  const champs = {};
  const reconnus = [];
  const aVerifier = [];

  const lien = texte.match(/https?:\/\/[^\s"'<>]+/);
  if (lien) { champs.lien = lien[0]; reconnus.push(["Lien", new URL(lien[0]).hostname.replace(/^www\./, "")]); }

  const marque = trouverMarque(t);
  const annee = trouverAnnee(t);
  const km = trouverKm(t);
  const prix = trouverPrix(t);
  const puissance = trouverPuissance(t);

  if (annee) { champs.annee = annee; reconnus.push(["Année", String(annee)]); } else aVerifier.push("année");
  if (km != null) { champs.km = km; reconnus.push(["Kilométrage", `${km.toLocaleString("fr-FR")} km`]); } else aVerifier.push("kilométrage");
  if (prix) { champs.prix = prix; reconnus.push(["Prix", `${prix.toLocaleString("fr-FR")} €`]); } else aVerifier.push("prix");
  if (puissance) reconnus.push(["Puissance", `${puissance} ch`]);

  // Modèle de la base
  const candidats = MODELES.filter((m) => ALIAS[m.id]?.test(t) && (!marque || marque === m.marque));
  let modele = null;
  if (candidats.length) {
    const dansPlage = annee ? candidats.filter((m) => annee >= m.annees[0] && annee <= m.annees[1]) : [];
    modele = dansPlage[0] ?? candidats.sort((a, b) => (annee ? Math.abs(a.annees[0] - annee) - Math.abs(b.annees[0] - annee) : 0))[0];
  }

  let marqueHorsBase = null;
  if (modele) {
    champs.modeleId = modele.id;
    reconnus.push(["Modèle", `${modele.marque} ${modele.modele} ${modele.generation}`]);
    const choix = choisirMoteur(t, modele, puissance, annee);
    champs.moteurId = choix.mot.moteur;
    reconnus.push(["Motorisation", moteurParId[choix.mot.moteur].nom]);
    if (choix.score < 3 && modele.motorisations.length > 1) aVerifier.push("motorisation");
    const b = choisirBoite(t, choix.mot);
    champs.boiteId = b.boite.id;
    reconnus.push(["Boîte", b.boite.nom.split(",")[0].split("(")[0].trim()]);
    if (!b.sur) aVerifier.push("boîte");
  } else {
    aVerifier.push("modèle");
    if (marque && !MODELES.some((m) => m.marque === marque)) marqueHorsBase = marque;
  }

  // État et historique
  if (/professionnel|\bgarage\b|concession|\bpro\b|händler|haendler|autohaus|gewerblich/.test(t)) { champs.vendeur = "pro"; reconnus.push(["Vendeur", "professionnel"]); }
  else if (/particulier|\bprivat/.test(t)) { champs.vendeur = "particulier"; reconnus.push(["Vendeur", "particulier"]); }

  if (/historique complet|carnet d'entretien (?:complet|à jour|tamponné)|toutes les factures|scheckheft|serviceheft gepflegt/.test(t)) { champs.historique = "complet"; reconnus.push(["Historique", "complet (annoncé)"]); }
  else if (/carnet d'entretien|factures|entretien (?:suivi|régulier)|wartungsnachweis/.test(t)) { champs.historique = "partiel"; reconnus.push(["Historique", "partiel (annoncé)"]); }

  if (/\bct\b[^.]{0,20}(?:ok|vierge|sans d[ée]faut|valide|r[ée]cent)|contr[ôo]le technique[^.]{0,20}(?:ok|vierge|sans d[ée]faut|valide|r[ée]cent)|t[üu]v neu|hu neu/.test(t)) { champs.ct = "ok"; reconnus.push(["Contrôle technique", "favorable (annoncé)"]); }
  else if (/contre[\s-]visite|d[ée]fauts? (?:majeurs?|critiques?)/.test(t)) { champs.ct = "defauts"; reconnus.push(["Contrôle technique", "défauts signalés"]); }

  const proprio = t.match(/(\d)\s*(?:propri[ée]taires?|mains?\b|fahrzeughalter|vorbesitzer|halter)|(?:fahrzeughalter|vorbesitzer|propri[ée]taires?)\s*:?\s*(\d)/);
  if (/premi[èe]re main|1[èe]re main/.test(t)) { champs.proprietaires = 1; reconnus.push(["Propriétaires", "1 (première main)"]); }
  else if (proprio) { champs.proprietaires = +(proprio[1] || proprio[2]); reconnus.push(["Propriétaires", String(champs.proprietaires)]); }

  // Pays de l'annonce, CO2, masse, puissance en kW, état de batterie (utiles au calculateur d'import)
  const domaine = champs.lien ? new URL(champs.lien).hostname : "";
  if (/\.de$|mobile\.de/.test(domaine) || (/erstzulassung|kilometerstand|fahrzeughalter/.test(t) && !/\.at$|\.be$/.test(domaine))) champs.pays = "DE";
  if (/\.at$|willhaben/.test(domaine) || /österreich|oesterreich/.test(t)) champs.pays = "AT";
  if (/\.be$|2ememain|2dehands/.test(domaine) || /belgique|belgi[eë]/.test(t)) champs.pays = "BE";
  if (/leboncoin|lacentrale|\.fr$/.test(domaine)) champs.pays = "FR";
  if (champs.pays && champs.pays !== "FR") reconnus.push(["Pays", { DE: "Allemagne", AT: "Autriche", BE: "Belgique" }[champs.pays]]);

  const co2 = t.match(/co(?:2|₂)[^0-9]{0,40}?(\d{2,3})\s*g\s*\/\s*km/);
  if (co2) { champs.co2 = +co2[1]; reconnus.push(["CO2", `${champs.co2} g/km`]); }
  const masse = t.match(/(?:leergewicht|poids(?: à vide)?|masse(?: en ordre de marche)?|gewicht)\s*:?\s*(\d[\d.\s\u202f]{2,6})\s*kg/);
  if (masse) { champs.masse = versNombre(masse[1]); reconnus.push(["Masse", `${champs.masse.toLocaleString("fr-FR")} kg`]); }
  const kw = t.match(/(\d{2,3})\s*kw\b(?!h)/);
  if (kw) champs.kw = +kw[1];
  else if (puissance) champs.kw = Math.round(puissance / 1.36);
  const soh = t.match(/(?:soh|[ée]tat de (?:sant[ée] de )?la batterie|batteriezustand)\s*:?\s*(\d{2,3})\s*%/);
  if (soh) { champs.soh = +soh[1]; reconnus.push(["Batterie (SOH)", `${champs.soh} %`]); }

  return { champs, reconnus, aVerifier, marque, marqueHorsBase };
}
