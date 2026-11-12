// Base de connaissances (extension v0.4) : motorisations supplémentaires, dont électriques.
// Rédaction initiale par l'IA (novembre 2026), à vérifier. Le champ `sources` n'est renseigné que pour des faits
// publics précis (rappels, annonces officielles) ; les autres informations restent à sourcer.
// Pour les électriques : cylindres = 0, cylindree = null, et `batterie` décrit les capacités et la garantie usuelle.

export const MOTEURS_EXT = [
  // ───────────── Land Rover ─────────────
  {
    id: "lr_ingenium20d", nom: "2.0 Ingenium diesel 150 à 240 (TD4 / SD4)", code: "204DTD / 204DTA", constructeur: "Jaguar Land Rover",
    carburant: "diesel", cylindres: 4, architecture: "4 cylindres en ligne", cylindree: 2.0, alimentation: "turbo",
    distribution: "chaîne (côté boîte)", kmReference: 220000, connaissance: 70, coutEntretien: "élevé",
    forces: ["Sobre pour un SUV", "Bon couple"],
    defauts: [
      { titre: "Allongement de la chaîne de distribution", detail: "Défaut fréquemment rapporté sur les premières années, avec risque de casse. Chaîne placée côté boîte : intervention lourde.", gravite: 3, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages", annees: "2015-2018", question: "La chaîne de distribution a-t-elle été remplacée ? Avez-vous la facture ?" },
      { titre: "Dilution d'huile et encrassement FAP / EGR", detail: "Sensible aux trajets courts.", gravite: 2, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Vidanges rapprochées (15 000 km max conseillé)", "Contrôler le niveau d'huile : il ne doit pas monter"],
    privilegier: "Production 2019 et après, entretien réseau complet.",
    eviter: "Bruit de chaîne à froid, usage urbain exclusif.",
  },
  {
    id: "lr_tdv6_30", nom: "3.0 TDV6 / SDV6 249 à 306", code: "306DT", constructeur: "Ford / PSA / Jaguar Land Rover",
    carburant: "diesel", cylindres: 6, architecture: "V6", cylindree: 3.0, alimentation: "biturbo",
    distribution: "courroie", kmReference: 250000, connaissance: 75, coutEntretien: "très élevé",
    forces: ["Coupleux et agréable", "Adapté au remorquage"],
    defauts: [
      { titre: "Rupture du vilebrequin / coussinets de bielle", detail: "Défaut connu de ce V6 diesel : coussinets qui tournent, voire vilebrequin cassé. Remplacement moteur très coûteux.", gravite: 3, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages", question: "Le moteur a-t-il déjà été remplacé ou ouvert ? Y a-t-il eu un bruit de cognement ?" },
      { titre: "Fuites et refroidisseur EGR", detail: "Fuites de liquide de refroidissement et d'huile fréquentes avec l'âge.", gravite: 2, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Vidanges très rapprochées (huile à la norme exacte)", "Courroie de distribution selon carnet"],
    privilegier: "Historique réseau complet, vidanges fréquentes.",
    eviter: "Bruit de cognement, pression d'huile basse, vidanges espacées.",
  },
  {
    id: "lr_v8sc50", nom: "5.0 V8 compresseur 510 à 575", code: "AJ133 SC", constructeur: "Jaguar Land Rover",
    carburant: "essence", cylindres: 8, architecture: "V8", cylindree: 5.0, alimentation: "compresseur",
    distribution: "chaîne", kmReference: 250000, connaissance: 65, coutEntretien: "très élevé",
    forces: ["Performances et sonorité", "Mécanique plutôt robuste une fois corrigée"],
    defauts: [
      { titre: "Tendeurs et guides de chaîne de distribution", detail: "Usure signalée sur les premières années, avec claquement au démarrage.", gravite: 3, recurrence: "occasionnelle", confiance: "moyenne", nature: "témoignages", annees: "2010-2014" },
      { titre: "Pompe à eau et circuit de refroidissement", detail: "Pièces plastiques sujettes aux fuites.", gravite: 2, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Budget d'entretien très élevé", "Écouter la distribution au démarrage à froid"],
    privilegier: "Distribution vérifiée, entretien réseau.",
    eviter: "Claquement au démarrage.",
  },
  {
    id: "ford_22tdci", nom: "2.2 TD4 / SD4 150 à 190", code: "DW12 (2.2 diesel)", constructeur: "PSA / Ford",
    carburant: "diesel", cylindres: 4, architecture: "4 cylindres en ligne", cylindree: 2.2, alimentation: "turbo",
    distribution: "courroie", kmReference: 280000, connaissance: 60, coutEntretien: "modéré",
    forces: ["Moteur éprouvé utilisé par plusieurs constructeurs"],
    defauts: [
      { titre: "Encrassement FAP / EGR et volant bimasse", detail: "Usures classiques d'un diesel de cette époque.", gravite: 2, recurrence: "occasionnelle", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Courroie selon carnet", "Rouler régulièrement sur route"],
    privilegier: "Usage routier.", eviter: "Usage urbain exclusif.",
  },

  // ───────────── Mini / Smart ─────────────
  {
    id: "mini_prince16t", nom: "1.6 THP 175 à 211 (Cooper S / JCW)", code: "N14 / N18 (« Prince »)", constructeur: "BMW / PSA",
    carburant: "essence", cylindres: 4, architecture: "4 cylindres en ligne", cylindree: 1.6, alimentation: "turbo",
    distribution: "chaîne", kmReference: 180000, connaissance: 85, coutEntretien: "élevé",
    forces: ["Vif et performant"],
    defauts: [
      { titre: "Chaîne de distribution et tendeur", detail: "Allongement de chaîne et tendeur défaillant, bruit de « crécelle » au démarrage, risque de casse moteur.", gravite: 3, recurrence: "confirmée", confiance: "élevée", nature: "consensus", annees: "2006-2012", question: "La chaîne et le tendeur ont-ils été remplacés ? Avez-vous la facture ?" },
      { titre: "Consommation d'huile et calamine", detail: "Surconsommation d'huile et encrassement des soupapes (injection directe), surtout sur le N14.", gravite: 2, recurrence: "fréquente", confiance: "élevée", nature: "consensus" },
      { titre: "Pompe à eau / thermostat", detail: "Fuites fréquentes.", gravite: 1, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Contrôler le niveau d'huile tous les 1 000 km", "Vidanges rapprochées (10 000 km)"],
    privilegier: "N18 (à partir de 2010) avec chaîne remplacée et factures.",
    eviter: "N14 (2006-2010) sans historique, bruit de chaîne au démarrage.",
  },
  {
    id: "bmw_b38", nom: "1.5 136 (Cooper)", code: "B38", constructeur: "BMW",
    carburant: "essence", cylindres: 3, architecture: "3 cylindres en ligne", cylindree: 1.5, alimentation: "turbo",
    distribution: "chaîne", kmReference: 250000, connaissance: 65, coutEntretien: "modéré",
    forces: ["Bien plus fiable que l'ancien 1.6 Prince", "Sobre et agréable"],
    defauts: [
      { titre: "Fuites mineures (refroidissement)", detail: "Rapportées à kilométrage élevé.", gravite: 1, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Entretien standard selon carnet"],
    privilegier: "Toutes années.", eviter: "—",
  },
  {
    id: "renault_sce10", nom: "1.0 SCe 71", code: "H4D", constructeur: "Renault",
    carburant: "essence", cylindres: 3, architecture: "3 cylindres en ligne", cylindree: 1.0, alimentation: "atmosphérique",
    distribution: "chaîne", kmReference: 220000, connaissance: 60, coutEntretien: "faible",
    forces: ["Mécanique simple, sans turbo", "Entretien économique"],
    defauts: [],
    entretien: ["Entretien standard selon carnet"],
    privilegier: "Usage urbain.", eviter: "—",
  },
  {
    id: "renault_tce10", nom: "1.0 TCe 90 / 100", code: "H4Dt", constructeur: "Renault",
    carburant: "essence", cylindres: 3, architecture: "3 cylindres en ligne", cylindree: 1.0, alimentation: "turbo",
    distribution: "chaîne", kmReference: 220000, connaissance: 60, coutEntretien: "faible",
    forces: ["Sobre", "Existe en version GPL (ECO-G) très économique"],
    defauts: [
      { titre: "Petits défauts d'agrément et capteurs", detail: "Quelques retours de ratés et de capteurs défaillants.", gravite: 1, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Entretien standard selon carnet"],
    privilegier: "Toutes années.", eviter: "—",
  },
  {
    id: "smart_eq", nom: "Électrique 82 ch (EQ fortwo / forfour)", code: "17,6 kWh", constructeur: "Smart / Renault",
    carburant: "électrique", cylindres: 0, architecture: "moteur électrique", cylindree: null, alimentation: "batterie 17,6 kWh",
    distribution: "—", kmReference: 300000, connaissance: 55, coutEntretien: "faible",
    batterie: { capacites: [17.6], autonomie: "environ 100 à 130 km réels", garantie: "généralement 8 ans / 100 000 km" },
    forces: ["Idéale en ville", "Entretien très réduit"],
    defauts: [
      { titre: "Autonomie très limitée", horsFiabilite: true, detail: "Usage urbain uniquement ; l'autonomie baisse encore avec l'usure de la batterie et en hiver.", gravite: 1, recurrence: "confirmée", confiance: "élevée", nature: "consensus" },
    ],
    entretien: ["Demander un certificat d'état de la batterie (SOH)", "Vérifier le câble et le chargeur embarqué"],
    privilegier: "Batterie avec bon état de santé (SOH ≥ 90 %).", eviter: "Usage routier.",
  },

  // ───────────── Maserati ─────────────
  {
    id: "maserati_v6d", nom: "3.0 V6 diesel 250 / 275", code: "VM Motori A630", constructeur: "VM Motori (Stellantis)",
    carburant: "diesel", cylindres: 6, architecture: "V6", cylindree: 3.0, alimentation: "turbo",
    distribution: "chaîne", kmReference: 250000, connaissance: 45, coutEntretien: "très élevé",
    forces: ["Sonorité travaillée", "Forte décote : prix d'achat bas"],
    defauts: [
      { titre: "Fiabilité peu documentée, pièces et main-d'œuvre chères", detail: "Peu de retours structurés ; quelques problèmes d'électronique et de capteurs rapportés.", gravite: 2, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Entretien chez un spécialiste Maserati", "Budget d'entretien très élevé"],
    privilegier: "Historique réseau complet, garantie.", eviter: "Exemplaires sans historique.",
  },
  {
    id: "maserati_v6bt", nom: "3.0 V6 biturbo 350 à 430", code: "F160", constructeur: "Maserati (assemblé par Ferrari)",
    carburant: "essence", cylindres: 6, architecture: "V6", cylindree: 3.0, alimentation: "biturbo",
    distribution: "chaîne", kmReference: 220000, connaissance: 45, coutEntretien: "très élevé",
    forces: ["Performances et sonorité", "Prestige"],
    defauts: [
      { titre: "Chaîne de distribution et variateurs d'arbres à cames", detail: "Problèmes signalés sur les premières années de production.", gravite: 3, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages", annees: "2013-2016" },
    ],
    entretien: ["Entretien chez un spécialiste", "Budget d'entretien très élevé"],
    privilegier: "Production 2017 et après, historique réseau.", eviter: "Bruit de distribution à froid.",
  },

  // ───────────── Audi / Volkswagen / Skoda ─────────────
  {
    id: "audi_30tdi", nom: "3.0 TDI V6 218 à 286", code: "EA897", constructeur: "Audi",
    carburant: "diesel", cylindres: 6, architecture: "V6", cylindree: 3.0, alimentation: "turbo",
    distribution: "chaîne (côté boîte)", kmReference: 320000, connaissance: 65, coutEntretien: "élevé",
    forces: ["Coupleux, souple et endurant"],
    defauts: [
      { titre: "Rappel logiciel antipollution (versions Euro 6)", detail: "Certaines versions ont fait l'objet d'un rappel ordonné par l'autorité allemande (KBA) pour leur logiciel antipollution. Vérifier que l'intervention a été réalisée.", gravite: 2, recurrence: "occasionnelle", confiance: "moyenne", nature: "rappel", annees: "2015-2018", sources: [{ titre: "Rappels KBA des V6 TDI Euro 6 du groupe Volkswagen", annee: 2018 }] },
      { titre: "Fuites et refroidisseur EGR", detail: "À surveiller à kilométrage élevé.", gravite: 2, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Vidanges régulières", "Vérifier les rappels effectués"],
    privilegier: "Historique complet.", eviter: "Rappel non effectué.",
  },
  {
    id: "vw_15tsi", nom: "1.5 TSI 130 / 150", code: "EA211 evo", constructeur: "Volkswagen",
    carburant: "essence", cylindres: 4, architecture: "4 cylindres en ligne", cylindree: 1.5, alimentation: "turbo",
    distribution: "courroie", kmReference: 250000, connaissance: 65, coutEntretien: "modéré",
    forces: ["Sobre (désactivation de cylindres)", "Souple"],
    defauts: [
      { titre: "À-coups à froid (« effet kangourou »)", detail: "Hésitations à bas régime à froid sur les premières séries, en partie corrigées par mise à jour.", gravite: 1, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages", annees: "2017-2019" },
    ],
    entretien: ["Vérifier les mises à jour logicielles"],
    privilegier: "Production 2020 et après.", eviter: "—",
  },
  {
    id: "ea288_16tdi", nom: "1.6 TDI 90 à 116", code: "EA288", constructeur: "Volkswagen",
    carburant: "diesel", cylindres: 4, architecture: "4 cylindres en ligne", cylindree: 1.6, alimentation: "turbo",
    distribution: "courroie", kmReference: 300000, connaissance: 70, coutEntretien: "faible",
    forces: ["Très sobre", "Endurant"],
    defauts: [
      { titre: "Encrassement EGR / FAP en usage urbain", detail: "Typique des petits diesels.", gravite: 1, recurrence: "occasionnelle", confiance: "moyenne", nature: "consensus" },
    ],
    entretien: ["Courroie selon carnet", "Rouler régulièrement sur route"],
    privilegier: "Usage routier.", eviter: "Usage urbain exclusif.",
  },

  // ───────────── Mercedes ─────────────
  {
    id: "mb_om651", nom: "2.1 diesel 170 (C220d / C220 BlueTEC)", code: "OM651", constructeur: "Mercedes-Benz",
    carburant: "diesel", cylindres: 4, architecture: "4 cylindres en ligne", cylindree: 2.1, alimentation: "biturbo",
    distribution: "chaîne", kmReference: 300000, connaissance: 75, coutEntretien: "élevé",
    forces: ["Sobre et endurant"],
    defauts: [
      { titre: "Rappel logiciel antipollution", detail: "Une partie des moteurs Euro 6 a fait l'objet d'un rappel (mise à jour logicielle) en Allemagne. Vérifier que l'intervention a été réalisée.", gravite: 2, recurrence: "occasionnelle", confiance: "moyenne", nature: "rappel", annees: "2014-2018", sources: [{ titre: "Rappels KBA de diesels Mercedes-Benz Euro 6", annee: 2018 }] },
      { titre: "Chaîne de distribution bruyante, EGR", detail: "Allongement de chaîne et encrassement signalés à kilométrage élevé.", gravite: 2, recurrence: "occasionnelle", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Vidanges régulières", "Vérifier les rappels effectués"],
    privilegier: "Historique réseau complet.", eviter: "Bruit de chaîne à froid.",
  },
  {
    id: "mb_om654", nom: "2.0 diesel 160 à 194 (C200d / C220d)", code: "OM654", constructeur: "Mercedes-Benz",
    carburant: "diesel", cylindres: 4, architecture: "4 cylindres en ligne", cylindree: 2.0, alimentation: "turbo",
    distribution: "chaîne", kmReference: 320000, connaissance: 65, coutEntretien: "élevé",
    forces: ["Bonne réputation", "Très sobre"],
    defauts: [],
    entretien: ["Entretien standard selon carnet"],
    privilegier: "Toutes années.", eviter: "—",
  },
  {
    id: "mb_m274", nom: "1.6 / 2.0 essence 156 à 211 (C180 / C200 / C250)", code: "M274", constructeur: "Mercedes-Benz",
    carburant: "essence", cylindres: 4, architecture: "4 cylindres en ligne", cylindree: 2.0, alimentation: "turbo",
    distribution: "chaîne", kmReference: 250000, connaissance: 65, coutEntretien: "élevé",
    forces: ["Agréable et performant"],
    defauts: [
      { titre: "Déphaseurs d'arbres à cames et électrovannes", detail: "Bruits de distribution au démarrage et fuites d'huile vers les connecteurs signalés.", gravite: 2, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Écouter la distribution au démarrage à froid"],
    privilegier: "Déphaseurs déjà remplacés.", eviter: "Claquement au démarrage.",
  },

  // ───────────── Porsche ─────────────
  {
    id: "porsche_m97", nom: "3.6 / 3.8 flat-6 325 à 355 (997.1)", code: "M97", constructeur: "Porsche",
    carburant: "essence", cylindres: 6, architecture: "6 cylindres à plat", cylindree: 3.6, alimentation: "atmosphérique",
    distribution: "chaîne", kmReference: 250000, connaissance: 85, coutEntretien: "très élevé",
    forces: ["Caractère et sonorité", "Valeur stable"],
    defauts: [
      { titre: "Roulement d'arbre intermédiaire (IMS)", detail: "Sa rupture détruit le moteur. Risque plus faible que sur la 996, mais réel ; un roulement renforcé peut être posé préventivement.", gravite: 3, recurrence: "occasionnelle", confiance: "élevée", nature: "consensus", question: "Le roulement IMS a-t-il été remplacé ou contrôlé ? Avez-vous la facture ?" },
      { titre: "Rayures des cylindres (« bore scoring »)", detail: "Surtout sur la 3.8 Carrera S : consommation d'huile, fumée, bruit. Contrôle par endoscopie conseillé avant achat.", gravite: 3, recurrence: "occasionnelle", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Endoscopie des cylindres avant achat", "Vidanges rapprochées", "Inspection par un spécialiste Porsche"],
    privilegier: "Endoscopie favorable, IMS traité, historique complet.",
    eviter: "Fumée au démarrage, consommation d'huile élevée.",
  },
  {
    id: "porsche_9a1", nom: "3.6 / 3.8 flat-6 DFI 345 à 385 (997.2)", code: "9A1", constructeur: "Porsche",
    carburant: "essence", cylindres: 6, architecture: "6 cylindres à plat", cylindree: 3.6, alimentation: "atmosphérique",
    distribution: "chaîne", kmReference: 300000, connaissance: 75, coutEntretien: "très élevé",
    forces: ["Sans roulement IMS : nettement plus fiable que le M97", "Valeur stable, intérêt collection"],
    defauts: [
      { titre: "Rayures des cylindres (cas isolés)", detail: "Beaucoup plus rare que sur le M97.", gravite: 3, recurrence: "isolée", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Inspection par un spécialiste Porsche", "Vidanges régulières"],
    privilegier: "Historique complet, non modifiée.", eviter: "—",
  },
  {
    id: "porsche_v6bt_macan", nom: "3.0 V6 biturbo 340 à 440 (Macan S / GTS / Turbo)", code: "V6 biturbo (groupe VW)", constructeur: "Porsche / Audi",
    carburant: "essence", cylindres: 6, architecture: "V6", cylindree: 3.0, alimentation: "biturbo",
    distribution: "chaîne", kmReference: 250000, connaissance: 50, coutEntretien: "très élevé",
    forces: ["Performances", "Comportement de référence pour un SUV"],
    defauts: [
      { titre: "Fuites de liquide de refroidissement", detail: "Durites et raccords à surveiller.", gravite: 1, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Entretien chez un spécialiste Porsche"],
    privilegier: "Historique réseau complet.", eviter: "—",
  },

  // ───────────── Volvo ─────────────
  {
    id: "volvo_d4", nom: "2.0 D4 / B4 diesel 190 / 197", code: "Drive-E D4204T", constructeur: "Volvo",
    carburant: "diesel", cylindres: 4, architecture: "4 cylindres en ligne", cylindree: 2.0, alimentation: "biturbo",
    distribution: "courroie", kmReference: 300000, connaissance: 55, coutEntretien: "modéré",
    forces: ["Sobre pour un SUV", "Bon agrément"],
    defauts: [
      { titre: "Encrassement EGR / FAP en usage urbain", detail: "Typique des diesels modernes.", gravite: 1, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Courroie selon carnet"],
    privilegier: "Usage routier.", eviter: "Usage urbain exclusif.",
  },
  {
    id: "volvo_t5", nom: "2.0 T5 / B5 essence 250", code: "Drive-E B4204T", constructeur: "Volvo",
    carburant: "essence", cylindres: 4, architecture: "4 cylindres en ligne", cylindree: 2.0, alimentation: "turbo",
    distribution: "courroie", kmReference: 250000, connaissance: 55, coutEntretien: "modéré",
    forces: ["Performant"],
    defauts: [
      { titre: "Consommation d'huile (segmentation)", detail: "Surconsommation signalée sur une partie de la production des premières années.", gravite: 2, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages", annees: "2015-2018" },
    ],
    entretien: ["Contrôler le niveau d'huile entre deux vidanges"],
    privilegier: "Production 2019 et après.", eviter: "Consommation d'huile constatée.",
  },

  // ───────────── Électriques ─────────────
  {
    id: "renault_zoe_ve", nom: "Électrique 88 à 135 ch (R90 / R110 / R135)", code: "22 / 41 / 52 kWh", constructeur: "Renault",
    carburant: "électrique", cylindres: 0, architecture: "moteur électrique", cylindree: null, alimentation: "batterie 22 à 52 kWh",
    distribution: "—", kmReference: 300000, connaissance: 75, coutEntretien: "faible",
    batterie: { capacites: [22, 41, 52], autonomie: "environ 130 km (22 kWh) à 300 km (52 kWh) réels", garantie: "8 ans / 160 000 km si achetée ; à vie si louée" },
    forces: ["Coût d'usage très faible", "Batterie 52 kWh à bonne autonomie"],
    defauts: [
      { titre: "Batterie souvent en location", horsFiabilite: true, detail: "Beaucoup de Zoé ont une batterie louée : contrat à transférer et loyer mensuel à ajouter au coût, ou rachat à négocier.", gravite: 2, recurrence: "confirmée", confiance: "élevée", nature: "consensus", question: "La batterie est-elle achetée ou louée ? Si louée, quel est le loyer et le contrat est-il transférable ?" },
      { titre: "Chargeur embarqué / prise de charge", detail: "Pannes du chargeur embarqué signalées.", gravite: 2, recurrence: "occasionnelle", confiance: "moyenne", nature: "témoignages" },
    ],
    entretien: ["Certificat d'état de la batterie (SOH)", "Vérifier la recharge rapide (selon version)"],
    privilegier: "Batterie 52 kWh achetée, SOH élevé.", eviter: "Batterie louée sans connaître le contrat.",
  },
  {
    id: "tesla_m3_ve", nom: "Électrique 283 à 513 ch", code: "55 à 82 kWh", constructeur: "Tesla",
    carburant: "électrique", cylindres: 0, architecture: "moteur électrique", cylindree: null, alimentation: "batterie 55 à 82 kWh",
    distribution: "—", kmReference: 400000, connaissance: 70, coutEntretien: "faible",
    batterie: { capacites: [55, 60, 75, 82], autonomie: "environ 350 à 500 km réels selon version", garantie: "8 ans / 160 000 à 192 000 km (70 %)" },
    forces: ["Batterie réputée durable", "Réseau de recharge rapide", "Mises à jour logicielles"],
    defauts: [
      { titre: "Bras de suspension avant bruyants", detail: "Remplacement fréquent des bras supérieurs.", gravite: 1, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages" },
      { titre: "Qualité d'assemblage variable", detail: "Écarts de panneaux, bruits de mobilier sur les premières séries.", gravite: 1, recurrence: "fréquente", confiance: "moyenne", nature: "témoignages", annees: "2019-2020" },
    ],
    entretien: ["Certificat d'état de la batterie (SOH)", "Contrôler trains roulants et pneus (usure rapide)"],
    privilegier: "Toutes années, garantie batterie restante.", eviter: "Véhicule accidenté réparé hors réseau.",
  },
  {
    id: "nissan_leaf_ve", nom: "Électrique 150 / 217 ch", code: "40 / 62 kWh", constructeur: "Nissan",
    carburant: "électrique", cylindres: 0, architecture: "moteur électrique", cylindree: null, alimentation: "batterie 40 ou 62 kWh",
    distribution: "—", kmReference: 300000, connaissance: 70, coutEntretien: "faible",
    batterie: { capacites: [40, 62], autonomie: "environ 220 à 350 km réels", garantie: "8 ans / 160 000 km" },
    forces: ["Fiabilité mécanique", "Prix d'achat bas"],
    defauts: [
      { titre: "Batterie sans refroidissement liquide", detail: "Usure plus rapide en usage intensif ou avec beaucoup de recharges rapides ; vitesse de recharge réduite après plusieurs charges rapides successives.", gravite: 2, recurrence: "confirmée", confiance: "élevée", nature: "consensus" },
    ],
    entretien: ["Certificat d'état de la batterie (SOH ou nombre de barres de capacité)"],
    privilegier: "Batterie avec SOH élevé, usage modéré.", eviter: "Usage intensif sur autoroute.",
  },
  {
    id: "hyundai_kona_ve", nom: "Électrique 136 / 204 ch", code: "39 / 64 kWh", constructeur: "Hyundai",
    carburant: "électrique", cylindres: 0, architecture: "moteur électrique", cylindree: null, alimentation: "batterie 39 ou 64 kWh",
    distribution: "—", kmReference: 350000, connaissance: 70, coutEntretien: "faible",
    batterie: { capacites: [39, 64], autonomie: "environ 250 à 400 km réels", garantie: "8 ans / 160 000 km" },
    forces: ["Bonne autonomie (64 kWh)", "Efficience"],
    defauts: [
      { titre: "Rappel : risque d'incendie de la batterie", detail: "Rappel mondial avec remplacement de la batterie sur une partie de la production. Vérifier que l'intervention a été réalisée.", gravite: 3, recurrence: "confirmée", confiance: "élevée", nature: "rappel", annees: "2018-2020", sources: [{ titre: "Rappel Hyundai Kona Electric, remplacement de batterie", annee: 2021 }], question: "Le rappel batterie a-t-il été effectué ? Avez-vous le justificatif ?" },
      { titre: "Bruit du réducteur", detail: "Bruits signalés sur certains exemplaires.", gravite: 1, recurrence: "occasionnelle", confiance: "faible", nature: "témoignages" },
    ],
    entretien: ["Vérifier les rappels effectués", "Certificat d'état de la batterie (SOH)"],
    privilegier: "Rappel effectué ou batterie remplacée.", eviter: "Rappel non effectué.",
  },
];
