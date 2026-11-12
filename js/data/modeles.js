// Base de connaissances : marques → modèles → générations → motorisations → boîtes.
// Rédaction initiale par l'IA (novembre 2026). Les fourchettes de prix sont des ESTIMATIONS APPROXIMATIVES
// du marché de l'occasion en France, non vérifiées, en attendant la connexion de sources de cotes réelles.
//
// revente    : "forte" | "moyenne" | "faible" (estimation de la tenue de valeur)
// collection : 0-100 ou null (intérêt collection, seulement lorsque pertinent)

import { MODELES_EXT } from "./modeles-ext.js";

export const MODELES = [
  {
    id: "peugeot-308-2", marque: "Peugeot", modele: "308", generation: "II (T9)", annees: [2013, 2021],
    carrosseries: ["compacte", "break"], prix: [6000, 17000], revente: "moyenne", collection: null,
    forces: ["Tenue de route et confort", "Qualité perçue en progrès", "Large choix de motorisations"],
    faiblesses: ["Écran tactile lent, commandes regroupées", "Volant i-Cockpit qui ne convient pas à tous", "Courroie humide du 1.2 PureTech"],
    motorisations: [
      { moteur: "puretech12", puissances: [110, 130], annees: [2014, 2021], boites: ["psa_bvm6", "eat6", "eat8"] },
      { moteur: "bluehdi16", puissances: [100, 120], annees: [2014, 2018], boites: ["psa_bvm6", "eat6"] },
      { moteur: "bluehdi15", puissances: [100, 130], annees: [2017, 2021], boites: ["psa_bvm6", "eat8"] },
      { moteur: "bluehdi20", puissances: [150, 180], annees: [2014, 2021], boites: ["psa_bvm6", "eat6", "eat8"] },
    ],
  },
  {
    id: "renault-clio-4", marque: "Renault", modele: "Clio", generation: "IV", annees: [2012, 2019],
    carrosseries: ["citadine", "break"], prix: [4500, 11000], revente: "moyenne", collection: null,
    forces: ["Design et habitabilité", "Diesel 1.5 dCi très sobre", "Pièces peu chères"],
    faiblesses: ["Finition et plastiques", "1.2 TCe 120 à surveiller", "Boîte EDC à sec délicate"],
    motorisations: [
      { moteur: "tce09", puissances: [90], annees: [2012, 2019], boites: ["renault_bvm"] },
      { moteur: "tce12h5ft", puissances: [120], annees: [2013, 2016], boites: ["renault_edc6"] },
      { moteur: "dci15", puissances: [75, 90, 110], annees: [2012, 2019], boites: ["renault_bvm", "renault_edc6"] },
    ],
  },
  {
    id: "renault-megane-4", marque: "Renault", modele: "Mégane", generation: "IV", annees: [2016, 2023],
    carrosseries: ["compacte", "break", "berline"], prix: [9000, 20000], revente: "moyenne", collection: null,
    forces: ["Confort", "Équipement riche", "Tenue de route"],
    faiblesses: ["Système multimédia R-Link parfois lent", "Boîtes EDC à tester avec soin"],
    motorisations: [
      { moteur: "tce13", puissances: [115, 140, 160], annees: [2018, 2023], boites: ["renault_bvm", "renault_edc7"] },
      { moteur: "dci15", puissances: [110, 115], annees: [2016, 2023], boites: ["renault_bvm", "renault_edc6"] },
    ],
  },
  {
    id: "vw-golf-7", marque: "Volkswagen", modele: "Golf", generation: "7", annees: [2012, 2020],
    carrosseries: ["compacte", "break"], prix: [8000, 25000], revente: "forte", collection: null,
    forces: ["Qualité de fabrication", "Valeur de revente", "Polyvalence"],
    faiblesses: ["Boîte DSG7 DQ200 associée aux petits moteurs", "Prix d'achat plus élevé que la concurrence"],
    motorisations: [
      { moteur: "ea211_10tsi", puissances: [110, 115], annees: [2015, 2020], boites: ["vw_bvm", "dq200"] },
      { moteur: "ea211_14tsi", puissances: [122, 125, 140, 150], annees: [2012, 2018], boites: ["vw_bvm", "dq200"] },
      { moteur: "ea288_20tdi", puissances: [150, 184], annees: [2012, 2020], boites: ["vw_bvm", "dq250"] },
      { moteur: "ea888g3_20tsi", puissances: [220, 230, 245], annees: [2013, 2020], boites: ["vw_bvm", "dq250"] },
    ],
  },
  {
    id: "vw-golf-6", marque: "Volkswagen", modele: "Golf", generation: "6", annees: [2008, 2012],
    carrosseries: ["compacte", "break", "cabriolet"], prix: [4000, 10000], revente: "moyenne", collection: null,
    forces: ["Qualité de fabrication", "Comportement sain"],
    faiblesses: ["1.4 TSI EA111 (chaîne)", "2.0 TDI concerné par le Dieselgate", "DSG7 DQ200"],
    motorisations: [
      { moteur: "ea111_14tsi", puissances: [122, 160], annees: [2008, 2012], boites: ["vw_bvm", "dq200"] },
      { moteur: "ea189_20tdi", puissances: [110, 140, 170], annees: [2009, 2012], boites: ["vw_bvm", "dq250"] },
    ],
  },
  {
    id: "toyota-yaris-3", marque: "Toyota", modele: "Yaris", generation: "III Hybride", annees: [2012, 2020],
    carrosseries: ["citadine"], prix: [7000, 14000], revente: "forte", collection: null,
    forces: ["Fiabilité de référence", "Très sobre en ville", "Coût d'usage faible"],
    faiblesses: ["Performances modestes", "Bruit en accélération forte (e-CVT)"],
    motorisations: [
      { moteur: "toyota_1nzfxe", puissances: [100], annees: [2012, 2020], boites: ["toyota_ecvt"] },
    ],
  },
  {
    id: "toyota-corolla-12", marque: "Toyota", modele: "Corolla", generation: "E210", annees: [2019, 2026],
    carrosseries: ["compacte", "break", "berline"], prix: [15000, 28000], revente: "forte", collection: null,
    forces: ["Fiabilité", "Sobriété", "Version 2.0 hybride performante"],
    faiblesses: ["Coffre réduit sur la compacte", "Multimédia daté sur les premiers millésimes"],
    motorisations: [
      { moteur: "toyota_2zrfxe", puissances: [122, 140], annees: [2019, 2026], boites: ["toyota_ecvt"] },
      { moteur: "toyota_m20a", puissances: [184, 196], annees: [2019, 2026], boites: ["toyota_ecvt"] },
    ],
  },
  {
    id: "bmw-serie3-f30", marque: "BMW", modele: "Série 3", generation: "F30 / F31", annees: [2012, 2019],
    carrosseries: ["berline", "break"], prix: [9000, 30000], revente: "moyenne", collection: null,
    forces: ["Agrément de conduite", "Boîte ZF 8HP", "Large choix de moteurs"],
    faiblesses: ["Moteurs N47 et N20 à éviter sans historique", "Entretien coûteux"],
    motorisations: [
      { moteur: "bmw_n47", puissances: [184], annees: [2012, 2015], boites: ["bmw_bvm6", "zf8hp"] },
      { moteur: "bmw_b47", puissances: [190], annees: [2015, 2019], boites: ["bmw_bvm6", "zf8hp"] },
      { moteur: "bmw_n20", puissances: [184, 245], annees: [2012, 2016], boites: ["bmw_bvm6", "zf8hp"] },
      { moteur: "bmw_b48", puissances: [184, 252], annees: [2016, 2019], boites: ["bmw_bvm6", "zf8hp"] },
      { moteur: "bmw_n55", puissances: [306], annees: [2012, 2015], boites: ["bmw_bvm6", "zf8hp"] },
      { moteur: "bmw_b58", puissances: [326], annees: [2016, 2019], boites: ["bmw_bvm6", "zf8hp"] },
    ],
  },
  {
    id: "mazda-3-bm", marque: "Mazda", modele: "3", generation: "BM / BN", annees: [2013, 2019],
    carrosseries: ["compacte", "berline"], prix: [8000, 16000], revente: "moyenne", collection: null,
    forces: ["Fiabilité du 2.0 essence", "Agrément de conduite", "Finition soignée"],
    faiblesses: ["Diesel 2.2 délicat en usage urbain", "Places arrière justes"],
    motorisations: [
      { moteur: "mazda_skyg20", puissances: [120, 165], annees: [2013, 2019], boites: ["mazda_bvm6", "mazda_skyactiv_drive"] },
      { moteur: "mazda_skyd22", puissances: [150], annees: [2013, 2019], boites: ["mazda_bvm6", "mazda_skyactiv_drive"] },
    ],
  },
  {
    id: "lexus-isf", marque: "Lexus", modele: "IS F", generation: "XE20", annees: [2008, 2014],
    carrosseries: ["berline"], prix: [25000, 40000], revente: "forte", collection: 75,
    forces: ["V8 atmosphérique réputé indestructible", "Rareté", "Cote en hausse"],
    faiblesses: ["Consommation élevée", "Fiscalité (malus au poids et CO₂ à l'import)", "Rare, donc peu de choix"],
    motorisations: [
      { moteur: "lexus_2urgse", puissances: [423], annees: [2008, 2014], boites: ["aisin_aa80e"] },
    ],
  },
  {
    id: "lexus-ls-4", marque: "Lexus", modele: "LS 460", generation: "XF40", annees: [2006, 2017],
    carrosseries: ["berline"], prix: [12000, 32000], revente: "faible", collection: 40,
    forces: ["Fiabilité et longévité", "Confort de très haut niveau", "Forte décote : beaucoup de voiture pour le prix"],
    faiblesses: ["Consommation élevée", "Suspension pneumatique coûteuse à réparer (selon version)"],
    motorisations: [
      { moteur: "lexus_1urfse", puissances: [380, 385], annees: [2006, 2017], boites: ["aisin_aa80e"] },
    ],
  },
  {
    id: "mercedes-classe-e-w211", marque: "Mercedes-Benz", modele: "Classe E (E500)", generation: "W211 phase 2", annees: [2006, 2009],
    carrosseries: ["berline", "break"], prix: [8000, 18000], revente: "faible", collection: 30,
    forces: ["V8 coupleux", "Confort", "Prix d'achat bas"],
    faiblesses: ["Électronique de l'époque", "Entretien coûteux", "Corrosion à surveiller"],
    motorisations: [
      { moteur: "mb_m273", puissances: [388], annees: [2006, 2009], boites: ["mb_7gtronic"] },
    ],
  },
  {
    id: "bmw-serie5-f10-550i", marque: "BMW", modele: "Série 5 (550i)", generation: "F10", annees: [2010, 2016],
    carrosseries: ["berline"], prix: [15000, 28000], revente: "faible", collection: null,
    forces: ["Performances", "Confort et équipement", "Décote très forte"],
    faiblesses: ["V8 N63 au lourd historique de fiabilité", "Coûts d'entretien très élevés"],
    motorisations: [
      { moteur: "bmw_n63", puissances: [407, 449], annees: [2010, 2016], boites: ["zf8hp"] },
    ],
  },
  {
    id: "audi-s5-b8", marque: "Audi", modele: "S5 Coupé", generation: "B8 (8T)", annees: [2007, 2011],
    carrosseries: ["coupé"], prix: [13000, 25000], revente: "moyenne", collection: 50,
    forces: ["V8 atmosphérique", "Transmission quattro", "Ligne"],
    faiblesses: ["Distribution côté boîte coûteuse", "Calamine (injection directe)", "Entretien élevé"],
    motorisations: [
      { moteur: "audi_42fsi", puissances: [354], annees: [2007, 2011], boites: ["audi_bvm6", "zf_6hp"] },
    ],
  },
  {
    id: "ford-mustang-6", marque: "Ford", modele: "Mustang", generation: "VI (S550)", annees: [2015, 2023],
    carrosseries: ["coupé", "cabriolet"], prix: [25000, 42000], revente: "moyenne", collection: 60,
    forces: ["V8 robuste", "Pièces abordables", "Commercialisée officiellement en Europe"],
    faiblesses: ["Consommation", "Malus et fiscalité en France", "Boîte manuelle MT82"],
    motorisations: [
      { moteur: "ford_coyote50", puissances: [421, 450], annees: [2015, 2023], boites: ["ford_mt82", "ford_6r80", "ford_10r80"] },
    ],
  },
  ...MODELES_EXT,
];
