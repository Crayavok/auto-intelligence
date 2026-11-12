// Base de connaissances (extension v0.4) : boîtes de vitesses supplémentaires. Rédaction initiale par l'IA, à vérifier.

export const BOITES_EXT = [
  {
    id: "bvm_generique", nom: "Boîte manuelle 5/6 rapports", type: "manuelle", fabricant: "—",
    connaissance: 60, coutEntretien: "faible",
    forces: ["Simple et économique à entretenir"],
    defauts: [],
    entretien: ["Contrôler l'embrayage à l'essai"],
  },
  {
    id: "aisin_6at", nom: "Aisin, automatique 6 rapports", type: "automatique à convertisseur", fabricant: "Aisin",
    connaissance: 70, coutEntretien: "modéré",
    forces: ["Robuste et éprouvée"],
    defauts: [
      { titre: "Passages durs si l'huile n'est jamais changée", detail: "Vidange conseillée malgré l'huile annoncée « à vie ».", gravite: 1, recurrence: "occasionnelle", confiance: "moyenne", nature: "consensus" },
    ],
    entretien: ["Vidange conseillée vers 80 000 km"],
  },
  {
    id: "zf_9hp", nom: "ZF 9HP, automatique 9 rapports", type: "automatique à convertisseur", fabricant: "ZF",
    connaissance: 70, coutEntretien: "modéré",
    forces: ["Faible consommation"],
    defauts: [
      { titre: "Passages brusques ou hésitants", detail: "Défaut fréquemment signalé sur les premières années, corrigé en partie par mises à jour logicielles ; quelques remplacements de boîte.", gravite: 2, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages", annees: "2014-2017" },
    ],
    entretien: ["Vérifier les mises à jour logicielles de la boîte"],
  },
  {
    id: "mini_dct7", nom: "Steptronic 7 rapports à double embrayage (Mini / BMW)", type: "double embrayage", fabricant: "Getrag",
    connaissance: 50, coutEntretien: "élevé",
    forces: ["Passages rapides"],
    defauts: [
      { titre: "À-coups à basse vitesse", detail: "Signalés en manœuvre et dans les bouchons.", gravite: 1, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Tester les démarrages lents et les manœuvres"],
  },
  {
    id: "smart_twinamic", nom: "Twinamic, double embrayage à sec 6 rapports (Smart)", type: "double embrayage", fabricant: "Getrag",
    connaissance: 55, coutEntretien: "élevé",
    forces: ["Bien plus agréable que l'ancienne boîte robotisée Smart"],
    defauts: [
      { titre: "À-coups et usure de l'embrayage en ville", detail: "Double embrayage à sec sollicité en usage urbain.", gravite: 2, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Tester les démarrages en côte"],
  },
  {
    id: "mb_9gtronic", nom: "9G-Tronic, automatique 9 rapports", type: "automatique à convertisseur", fabricant: "Mercedes-Benz",
    connaissance: 65, coutEntretien: "modéré",
    forces: ["Douce et efficace"],
    defauts: [
      { titre: "Passages brusques, module électronique", detail: "Quelques cas de passages durs, souvent corrigés par mise à jour.", gravite: 1, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Vidange conseillée vers 100 000 km"],
  },
  {
    id: "audi_dl382", nom: "S tronic 7 rapports longitudinale (DL382)", type: "double embrayage", fabricant: "Audi",
    connaissance: 50, coutEntretien: "élevé",
    forces: ["Embrayages en bain d'huile"],
    defauts: [
      { titre: "Mécatronique et à-coups", detail: "Quelques défaillances de mécatronique signalées.", gravite: 2, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Vidange selon préconisation (souvent 60 000 km)"],
  },
  {
    id: "porsche_bvm6", nom: "Boîte manuelle 6 rapports Porsche", type: "manuelle", fabricant: "Porsche",
    connaissance: 70, coutEntretien: "élevé",
    forces: ["Robuste, recherchée par les amateurs"],
    defauts: [],
    entretien: ["Vérifier l'embrayage et le volant bimasse"],
  },
  {
    id: "porsche_tip5", nom: "Tiptronic S, automatique 5 rapports (ZF 5HP)", type: "automatique à convertisseur", fabricant: "ZF",
    connaissance: 65, coutEntretien: "modéré",
    forces: ["Fiable"],
    defauts: [
      { titre: "Lenteur des passages", horsFiabilite: true, detail: "Point d'agrément, pas de fiabilité ; décote plus forte que la PDK.", gravite: 1, recurrence: "confirmée", confiance: "moyenne", nature: "consensus" },
    ],
    entretien: ["Vidange conseillée vers 80 000 km"],
  },
  {
    id: "porsche_pdk7", nom: "PDK 7 rapports (double embrayage humide)", type: "double embrayage", fabricant: "ZF / Porsche",
    connaissance: 75, coutEntretien: "élevé",
    forces: ["Rapide et réputée fiable", "Recherchée à la revente"],
    defauts: [],
    entretien: ["Vidange selon carnet"],
  },
  {
    id: "aisin_awf8g45", nom: "Aisin 8 rapports (Geartronic)", type: "automatique à convertisseur", fabricant: "Aisin",
    connaissance: 55, coutEntretien: "modéré",
    forces: ["Douce"],
    defauts: [
      { titre: "Passages hésitants", detail: "Quelques retours d'hésitations, mises à jour logicielles.", gravite: 1, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Vidange conseillée vers 100 000 km"],
  },
  {
    id: "jatco_cvt", nom: "CVT X-Tronic (variation continue)", type: "variation continue", fabricant: "Jatco",
    connaissance: 55, coutEntretien: "modéré",
    forces: ["Douceur en ville"],
    defauts: [
      { titre: "Usure de la courroie de variation, bruit", detail: "Retours de sifflements et d'usure à kilométrage élevé.", gravite: 2, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Vidange de la CVT selon carnet (importante)"],
  },
  {
    id: "reducteur_ve", nom: "Réducteur à un rapport (électrique)", type: "réducteur électrique", fabricant: "—",
    connaissance: 75, coutEntretien: "faible",
    forces: ["Aucun embrayage ni rapport : très peu d'usure"],
    defauts: [],
    entretien: [],
  },
];
