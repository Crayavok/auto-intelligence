// Base de connaissances (extension v0.4) : marques et modèles supplémentaires, dont électriques.
// Rédaction initiale par l'IA (novembre 2026), à vérifier. Prix : ESTIMATIONS APPROXIMATIVES non vérifiées.
// pointsAchat : vérifications propres au modèle, reprises dans l'aide à l'achat.

export const MODELES_EXT = [
  {
    id: "land-rover-rrs-2", marque: "Land Rover", modele: "Range Rover Sport", generation: "II (L494)", annees: [2013, 2022],
    carrosseries: ["suv"], prix: [20000, 75000], revente: "moyenne", collection: null,
    forces: ["Confort et présentation", "Aptitudes tout-terrain", "Boîte ZF 8HP"],
    faiblesses: ["Fiabilité électronique moyenne", "Suspension pneumatique coûteuse", "Coûts d'entretien très élevés"],
    pointsAchat: ["Suspension pneumatique : vérifier que la voiture ne s'affaisse pas après une nuit", "Tester toute l'électronique (multimédia, caméras, sièges)"],
    motorisations: [
      { moteur: "lr_ingenium20d", puissances: [240], annees: [2016, 2022], boites: ["zf8hp"] },
      { moteur: "lr_tdv6_30", puissances: [249, 306], annees: [2013, 2020], boites: ["zf8hp"] },
      { moteur: "lr_v8sc50", puissances: [510, 575], annees: [2013, 2022], boites: ["zf8hp"] },
    ],
  },
  {
    id: "land-rover-evoque-1", marque: "Land Rover", modele: "Range Rover Evoque", generation: "I (L538)", annees: [2011, 2019],
    carrosseries: ["suv", "cabriolet"], prix: [10000, 26000], revente: "moyenne", collection: null,
    forces: ["Style", "Valeur de revente correcte"],
    faiblesses: ["Habitabilité arrière", "Boîte 9 rapports ZF perfectible", "Électronique"],
    pointsAchat: ["Tester toute l'électronique et le multimédia"],
    motorisations: [
      { moteur: "ford_22tdci", puissances: [150, 190], annees: [2011, 2015], boites: ["bvm_generique", "aisin_6at", "zf_9hp"] },
      { moteur: "lr_ingenium20d", puissances: [150, 180, 240], annees: [2015, 2019], boites: ["bvm_generique", "zf_9hp"] },
    ],
  },
  {
    id: "mini-r56", marque: "Mini", modele: "Cooper S", generation: "R56", annees: [2006, 2014],
    carrosseries: ["citadine"], prix: [4000, 11000], revente: "moyenne", collection: null,
    forces: ["Plaisir de conduite", "Style"],
    faiblesses: ["Moteur 1.6 THP fragile (chaîne, huile)", "Places arrière et coffre réduits"],
    motorisations: [
      { moteur: "mini_prince16t", puissances: [175, 184, 211], annees: [2006, 2014], boites: ["bvm_generique", "aisin_6at"] },
    ],
  },
  {
    id: "mini-f56", marque: "Mini", modele: "Cooper / Cooper S", generation: "F56", annees: [2014, 2024],
    carrosseries: ["citadine", "cabriolet"], prix: [11000, 26000], revente: "forte", collection: null,
    forces: ["Moteurs BMW nettement plus fiables que la génération précédente", "Finition", "Valeur de revente"],
    faiblesses: ["Prix d'achat élevé", "Coffre réduit"],
    motorisations: [
      { moteur: "bmw_b38", puissances: [136], annees: [2014, 2024], boites: ["bvm_generique", "aisin_6at", "mini_dct7"] },
      { moteur: "bmw_b48", puissances: [192, 231], annees: [2014, 2024], boites: ["bvm_generique", "aisin_6at", "mini_dct7"] },
    ],
  },
  {
    id: "smart-fortwo-453", marque: "Smart", modele: "ForTwo / ForFour", generation: "III (453)", annees: [2014, 2019],
    carrosseries: ["citadine"], prix: [5000, 11000], revente: "moyenne", collection: null,
    forces: ["Idéale en ville", "Base technique Renault Twingo 3"],
    faiblesses: ["Peu adaptée à la route", "Boîte Twinamic à tester"],
    motorisations: [
      { moteur: "renault_sce10", puissances: [61, 71], annees: [2014, 2019], boites: ["bvm_generique", "smart_twinamic"] },
      { moteur: "tce09", puissances: [90], annees: [2015, 2019], boites: ["bvm_generique", "smart_twinamic"] },
    ],
  },
  {
    id: "smart-eq", marque: "Smart", modele: "EQ fortwo / forfour", generation: "électrique (453)", annees: [2017, 2024],
    carrosseries: ["citadine"], prix: [7000, 16000], revente: "moyenne", collection: null,
    forces: ["Citadine électrique compacte", "Coût d'usage très faible"],
    faiblesses: ["Autonomie très limitée", "Recharge lente sur les premières versions"],
    pointsAchat: ["Vérifier la puissance du chargeur embarqué (recharge rapide ou non)"],
    motorisations: [
      { moteur: "smart_eq", puissances: [82], annees: [2017, 2024], boites: ["reducteur_ve"] },
    ],
  },
  {
    id: "maserati-ghibli-3", marque: "Maserati", modele: "Ghibli", generation: "III (M157)", annees: [2013, 2023],
    carrosseries: ["berline"], prix: [20000, 55000], revente: "faible", collection: null,
    forces: ["Prestige et sonorité", "Très forte décote : prix d'achat attractif"],
    faiblesses: ["Fiabilité peu documentée", "Entretien et pièces très chers", "Revente difficile"],
    pointsAchat: ["Faire inspecter par un spécialiste Maserati avant achat", "Tester l'électronique et le multimédia"],
    motorisations: [
      { moteur: "maserati_v6d", puissances: [250, 275], annees: [2013, 2021], boites: ["zf8hp"] },
      { moteur: "maserati_v6bt", puissances: [350, 410, 430], annees: [2013, 2023], boites: ["zf8hp"] },
    ],
  },
  {
    id: "audi-a3-8v", marque: "Audi", modele: "A3", generation: "8V", annees: [2012, 2020],
    carrosseries: ["compacte", "berline", "cabriolet"], prix: [9000, 24000], revente: "forte", collection: null,
    forces: ["Qualité de fabrication", "Valeur de revente"],
    faiblesses: ["Boîte S tronic DQ200 sur les petits moteurs"],
    motorisations: [
      { moteur: "ea211_14tsi", puissances: [122, 125, 150], annees: [2012, 2018], boites: ["vw_bvm", "dq200"] },
      { moteur: "vw_15tsi", puissances: [150], annees: [2017, 2020], boites: ["vw_bvm", "dq200"] },
      { moteur: "ea288_16tdi", puissances: [110, 116], annees: [2012, 2020], boites: ["vw_bvm", "dq200"] },
      { moteur: "ea288_20tdi", puissances: [150, 184], annees: [2012, 2020], boites: ["vw_bvm", "dq250"] },
    ],
  },
  {
    id: "audi-a4-b9", marque: "Audi", modele: "A4", generation: "B9", annees: [2015, 2023],
    carrosseries: ["berline", "break"], prix: [15000, 38000], revente: "forte", collection: null,
    forces: ["Confort et insonorisation", "Qualité de fabrication"],
    faiblesses: ["Options chères", "S tronic à double embrayage à tester"],
    motorisations: [
      { moteur: "ea288_20tdi", puissances: [150, 190], annees: [2015, 2023], boites: ["vw_bvm", "audi_dl382"] },
      { moteur: "ea888g3_20tsi", puissances: [190, 252], annees: [2015, 2023], boites: ["vw_bvm", "audi_dl382"] },
      { moteur: "audi_30tdi", puissances: [218, 272, 286], annees: [2015, 2023], boites: ["audi_dl382", "zf8hp"] },
    ],
  },
  {
    id: "mercedes-c-w205", marque: "Mercedes-Benz", modele: "Classe C", generation: "W205", annees: [2014, 2021],
    carrosseries: ["berline", "break", "coupé", "cabriolet"], prix: [14000, 35000], revente: "moyenne", collection: null,
    forces: ["Confort", "Présentation intérieure", "Diesel OM654 réputé"],
    faiblesses: ["Fiabilité électronique moyenne", "Entretien coûteux"],
    motorisations: [
      { moteur: "mb_om651", puissances: [170], annees: [2014, 2018], boites: ["bvm_generique", "mb_7gtronic", "mb_9gtronic"] },
      { moteur: "mb_om654", puissances: [160, 194], annees: [2018, 2021], boites: ["mb_9gtronic"] },
      { moteur: "mb_m274", puissances: [156, 184, 211], annees: [2014, 2018], boites: ["mb_7gtronic", "mb_9gtronic"] },
    ],
  },
  {
    id: "skoda-octavia-3", marque: "Skoda", modele: "Octavia", generation: "III", annees: [2013, 2020],
    carrosseries: ["berline", "break"], prix: [7000, 20000], revente: "moyenne", collection: null,
    forces: ["Habitabilité et coffre", "Rapport prix / prestations", "Mécaniques Volkswagen éprouvées"],
    faiblesses: ["Boîte DSG7 DQ200 sur les petits moteurs"],
    motorisations: [
      { moteur: "ea211_10tsi", puissances: [115], annees: [2017, 2020], boites: ["vw_bvm", "dq200"] },
      { moteur: "ea211_14tsi", puissances: [140, 150], annees: [2013, 2018], boites: ["vw_bvm", "dq200"] },
      { moteur: "vw_15tsi", puissances: [150], annees: [2018, 2020], boites: ["vw_bvm", "dq200"] },
      { moteur: "ea288_16tdi", puissances: [90, 105, 110, 115], annees: [2013, 2020], boites: ["vw_bvm", "dq200"] },
      { moteur: "ea288_20tdi", puissances: [150, 184], annees: [2013, 2020], boites: ["vw_bvm", "dq250"] },
      { moteur: "ea888g3_20tsi", puissances: [220, 230, 245], annees: [2013, 2020], boites: ["vw_bvm", "dq250"] },
    ],
  },
  {
    id: "dacia-duster-2", marque: "Dacia", modele: "Duster", generation: "II", annees: [2018, 2023],
    carrosseries: ["suv"], prix: [9000, 18000], revente: "forte", collection: null,
    forces: ["Prix", "Mécaniques Renault éprouvées", "Version 4x4"],
    faiblesses: ["Finition", "Équipement de sécurité basique"],
    motorisations: [
      { moteur: "renault_tce10", puissances: [100], annees: [2019, 2023], boites: ["bvm_generique"] },
      { moteur: "tce13", puissances: [130, 150], annees: [2019, 2023], boites: ["bvm_generique"] },
      { moteur: "dci15", puissances: [90, 110, 115], annees: [2018, 2023], boites: ["bvm_generique", "renault_edc6"] },
    ],
  },
  {
    id: "dacia-sandero-3", marque: "Dacia", modele: "Sandero", generation: "III", annees: [2021, 2026],
    carrosseries: ["citadine"], prix: [8000, 15000], revente: "forte", collection: null,
    forces: ["Prix", "Version GPL ECO-G économique", "Mécanique simple"],
    faiblesses: ["Finition", "Insonorisation"],
    motorisations: [
      { moteur: "renault_sce10", puissances: [65], annees: [2021, 2026], boites: ["bvm_generique"] },
      { moteur: "renault_tce10", puissances: [90, 100], annees: [2021, 2026], boites: ["bvm_generique", "jatco_cvt"] },
    ],
  },
  {
    id: "porsche-911-997", marque: "Porsche", modele: "911", generation: "997", annees: [2004, 2012],
    carrosseries: ["coupé", "cabriolet"], prix: [35000, 80000], revente: "forte", collection: 70,
    forces: ["Icône, valeur stable", "Plaisir de conduite"],
    faiblesses: ["997.1 : roulement IMS et rayures de cylindres", "Entretien très coûteux"],
    pointsAchat: ["Faire réaliser une inspection avant achat chez un spécialiste Porsche (endoscopie des cylindres)", "Lire les relevés de surrégime du calculateur"],
    motorisations: [
      { moteur: "porsche_m97", puissances: [325, 355], annees: [2004, 2008], boites: ["porsche_bvm6", "porsche_tip5"] },
      { moteur: "porsche_9a1", puissances: [345, 385], annees: [2009, 2012], boites: ["porsche_bvm6", "porsche_pdk7"] },
    ],
  },
  {
    id: "porsche-macan-1", marque: "Porsche", modele: "Macan", generation: "I (95B)", annees: [2014, 2024],
    carrosseries: ["suv"], prix: [28000, 65000], revente: "forte", collection: null,
    forces: ["Comportement de référence", "Valeur de revente"],
    faiblesses: ["Options très chères", "Entretien coûteux"],
    pointsAchat: ["Vérifier la liste des options (forte influence sur la valeur)"],
    motorisations: [
      { moteur: "ea888g3_20tsi", puissances: [237, 245, 252, 265], annees: [2016, 2024], boites: ["porsche_pdk7"] },
      { moteur: "porsche_v6bt_macan", puissances: [340, 354, 360, 380, 440], annees: [2014, 2024], boites: ["porsche_pdk7"] },
      { moteur: "audi_30tdi", puissances: [258], annees: [2014, 2018], boites: ["porsche_pdk7"] },
    ],
  },
  {
    id: "volvo-xc60-2", marque: "Volvo", modele: "XC60", generation: "II", annees: [2017, 2026],
    carrosseries: ["suv"], prix: [22000, 45000], revente: "forte", collection: null,
    forces: ["Sécurité", "Confort et présentation"],
    faiblesses: ["Multimédia perfectible", "Consommation des versions essence"],
    motorisations: [
      { moteur: "volvo_d4", puissances: [190, 197], annees: [2017, 2023], boites: ["aisin_awf8g45"] },
      { moteur: "volvo_t5", puissances: [250], annees: [2017, 2023], boites: ["aisin_awf8g45"] },
    ],
  },
  {
    id: "renault-zoe", marque: "Renault", modele: "Zoé", generation: "I et II", annees: [2013, 2024],
    carrosseries: ["citadine"], prix: [5000, 17000], revente: "moyenne", collection: null,
    forces: ["Électrique abordable", "Coût d'usage très faible"],
    faiblesses: ["Batterie souvent louée", "Recharge rapide absente ou lente selon versions"],
    pointsAchat: ["Batterie achetée ou louée ? Demander le contrat de location et son loyer"],
    motorisations: [
      { moteur: "renault_zoe_ve", puissances: [88, 92, 108, 135], annees: [2013, 2024], boites: ["reducteur_ve"] },
    ],
  },
  {
    id: "tesla-model-3", marque: "Tesla", modele: "Model 3", generation: "I", annees: [2019, 2026],
    carrosseries: ["berline"], prix: [18000, 40000], revente: "moyenne", collection: null,
    forces: ["Autonomie", "Réseau de recharge", "Performances"],
    faiblesses: ["Qualité d'assemblage des premières séries", "Commandes presque toutes sur l'écran"],
    motorisations: [
      { moteur: "tesla_m3_ve", puissances: [283, 325, 340, 460, 513], annees: [2019, 2026], boites: ["reducteur_ve"] },
    ],
  },
  {
    id: "nissan-leaf-2", marque: "Nissan", modele: "Leaf", generation: "II (ZE1)", annees: [2018, 2024],
    carrosseries: ["compacte"], prix: [9000, 20000], revente: "faible", collection: null,
    forces: ["Prix d'achat bas", "Fiabilité mécanique"],
    faiblesses: ["Batterie sans refroidissement liquide", "Prise de charge rapide CHAdeMO en voie de disparition"],
    motorisations: [
      { moteur: "nissan_leaf_ve", puissances: [150, 217], annees: [2018, 2024], boites: ["reducteur_ve"] },
    ],
  },
  {
    id: "hyundai-kona-ev", marque: "Hyundai", modele: "Kona Electric", generation: "I (OS)", annees: [2018, 2023],
    carrosseries: ["suv"], prix: [12000, 25000], revente: "moyenne", collection: null,
    forces: ["Autonomie (64 kWh)", "Efficience"],
    faiblesses: ["Rappel batterie à vérifier", "Habitabilité arrière"],
    motorisations: [
      { moteur: "hyundai_kona_ve", puissances: [136, 204], annees: [2018, 2023], boites: ["reducteur_ve"] },
    ],
  },
];
