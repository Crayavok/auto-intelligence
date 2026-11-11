// Base de connaissances : boîtes de vitesses et transmissions.
// Rédaction initiale par l'IA (novembre 2026) à partir de connaissances générales.
// Chaque défaut porte sa gravité, sa récurrence, son niveau de confiance et sa nature :
// ces informations sont À VÉRIFIER et à rattacher à des sources datées (voir docs/ARCHITECTURE.md).
//
// gravite    : 1 = mineur, 2 = important / coûteux, 3 = majeur (immobilisation, réparation lourde)
// recurrence : "confirmée" | "fréquente" | "occasionnelle" | "isolée"
// confiance  : "élevée" | "moyenne" | "faible"
// nature     : "consensus" (largement documenté) | "rappel" | "témoignages" | "statistique"

export const BOITES = [
  {
    id: "psa_bvm6", nom: "Boîte manuelle 5/6 rapports PSA", type: "manuelle", fabricant: "PSA",
    connaissance: 75, coutEntretien: "faible",
    forces: ["Conception simple et éprouvée", "Coût de réparation contenu"],
    defauts: [
      { titre: "Commande de boîte parfois imprécise", detail: "Câbles et rotules de commande à vérifier ; usure normale de l'embrayage.", gravite: 1, recurrence: "occasionnelle", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Contrôler le point de patinage de l'embrayage à l'essai"],
  },
  {
    id: "eat6", nom: "EAT6 (Aisin TF-70SC), automatique 6 rapports", type: "automatique à convertisseur", fabricant: "Aisin",
    connaissance: 80, coutEntretien: "modéré",
    forces: ["Boîte à convertisseur réputée robuste", "Agrément correct, pas d'à-coups de double embrayage"],
    defauts: [
      { titre: "Vieillissement de l'huile", detail: "Annoncée « à vie », la vidange est pourtant conseillée par les spécialistes vers 60 000 à 80 000 km.", gravite: 2, recurrence: "occasionnelle", confiance: "moyenne", nature: "consensus" },
    ],
    entretien: ["Vidange de boîte conseillée vers 60 000 à 80 000 km"],
  },
  {
    id: "eat8", nom: "EAT8 (Aisin AWF8F35), automatique 8 rapports", type: "automatique à convertisseur", fabricant: "Aisin",
    connaissance: 60, coutEntretien: "modéré",
    forces: ["Boîte à convertisseur moderne", "Bon agrément et consommation réduite"],
    defauts: [
      { titre: "À-coups et passages hésitants", detail: "Signalés sur certains exemplaires, souvent corrigés par mise à jour logicielle.", gravite: 1, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Vidange conseillée vers 60 000 à 80 000 km"],
  },
  {
    id: "renault_bvm", nom: "Boîte manuelle 5/6 rapports Renault", type: "manuelle", fabricant: "Renault",
    connaissance: 70, coutEntretien: "faible",
    forces: ["Pièces courantes et peu chères"],
    defauts: [
      { titre: "Roulements bruyants à kilométrage élevé", detail: "Bruit de roulement possible sur boîtes fatiguées, à écouter à l'essai.", gravite: 1, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Écouter les bruits de roulement à l'essai"],
  },
  {
    id: "renault_edc6", nom: "EDC 6 rapports (double embrayage à sec, Getrag 6DCT250)", type: "double embrayage", fabricant: "Getrag",
    connaissance: 70, coutEntretien: "élevé",
    forces: ["Consommation proche d'une boîte manuelle"],
    defauts: [
      { titre: "À-coups, patinage, embrayage usé prématurément", detail: "Double embrayage à sec sensible aux manœuvres lentes et à l'usage urbain ; remplacement d'embrayage coûteux.", gravite: 2, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages" },
      { titre: "Défaillance du calculateur / de la commande", detail: "Panne de mécatronique ou de calculateur rapportée.", gravite: 2, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Tester les démarrages en côte et les manœuvres", "Demander l'historique des mises à jour logicielles"],
  },
  {
    id: "renault_edc7", nom: "EDC 7 rapports (double embrayage humide, Getrag 7DCT300)", type: "double embrayage", fabricant: "Getrag",
    connaissance: 50, coutEntretien: "élevé",
    forces: ["Embrayages en bain d'huile, plus endurants qu'à sec"],
    defauts: [
      { titre: "Passages lents à froid, à-coups", detail: "Quelques retours d'hésitations, souvent logiciels.", gravite: 1, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Vidange selon préconisation constructeur"],
  },
  {
    id: "vw_bvm", nom: "Boîte manuelle 5/6 rapports VW (MQ200 / MQ250 / MQ350)", type: "manuelle", fabricant: "Volkswagen",
    connaissance: 75, coutEntretien: "faible",
    forces: ["Fiable et précise"],
    defauts: [
      { titre: "Volant moteur bimasse (diesels)", detail: "Usure classique sur diesels, vibrations au ralenti et claquements.", gravite: 2, recurrence: "occasionnelle", confiance: "moyenne", nature: "consensus" },
    ],
    entretien: ["Vérifier vibrations au ralenti (volant bimasse)"],
  },
  {
    id: "dq200", nom: "DSG7 DQ200 (double embrayage à sec, 7 rapports)", type: "double embrayage", fabricant: "Volkswagen",
    connaissance: 90, coutEntretien: "élevé",
    forces: ["Passages rapides", "Faible consommation"],
    defauts: [
      { titre: "Mécatronique défaillante", detail: "Défaut largement documenté (fissure de l'accumulateur de pression, perte de rapports, mode dégradé). Réparation coûteuse.", gravite: 3, recurrence: "fréquente", confiance: "élevée", nature: "consensus" },
      { titre: "Usure prématurée de l'embrayage, à-coups au démarrage", detail: "Sensible à l'usage urbain et aux bouchons.", gravite: 2, recurrence: "fréquente", confiance: "élevée", nature: "consensus" },
    ],
    entretien: ["Exiger l'historique des interventions sur la boîte", "Tester les démarrages lents et les marches arrière"],
  },
  {
    id: "dq250", nom: "DSG6 DQ250 (double embrayage humide, 6 rapports)", type: "double embrayage", fabricant: "Volkswagen",
    connaissance: 85, coutEntretien: "modéré",
    forces: ["Robuste et supportant le couple des diesels et moteurs sportifs"],
    defauts: [
      { titre: "Défaillances si vidanges négligées", detail: "La vidange tous les 60 000 km est impérative ; sans elle, mécatronique et embrayages souffrent.", gravite: 2, recurrence: "occasionnelle", confiance: "élevée", nature: "consensus" },
    ],
    entretien: ["Vidange impérative tous les 60 000 km (justificatifs à demander)"],
  },
  {
    id: "zf8hp", nom: "ZF 8HP, automatique 8 rapports", type: "automatique à convertisseur", fabricant: "ZF",
    connaissance: 90, coutEntretien: "modéré",
    forces: ["Référence de fiabilité et d'agrément", "Supporte de forts couples"],
    defauts: [
      { titre: "Fuite du carter / joint de connecteur", detail: "Suintements possibles à kilométrage élevé.", gravite: 1, recurrence: "occasionnelle", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Vidange conseillée entre 80 000 et 120 000 km malgré l'huile annoncée « à vie »"],
  },
  {
    id: "bmw_bvm6", nom: "Boîte manuelle 6 rapports BMW", type: "manuelle", fabricant: "ZF / Getrag",
    connaissance: 70, coutEntretien: "modéré",
    forces: ["Robuste"],
    defauts: [
      { titre: "Volant bimasse sur diesels", detail: "Usure à surveiller au-delà de 150 000 km.", gravite: 2, recurrence: "occasionnelle", confiance: "moyenne", nature: "consensus" },
    ],
    entretien: ["Vérifier les vibrations au ralenti"],
  },
  {
    id: "toyota_ecvt", nom: "e-CVT hybride Toyota (train épicycloïdal)", type: "transmission hybride", fabricant: "Toyota",
    connaissance: 90, coutEntretien: "faible",
    forces: ["Pas d'embrayage ni de courroie de variation", "Réputation de très grande fiabilité"],
    defauts: [],
    entretien: ["Contrôle de l'huile de transmission selon carnet"],
  },
  {
    id: "aisin_aa80e", nom: "Aisin AA80E, automatique 8 rapports (Lexus)", type: "automatique à convertisseur", fabricant: "Aisin",
    connaissance: 65, coutEntretien: "modéré",
    forces: ["Boîte robuste conçue pour de gros couples"],
    defauts: [
      { titre: "Passages un peu lents en mode normal", detail: "Point d'agrément plus que de fiabilité.", gravite: 1, recurrence: "occasionnelle", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Vidange conseillée vers 100 000 km"],
  },
  {
    id: "mb_7gtronic", nom: "7G-Tronic (722.9), automatique 7 rapports", type: "automatique à convertisseur", fabricant: "Mercedes-Benz",
    connaissance: 80, coutEntretien: "modéré",
    forces: ["Agrément de bon niveau"],
    defauts: [
      { titre: "Plaque conductrice / capteurs de vitesse", detail: "Défaillance du module électronique interne : passages brutaux, mode secours.", gravite: 2, recurrence: "fréquente", confiance: "moyenne", nature: "consensus" },
    ],
    entretien: ["Vidange conseillée tous les 60 000 à 80 000 km"],
  },
  {
    id: "zf_6hp", nom: "ZF 6HP (Tiptronic), automatique 6 rapports", type: "automatique à convertisseur", fabricant: "ZF",
    connaissance: 75, coutEntretien: "modéré",
    forces: ["Robuste si entretenue"],
    defauts: [
      { titre: "Mécatronique / usure si huile jamais changée", detail: "À kilométrage élevé, à-coups et glissements possibles.", gravite: 2, recurrence: "occasionnelle", confiance: "moyenne", nature: "consensus" },
    ],
    entretien: ["Vidange conseillée vers 80 000 km"],
  },
  {
    id: "audi_bvm6", nom: "Boîte manuelle 6 rapports Audi", type: "manuelle", fabricant: "Audi",
    connaissance: 60, coutEntretien: "modéré",
    forces: ["Robuste"],
    defauts: [],
    entretien: ["Contrôler embrayage et volant bimasse"],
  },
  {
    id: "ford_mt82", nom: "Getrag MT82, manuelle 6 rapports (Mustang)", type: "manuelle", fabricant: "Getrag",
    connaissance: 70, coutEntretien: "modéré",
    forces: ["Pièces disponibles"],
    defauts: [
      { titre: "Passages durs, synchros fragiles", detail: "Accrochages en 2e/3e signalés, surtout à froid ou en conduite sportive.", gravite: 2, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Tester tous les rapports à froid et à chaud"],
  },
  {
    id: "ford_6r80", nom: "6R80, automatique 6 rapports (Mustang 2015-2017)", type: "automatique à convertisseur", fabricant: "Ford (base ZF)",
    connaissance: 70, coutEntretien: "faible",
    forces: ["Réputée solide"],
    defauts: [],
    entretien: ["Vidange conseillée vers 80 000 km"],
  },
  {
    id: "ford_10r80", nom: "10R80, automatique 10 rapports (Mustang 2018+)", type: "automatique à convertisseur", fabricant: "Ford / GM",
    connaissance: 60, coutEntretien: "modéré",
    forces: ["Rapide et efficace"],
    defauts: [
      { titre: "Passages brusques ou hésitants", detail: "Fréquemment évoqué, amélioré par mises à jour logicielles.", gravite: 1, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Vérifier que les mises à jour logicielles ont été faites"],
  },
  {
    id: "mazda_bvm6", nom: "Boîte manuelle 6 rapports Mazda", type: "manuelle", fabricant: "Mazda",
    connaissance: 65, coutEntretien: "faible",
    forces: ["Commande précise et agréable", "Fiable"],
    defauts: [],
    entretien: [],
  },
  {
    id: "mazda_skyactiv_drive", nom: "Skyactiv-Drive, automatique 6 rapports", type: "automatique à convertisseur", fabricant: "Mazda",
    connaissance: 65, coutEntretien: "faible",
    forces: ["Boîte à convertisseur simple et fiable"],
    defauts: [],
    entretien: ["Vidange conseillée vers 80 000 km"],
  },
];
