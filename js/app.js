// AUTO INTELLIGENCE — application (interface et navigation)
import { MODELES } from "./data/modeles.js";
import { MOTEURS } from "./data/moteurs.js";
import { BOITES } from "./data/boites.js";
import {
  moteurParId, boiteParId, modeleParId, toutesVersions, noteFiabilite, noteEntretien, noteRevente,
  niveau, analyserAnnonce, PROFILS, LIBELLES_NOTES, ANNEE_COURANTE, defautConcerne,
} from "./notation.js";
import { interpreter, rechercher, ecarts, pourquoi, TRIS, MARQUES, CARROSSERIES } from "./recherche.js";
import { stock } from "./stockage.js";
import { extraireAnnonce } from "./import.js";

// ─────────────────────────── Utilitaires ───────────────────────────
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (n) => Number(n).toLocaleString("fr-FR");
const keur = (n) => (n >= 1000 ? `${fmt(Math.round(n / 100) / 10)} k€` : `${fmt(n)} €`);
const plage = ([a, b]) => (a === b ? `${a}` : `${a}–${b}`);
const VERSIONS = toutesVersions();
const versionParCle = Object.fromEntries(VERSIONS.map((v) => [v.cle, v]));

const I = {
  logo: `<svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5b8cff"/><stop offset="1" stop-color="#7b5bff"/></linearGradient></defs><rect width="32" height="32" rx="9" fill="url(#lg)"/><path d="M8 21a8 8 0 1 1 16 0" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M16 21l4.5-5.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="16" cy="21" r="1.8" fill="#fff"/></svg>`,
  accueil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>`,
  recherche: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>`,
  analyse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-5"/><circle cx="12" cy="17" r="1.4" fill="currentColor"/></svg>`,
  comparer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3" y="4" width="7" height="16" rx="2"/><rect x="14" y="4" width="7" height="16" rx="2"/></svg>`,
  etoile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>`,
  etoilePleine: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>`,
  soleil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  lune: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>`,
  alerte: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>`,
  source: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 6 .5l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-6-.5l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5"/></svg>`,
  fleche: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  importer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;flex:none;color:var(--accent-2);margin-top:2px"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>`,
  coller: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6"/></svg>`,
  voiture: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16h14v-3l-2-5H7l-2 5z"/><circle cx="8" cy="16.5" r="1.5"/><circle cx="16" cy="16.5" r="1.5"/></svg>`,
};

const SILHOUETTES = {
  defaut: `<path d="M8 50 C 10 40, 20 37, 34 35 L 52 22 C 58 18, 66 17, 92 17 C 106 17, 114 21, 122 30 L 134 35 C 142 37, 146 42, 146 50 Z" fill="currentColor"/>`,
  coupé: `<path d="M6 50 C 8 42, 18 39, 36 36 L 60 24 C 66 21, 74 20, 92 21 C 104 22, 112 27, 124 34 C 138 37, 146 42, 146 50 Z" fill="currentColor"/>`,
  citadine: `<path d="M22 50 C 22 40, 30 36, 42 34 L 56 19 C 60 16, 66 15, 90 15 C 104 15, 112 20, 118 30 L 126 35 C 132 38, 134 43, 134 50 Z" fill="currentColor"/>`,
  break: `<path d="M8 50 C 10 40, 20 37, 32 35 L 50 21 C 55 17, 62 16, 120 16 C 130 16, 136 22, 140 32 L 144 40 C 146 44, 146 47, 146 50 Z" fill="currentColor"/>`,
};
function silhouette(carrosseries) {
  const c = carrosseries.find((x) => SILHOUETTES[x]) ?? (carrosseries.includes("cabriolet") ? "coupé" : "defaut");
  return `<svg class="silhouette" viewBox="0 0 150 62"><g>${SILHOUETTES[c] ?? SILHOUETTES.defaut}<circle cx="38" cy="50" r="10" fill="var(--surface-2)"/><circle cx="38" cy="50" r="6" fill="currentColor"/><circle cx="116" cy="50" r="10" fill="var(--surface-2)"/><circle cx="116" cy="50" r="6" fill="currentColor"/></g></svg>`;
}

/** Jauge circulaire. `approx` affiche « ≈ » quand les données sont insuffisantes. */
function jauge(score, lib, { grande = false, approx = false } = {}) {
  const n = niveau(score);
  const r = 26, c = 2 * Math.PI * r;
  const val = score == null ? 0 : score;
  const txt = score == null ? "—" : `${approx ? "≈" : ""}${approx ? Math.round(score / 5) * 5 : score}`;
  return `<div class="jauge ${grande ? "grande" : ""}">
    <svg viewBox="0 0 64 64" class="c-${n}" role="img" aria-label="${esc(lib)} : ${score == null ? "non disponible" : score + " sur 100"}">
      <circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="6"/>
      <circle cx="32" cy="32" r="${r}" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"
        stroke-dasharray="${(c * val) / 100} ${c}" transform="rotate(-90 32 32)"/>
      <text x="32" y="${grande ? 36 : 37}" text-anchor="middle" font-size="${txt.length > 3 ? 14 : 17}">${txt}</text>
    </svg>
    ${lib ? `<div class="lib">${esc(lib)}</div>` : ""}
  </div>`;
}
const pastille = (s) => `<span class="score-pastille ${niveau(s)}">${s ?? "—"}</span>`;
const barre = (s) => `<div class="barre c-${niveau(s)}"><span style="width:${s ?? 0}%"></span></div>`;
const NIV_TEXTE = { bon: "Favorable", moyen: "Vigilance", mauvais: "Risque", inconnu: "Inconnu" };

function badgeDefaut(d) {
  const cls = d.gravite === 3 ? "mauvais" : d.gravite === 2 ? "moyen" : "";
  return `<span class="badge ${cls}">Gravité ${d.gravite}/3</span>
    <span class="badge">${esc(d.recurrence)}</span>
    <span class="badge">Confiance ${esc(d.confiance)}</span>
    <span class="badge accent">${esc({ consensus: "Consensus", rappel: "Rappel officiel", témoignages: "Témoignages", statistique: "Statistique" }[d.nature] ?? d.nature)}</span>
    ${d.annees ? `<span class="badge">${esc(d.annees)}</span>` : ""}`;
}
function blocDefauts(defauts, annee = null) {
  if (!defauts.length) return `<p class="muted petit">Aucun défaut récurrent répertorié dans la base actuelle. Cela ne garantit pas l'absence de problème : la base est en cours de constitution.</p>`;
  return defauts.map((d) => `<div class="defaut g${d.gravite}" ${annee && !defautConcerne(d, annee) ? 'style="opacity:.55"' : ""}>
    <div class="t">${esc(d.titre)}</div><p>${esc(d.detail)}</p><div class="badges">${badgeDefaut(d)}</div></div>`).join("");
}
function blocCalcul(details) {
  return `<ul class="calcul">${details.map((d) => `<li><span>${esc(d.label)}</span><b>${d.base ? d.delta : d.delta === 0 ? "" : d.delta > 0 ? `+${d.delta}` : d.delta}</b></li>`).join("")}</ul>`;
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("visible"), 2200);
}

// ─────────────────────────── Carte « version » ───────────────────────────
function carteVersion(v, { raison = null } = {}) {
  const { modele, mot, moteur } = v;
  const fav = stock.estFavori(v.cle), cmp = stock.dansComparateur(v.cle);
  const graves = moteur.defauts.filter((d) => d.gravite === 3 && ["confirmée", "fréquente"].includes(d.recurrence));
  const lien = `#/version/${modele.id}/${moteur.id}`;
  return `<article class="carte vehicule apparition">
    <a href="${lien}" class="visuel" style="color:inherit">
      <div><div class="marque">${esc(modele.marque)}</div><div class="muted tres-petit">${esc(modele.modele)} · ${esc(modele.generation)}</div></div>
      ${silhouette(modele.carrosseries)}
    </a>
    <div class="corps">
      ${raison ? `<div class="badge accent" style="margin-bottom:8px">Alternative : hors critère ${esc(raison)}</div>` : ""}
      <a href="${lien}" class="titre" style="color:var(--text)">${esc(moteur.nom)}</a>
      <div class="meta"><span>${plage(mot.annees)}</span><span>${esc(moteur.carburant)}</span><span>${esc(moteur.architecture)}</span><span>${mot.puissances.join(" / ")} ch</span></div>
      <div class="flex entre" style="margin-bottom:12px">
        <div><div class="prix-indicatif num">${keur(modele.prix[0])} – ${keur(modele.prix[1])}</div><div class="tres-petit muted">Prix indicatif · estimation non vérifiée</div></div>
        ${graves.length ? `<span class="badge mauvais">Risque connu</span>` : v.fiabMoteur.score >= 85 ? `<span class="badge bon">Très fiable</span>` : ""}
      </div>
      <div class="jauges">
        ${jauge(v.fiabMoteur.score, "Moteur", { approx: v.fiabMoteur.insuffisant })}
        ${jauge(v.meilleureBoite?.note.score ?? null, "Meilleure boîte")}
        ${jauge(v.entretien.score, "Entretien")}
      </div>
      <ul class="liste-points ${graves.length ? "rouge" : ""}">${pourquoi(v).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      <div class="flex mt petit muted"><span>Indice de connaissance</span><div class="barre c-${niveau(moteur.connaissance)}" style="flex:1"><span style="width:${moteur.connaissance}%"></span></div><b class="num" style="color:var(--text)">${moteur.connaissance}</b></div>
      <div class="actions">
        <a class="btn" href="${lien}">Analyse détaillée ${I.fleche}</a>
        <button class="btn-icone ${fav ? "on" : ""}" data-fav="${v.cle}" aria-label="Favori">${fav ? I.etoilePleine : I.etoile}</button>
        <button class="btn-icone ${cmp ? "on cmp" : ""}" data-cmp="${v.cle}" aria-label="Comparer">${I.comparer}</button>
      </div>
    </div>
  </article>`;
}

// ─────────────────────────── Écrans ───────────────────────────
const BANDEAU = `<div class="bandeau-demo">${I.info}<div><b>Version 1 — mode démonstration.</b> La base de connaissances est une première rédaction par IA, à vérifier ; les prix sont des estimations. Les annonces en direct ne sont pas encore connectées. <a href="#/sources">En savoir plus</a></div></div>`;

function ecranAccueil() {
  const analyses = stock.analyses();
  const opp = analyses.filter((a) => a.opportunite).length;
  const rep = { bon: 0, moyen: 0, mauvais: 0 };
  for (const m of MOTEURS) rep[niveau(noteFiabilite(m).score)]++;
  const total = MOTEURS.length;
  const tri = [...VERSIONS].sort((a, b) => b.pertinence - a.pertinence);
  const top = tri.slice(0, 4);
  const pires = [...VERSIONS].sort((a, b) => a.fiabMoteur.score - b.fiabMoteur.score).slice(0, 3);

  return `
    <h1>Votre expert automobile personnel</h1>
    <p class="sous-titre">Décrivez la voiture que vous cherchez, ou analysez une annonce.</p>
    <form class="recherche-hero" id="form-accueil">
      <textarea name="q" rows="3" placeholder="Ex. : un V8 aussi fiable que possible, budget 25 000 €, toutes marques"></textarea>
      <button class="btn btn-principal" type="submit">${I.recherche} Chercher</button>
    </form>
    <a class="lien-ligne mt" href="#/analyse">${I.importer}<div class="grow"><b>Importer une annonce</b><div class="petit muted">Collez le texte d'une annonce pour l'analyser en un instant</div></div><span class="chev">›</span></a>
    <div class="puces mt">
      ${["Citadine hybride fiable", "V8 fiable moins de 25 000 €", "Break diesel gros rouleur", "Sportive fiable 30 000 €"].map((s) => `<a class="puce" href="#/recherche?q=${encodeURIComponent(s)}">${esc(s)}</a>`).join("")}
    </div>

    <h2>Tableau de bord</h2>
    <div class="grille kpis">
      <div class="carte kpi"><div class="libelle">Modèles étudiés</div><div class="valeur num">${MODELES.length}</div><div class="note">${MARQUES.length} marques</div></div>
      <div class="carte kpi"><div class="libelle">Motorisations documentées</div><div class="valeur num">${MOTEURS.length}</div><div class="note">${BOITES.length} boîtes de vitesses</div></div>
      <div class="carte kpi"><div class="libelle">Annonces analysées</div><div class="valeur num">${analyses.length}</div><div class="note">par vous, sur cet appareil</div></div>
      <div class="carte kpi"><div class="libelle">Opportunités détectées</div><div class="valeur num ${opp ? "c-bon" : ""}">${opp}</div><div class="note">parmi vos analyses</div></div>
      <div class="carte kpi"><div class="libelle">Nouvelles annonces</div><div class="valeur num c-inconnu">—</div><div class="note">sources non connectées</div></div>
      <div class="carte kpi"><div class="libelle">Baisses de prix</div><div class="valeur num c-inconnu">—</div><div class="note">sources non connectées</div></div>
    </div>

    <div class="carte mt">
      <h3>Fiabilité des motorisations de la base</h3>
      <div class="barre-repartition mt">
        <span style="width:${(rep.bon / total) * 100}%;background:var(--bon)"></span>
        <span style="width:${(rep.moyen / total) * 100}%;background:var(--moyen)"></span>
        <span style="width:${(rep.mauvais / total) * 100}%;background:var(--mauvais)"></span>
      </div>
      <div class="legende"><span><i style="background:var(--bon)"></i>Favorable : ${rep.bon}</span><span><i style="background:var(--moyen)"></i>Vigilance : ${rep.moyen}</span><span><i style="background:var(--mauvais)"></i>Risque : ${rep.mauvais}</span></div>
    </div>

    <h2>Recommandations de la base</h2>
    <div class="grille grille-auto">${top.map((v) => carteVersion(v)).join("")}</div>

    <h2>Motorisations à éviter sans historique</h2>
    <div class="liste-liens">${pires.map((v) => `<a class="lien-ligne" href="#/version/${v.modele.id}/${v.moteur.id}">${pastille(v.fiabMoteur.score)}<div class="grow"><b>${esc(v.modele.marque)} ${esc(v.modele.modele)}</b> · ${esc(v.moteur.nom)}<div class="petit muted">${esc(v.moteur.defauts[0]?.titre ?? "")}</div></div><span class="chev">›</span></a>`).join("")}</div>

    ${analyses.length ? `<h2>Dernières analyses</h2><div class="liste-liens">${analyses.slice(0, 3).map(ligneAnalyse).join("")}</div>` : ""}

    <a class="lien-ligne mt-l" href="#/sources">${I.source}<div class="grow"><b>Sources et connexions</b><div class="petit muted">Ce qui est connecté, ce qui ne l'est pas encore</div></div><span class="chev">›</span></a>
  `;
}

function ligneAnalyse(a) {
  return `<a class="lien-ligne" href="#/analyse?id=${encodeURIComponent(a.id)}">${pastille(a.globale)}<div class="grow"><b>${esc(a.titre)}</b><div class="petit muted">${fmt(a.saisie.prix)} € · ${fmt(a.saisie.km)} km · ${a.saisie.annee}${a.opportunite ? ' · <span class="c-bon">Opportunité</span>' : ""}</div></div><span class="chev">›</span></a>`;
}

// ── Recherche (modes A, B, C)
function ecranRecherche(q) {
  const mode = q.get("mode") || "c";
  const seg = `<div class="segment" style="margin-bottom:16px">
    <button data-mode="c" class="${mode === "c" ? "on" : ""}">Description libre</button>
    <button data-mode="a" class="${mode === "a" ? "on" : ""}">Critères</button>
    <button data-mode="b" class="${mode === "b" ? "on" : ""}">Marque &amp; modèle</button>
  </div>`;

  if (mode === "b") {
    return `<h1>Recherche</h1>${seg}
      <p class="sous-titre">Choisissez une marque : l'application distingue chaque génération et chaque motorisation.</p>
      ${MARQUES.map((marque) => `<h2>${esc(marque)}</h2><div class="liste-liens">${MODELES.filter((m) => m.marque === marque).map((m) => {
        const vs = VERSIONS.filter((v) => v.modele.id === m.id);
        const best = Math.max(...vs.map((v) => v.fiabMoteur.score)), worst = Math.min(...vs.map((v) => v.fiabMoteur.score));
        return `<a class="lien-ligne" href="#/modele/${m.id}"><div class="grow"><b>${esc(m.modele)}</b> <span class="muted">${esc(m.generation)}</span><div class="petit muted">${plage(m.annees)} · ${vs.length} motorisation${vs.length > 1 ? "s" : ""} · fiabilité moteur ${worst === best ? best : `${worst} à ${best}`}/100</div></div><span class="chev">›</span></a>`;
      }).join("")}</div>`).join("")}`;
  }

  // Filtres : depuis la phrase (mode C) ou depuis l'URL (mode A)
  const texte = q.get("q") || "";
  let filtres, compris = [];
  if (mode === "c" && texte) ({ filtres, compris } = interpreter(texte));
  else filtres = filtresDepuisUrl(q);
  const tri = q.get("tri") || filtres.priorite || "pertinence";
  const actif = texte || mode === "a";
  const { resultats, alternatives } = actif ? rechercher(filtres, TRIS[tri] ? tri : "pertinence") : { resultats: [], alternatives: [] };

  const zoneC = `<form class="recherche-hero" id="form-recherche">
      <textarea name="q" rows="3" placeholder="Ex. : je veux une voiture performante, confortable, avec un moteur intéressant et une bonne fiabilité, pour moins de 25 000 €">${esc(texte)}</textarea>
      <button class="btn btn-principal" type="submit">${I.recherche} Chercher</button>
    </form>
    ${texte ? `<div class="carte mt"><div class="etiquette">Critères compris</div><div class="puces mt">${compris.length ? compris.map((c) => `<span class="puce statique on">${esc(c)}</span>`).join("") : '<span class="muted petit">Aucun critère reconnu : essayez d\'indiquer un budget, un carburant, un type de moteur…</span>'}</div>
      <p class="tres-petit muted mb0" style="margin-top:10px">Interprétation par mots-clés (l'IA conversationnelle sera branchée dans une prochaine version). <a href="#/recherche?${paramsDepuisFiltres(filtres, "a")}">Ajuster les critères</a></p></div>` : ""}`;

  const zoneA = formulaireCriteres(filtres);

  return `<h1>Recherche</h1>${seg}
    ${mode === "c" ? zoneC : zoneA}
    ${actif ? `
      <div class="flex entre wrap mt-l">
        <h2 style="margin:0">${resultats.length} version${resultats.length > 1 ? "s" : ""} correspondante${resultats.length > 1 ? "s" : ""}</h2>
        <select id="tri" style="width:auto">${Object.entries(TRIS).map(([k, t]) => `<option value="${k}" ${k === tri ? "selected" : ""}>Tri : ${t.nom}</option>`).join("")}</select>
      </div>
      <p class="petit muted">Résultats issus de la base de connaissances (générations × motorisations). Les annonces réelles apparaîtront ici une fois les sources connectées.</p>
      ${resultats.length ? `<div class="grille grille-auto">${resultats.map((v) => carteVersion(v)).join("")}</div>`
        : `<div class="carte vide">${I.voiture}<div>Aucune version de la base ne correspond à tous vos critères.</div></div>`}
      ${alternatives.length ? `<h2>Vous n'y aviez peut-être pas pensé</h2><p class="petit muted">Très fiables et dans le budget, mais hors d'un ou deux de vos critères.</p>
        <div class="grille grille-auto">${alternatives.map(({ v, manque }) => carteVersion(v, { raison: manque.join(", ") })).join("")}</div>` : ""}
    ` : ""}`;
}

function filtresDepuisUrl(q) {
  const liste = (k) => (q.get(k) ? q.get(k).split(",").filter(Boolean) : []);
  return {
    budget: +q.get("budget") || null, anneeMin: +q.get("annee") || null, kmMax: null,
    carburants: liste("carb"), cylindres: liste("cyl").map(Number), boite: q.get("boite") || null,
    carrosseries: liste("carro"), marques: liste("marque"), fiabMin: +q.get("fiab") || null,
    puissanceMin: +q.get("ch") || null, priorite: q.get("tri") || "pertinence",
  };
}
function paramsDepuisFiltres(f, mode) {
  const p = new URLSearchParams({ mode });
  if (f.budget) p.set("budget", f.budget);
  if (f.anneeMin) p.set("annee", f.anneeMin);
  if (f.carburants.length) p.set("carb", f.carburants.join(","));
  if (f.cylindres.length) p.set("cyl", f.cylindres.join(","));
  if (f.boite) p.set("boite", f.boite);
  if (f.carrosseries.length) p.set("carro", f.carrosseries.join(","));
  if (f.marques.length) p.set("marque", f.marques.join(","));
  if (f.fiabMin) p.set("fiab", f.fiabMin);
  if (f.puissanceMin) p.set("ch", f.puissanceMin);
  if (f.priorite && f.priorite !== "pertinence") p.set("tri", f.priorite);
  return p.toString();
}

function formulaireCriteres(f) {
  const puces = (nom, valeurs, actifs, libelle = (x) => x) =>
    `<div class="puces" data-groupe="${nom}">${valeurs.map((v) => `<button type="button" class="puce ${actifs.includes(v) ? "on" : ""}" data-val="${v}">${esc(libelle(v))}</button>`).join("")}</div>`;
  return `<form id="form-criteres" class="carte grille">
    <div class="grille grille-2">
      <div class="champ"><label>Budget maximum (€)</label><input type="number" inputmode="numeric" name="budget" value="${f.budget ?? ""}" placeholder="25000"></div>
      <div class="champ"><label>Année minimale</label><input type="number" inputmode="numeric" name="annee" value="${f.anneeMin ?? ""}" placeholder="2012"></div>
    </div>
    <div class="champ"><span class="etiquette">Carburant</span>${puces("carb", ["essence", "diesel", "hybride"], f.carburants)}</div>
    <div class="champ"><span class="etiquette">Nombre de cylindres</span>${puces("cyl", ["3", "4", "6", "8"], f.cylindres.map(String))}</div>
    <div class="champ"><span class="etiquette">Boîte de vitesses</span>${puces("boite", ["manuelle", "auto"], f.boite ? [f.boite] : [], (x) => (x === "auto" ? "automatique" : x))}</div>
    <div class="champ"><span class="etiquette">Carrosserie</span>${puces("carro", CARROSSERIES, f.carrosseries)}</div>
    <div class="champ"><span class="etiquette">Marques</span>${puces("marque", MARQUES, f.marques)}</div>
    <div class="grille grille-2">
      <div class="champ"><label>Fiabilité moteur minimale : <b id="v-fiab">${f.fiabMin ?? 0}</b>/100</label><input type="range" name="fiab" min="0" max="95" step="5" value="${f.fiabMin ?? 0}"></div>
      <div class="champ"><label>Puissance minimale (ch)</label><input type="number" inputmode="numeric" name="ch" value="${f.puissanceMin ?? ""}" placeholder="150"></div>
    </div>
    <button class="btn btn-principal btn-plein" type="submit">${I.recherche} Lancer la recherche</button>
  </form>`;
}

// ── Fiche modèle (Mode B)
function ecranModele(id) {
  const m = modeleParId[id];
  if (!m) return introuvable();
  const vs = VERSIONS.filter((v) => v.modele.id === id).sort((a, b) => b.fiabMoteur.score - a.fiabMoteur.score);
  const groupes = [
    ["À privilégier", vs.filter((v) => v.fiabMoteur.score >= 80), "bon"],
    ["Correctes, avec vigilance", vs.filter((v) => v.fiabMoteur.score >= 60 && v.fiabMoteur.score < 80), "moyen"],
    ["À éviter sans historique solide", vs.filter((v) => v.fiabMoteur.score < 60), "mauvais"],
  ];
  const boites = [...new Set(m.motorisations.flatMap((x) => x.boites))].map((b) => ({ b: boiteParId[b], n: noteFiabilite(boiteParId[b]) })).sort((a, b) => b.n.score - a.n.score);
  const problemes = vs.flatMap((v) => v.moteur.defauts.filter((d) => d.gravite >= 2).map((d) => ({ d, v })));

  return `<a class="retour" href="#/recherche?mode=b">‹ Marques et modèles</a>
    <div class="carte vehicule">
      <div class="visuel" style="height:120px"><div><div class="marque">${esc(m.marque)}</div><div style="font-size:24px;font-weight:800">${esc(m.modele)}</div><div class="muted petit">${esc(m.generation)} · ${plage(m.annees)}</div></div>${silhouette(m.carrosseries)}</div>
      <div class="corps">
        <div class="meta" style="margin-top:0"><span>${m.carrosseries.join(", ")}</span><span>Revente : ${esc(m.revente)}</span>${m.collection ? `<span>Intérêt collection : ${m.collection}/100</span>` : ""}</div>
        <div class="prix-indicatif num">${keur(m.prix[0])} – ${keur(m.prix[1])} <span class="tres-petit muted">prix indicatif, estimation non vérifiée</span></div>
        <div class="grille grille-2 mt">
          <div><div class="etiquette">Points forts</div><ul class="liste-points vert">${m.forces.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
          <div><div class="etiquette">Points faibles</div><ul class="liste-points rouge">${m.faiblesses.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
        </div>
      </div>
    </div>
    ${groupes.filter(([, l]) => l.length).map(([titre, l]) => `<h2>${titre}</h2><div class="grille grille-auto">${l.map((v) => carteVersion(v)).join("")}</div>`).join("")}
    <h2>Boîtes de vitesses</h2>
    <div class="liste-liens">${boites.map(({ b, n }) => `<a class="lien-ligne" href="#/boite/${b.id}">${pastille(n.score)}<div class="grow"><b>${esc(b.nom)}</b><div class="petit muted">${esc(b.type)}${n.score >= 80 ? " · recommandée" : n.score < 60 ? " · à éviter" : ""}</div></div><span class="chev">›</span></a>`).join("")}</div>
    <h2>Problèmes connus sur cette génération</h2>
    ${problemes.length ? `<div class="carte">${problemes.map(({ d, v }) => `<div class="defaut g${d.gravite}"><div class="t">${esc(d.titre)}</div><p>${esc(v.moteur.nom)}${d.annees ? ` · ${esc(d.annees)}` : ""}</p><div class="badges">${badgeDefaut(d)}</div></div>`).join("")}</div>` : `<p class="muted">Aucun problème important répertorié.</p>`}
    <h2>Meilleures annonces disponibles</h2>
    <div class="carte vide">${I.source}<div>Les sources d'annonces ne sont pas encore connectées.</div><a class="btn mt" href="#/analyse?modele=${m.id}">Analyser une annonce de ${esc(m.modele)}</a></div>`;
}

// ── Fiche version (modèle × motorisation)
function ecranVersion(modeleId, moteurId) {
  const v = versionParCle[`${modeleId}|${moteurId}`];
  if (!v) return introuvable();
  const { modele, mot, moteur } = v;
  const fav = stock.estFavori(v.cle), cmp = stock.dansComparateur(v.cle);
  return `<a class="retour" href="#/modele/${modele.id}">‹ ${esc(modele.marque)} ${esc(modele.modele)} ${esc(modele.generation)}</a>
    <h1>${esc(modele.marque)} ${esc(modele.modele)}<br><span class="muted" style="font-size:20px">${esc(moteur.nom)}</span></h1>
    <div class="meta"><span>${esc(modele.generation)}</span><span>${plage(mot.annees)}</span><span>${esc(moteur.carburant)}</span><span>${esc(moteur.architecture)} ${moteur.cylindree} L ${esc(moteur.alimentation)}</span><span>${mot.puissances.join(" / ")} ch</span></div>
    <div class="carte">
      <div class="jauges x4">
        ${jauge(v.fiabMoteur.score, "Fiabilité moteur", { approx: v.fiabMoteur.insuffisant })}
        ${jauge(v.meilleureBoite?.note.score ?? null, "Meilleure boîte")}
        ${jauge(v.entretien.score, "Coût d'entretien")}
        ${jauge(v.revente.score, "Revente (estim.)")}
      </div>
      ${modele.collection ? `<div class="flex mt petit"><span class="muted">Intérêt collection</span><div style="flex:1">${barre(modele.collection)}</div><b>${modele.collection}</b></div>` : ""}
      <div class="flex mt petit muted"><span>Indice de connaissance</span><div style="flex:1">${barre(moteur.connaissance)}</div><b class="num" style="color:var(--text)">${moteur.connaissance}/100</b></div>
      <div class="actions">
        <a class="btn btn-principal" href="#/analyse?modele=${modele.id}&moteur=${moteur.id}">Analyser une annonce</a>
        <button class="btn-icone ${fav ? "on" : ""}" data-fav="${v.cle}" aria-label="Favori">${fav ? I.etoilePleine : I.etoile}</button>
        <button class="btn-icone ${cmp ? "on cmp" : ""}" data-cmp="${v.cle}" aria-label="Comparer">${I.comparer}</button>
      </div>
    </div>
    <details class="repli mt"><summary>Comment la note moteur est calculée</summary><div class="contenu">${blocCalcul(v.fiabMoteur.details)}</div></details>

    <h2>Défauts connus du moteur</h2>
    ${blocDefauts(moteur.defauts)}
    <a class="lien-ligne mt" href="#/moteur/${moteur.id}">${I.analyse}<div class="grow"><b>Fiche expertise moteur ${esc(moteur.code)}</b><div class="petit muted">Présentation technique, entretien, autres modèles équipés</div></div><span class="chev">›</span></a>

    <h2>Boîtes disponibles</h2>
    ${v.boites.map(({ boite, note }) => `<details class="repli" style="margin-bottom:8px"><summary>${pastille(note.score)} <span>${esc(boite.nom)}</span></summary><div class="contenu">
      <div class="petit muted">${esc(boite.type)} · ${esc(boite.fabricant)}</div>
      ${boite.forces.length ? `<ul class="liste-points vert">${boite.forces.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      <div class="mt">${blocDefauts(boite.defauts)}</div>
      ${boite.entretien.length ? `<div class="etiquette mt">Entretien</div><ul class="liste-points">${boite.entretien.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    </div></details>`).join("")}

    <h2>À vérifier avant d'acheter</h2>
    <div class="carte">
      <ul class="liste-points">${[...moteur.entretien, ...v.boites.flatMap((b) => b.boite.entretien)].filter((x, i, a) => a.indexOf(x) === i).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="sep"></div>
      <div class="grille grille-2">
        <div><div class="etiquette c-bon">À privilégier</div><p class="petit">${esc(moteur.privilegier)}</p></div>
        <div><div class="etiquette c-mauvais">À éviter</div><p class="petit">${esc(moteur.eviter)}</p></div>
      </div>
    </div>
    ${blocSources()}`;
}

function blocSources() {
  return `<h2>Sources</h2><div class="carte petit muted">Base initiale rédigée par l'IA en novembre 2026 à partir de connaissances générales (presse spécialisée, rappels constructeurs, retours de propriétaires). Chaque information indique sa nature et son niveau de confiance. Les références détaillées et datées seront rattachées au fil de la constitution de la base.</div>`;
}

// ── Fiche moteur
function ecranMoteur(id) {
  const m = moteurParId[id];
  if (!m) return introuvable();
  const f = noteFiabilite(m);
  const vs = VERSIONS.filter((v) => v.moteur.id === id);
  return `<a class="retour" href="javascript:history.back()">‹ Retour</a>
    <div class="etiquette">Fiche expertise moteur</div>
    <h1>${esc(m.nom)}</h1>
    <div class="meta"><span>${esc(m.constructeur)}</span><span>Code ${esc(m.code)}</span></div>
    <div class="carte resume-global">
      ${jauge(f.score, "", { grande: true, approx: f.insuffisant })}
      <div class="infos">
        <div class="etiquette">Fiabilité moteur</div>
        <div style="font-weight:750;font-size:17px" class="c-${niveau(f.score)}">${NIV_TEXTE[niveau(f.score)]}</div>
        <div class="petit muted mt">Coût d'entretien : <b style="color:var(--text)">${esc(m.coutEntretien)}</b></div>
        <div class="petit muted">Indice de connaissance : <b style="color:var(--text)">${m.connaissance}/100</b></div>
        <div class="petit muted">Durée de vie indicative : <b style="color:var(--text)">${fmt(m.kmReference)} km</b></div>
      </div>
    </div>
    <h2>Présentation technique</h2>
    <div class="carte"><table class="comparatif" style="min-width:0">
      <tr><th>Carburant</th><td>${esc(m.carburant)}</td></tr>
      <tr><th>Architecture</th><td>${esc(m.architecture)}</td></tr>
      <tr><th>Cylindrée</th><td>${m.cylindree} L</td></tr>
      <tr><th>Alimentation</th><td>${esc(m.alimentation)}</td></tr>
      <tr><th>Distribution</th><td>${esc(m.distribution)}</td></tr>
    </table></div>
    <h2>Points forts</h2><div class="carte"><ul class="liste-points vert" style="margin:0">${m.forces.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <h2>Défauts connus</h2>${blocDefauts(m.defauts)}
    <details class="repli mt"><summary>Calcul de la note</summary><div class="contenu">${blocCalcul(f.details)}</div></details>
    <h2>Entretien</h2><div class="carte"><ul class="liste-points" style="margin:0">${m.entretien.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <h2>Années et versions</h2>
    <div class="carte grille grille-2">
      <div><div class="etiquette c-bon">À privilégier</div><p class="petit">${esc(m.privilegier)}</p></div>
      <div><div class="etiquette c-mauvais">À éviter</div><p class="petit">${esc(m.eviter)}</p></div>
    </div>
    <h2>Avis des propriétaires</h2>
    <div class="carte petit muted">La collecte automatique d'avis (forums, communautés) n'est pas encore connectée. Les défauts marqués « Témoignages » ci-dessus en sont une première synthèse.</div>
    <h2>Modèles équipés dans la base</h2>
    <div class="liste-liens">${vs.map((v) => `<a class="lien-ligne" href="#/version/${v.modele.id}/${id}"><div class="grow"><b>${esc(v.modele.marque)} ${esc(v.modele.modele)}</b> ${esc(v.modele.generation)}<div class="petit muted">${plage(v.mot.annees)} · ${v.mot.puissances.join(" / ")} ch</div></div><span class="chev">›</span></a>`).join("")}</div>
    ${blocSources()}`;
}

function ecranBoite(id) {
  const b = boiteParId[id];
  if (!b) return introuvable();
  const n = noteFiabilite(b);
  const modeles = MODELES.filter((m) => m.motorisations.some((x) => x.boites.includes(id)));
  return `<a class="retour" href="javascript:history.back()">‹ Retour</a>
    <div class="etiquette">Fiche boîte de vitesses</div>
    <h1>${esc(b.nom)}</h1>
    <div class="meta"><span>${esc(b.type)}</span><span>${esc(b.fabricant)}</span></div>
    <div class="carte resume-global">${jauge(n.score, "", { grande: true, approx: n.insuffisant })}
      <div class="infos"><div class="etiquette">Fiabilité boîte</div><div style="font-weight:750;font-size:17px" class="c-${niveau(n.score)}">${NIV_TEXTE[niveau(n.score)]}</div>
      <div class="petit muted mt">Coût d'entretien : <b style="color:var(--text)">${esc(b.coutEntretien)}</b></div><div class="petit muted">Indice de connaissance : <b style="color:var(--text)">${b.connaissance}/100</b></div></div></div>
    ${b.forces.length ? `<h2>Points forts</h2><div class="carte"><ul class="liste-points vert" style="margin:0">${b.forces.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
    <h2>Défauts connus</h2>${blocDefauts(b.defauts)}
    <details class="repli mt"><summary>Calcul de la note</summary><div class="contenu">${blocCalcul(n.details)}</div></details>
    ${b.entretien.length ? `<h2>Entretien</h2><div class="carte"><ul class="liste-points" style="margin:0">${b.entretien.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
    <h2>Modèles équipés dans la base</h2>
    <div class="liste-liens">${modeles.map((m) => `<a class="lien-ligne" href="#/modele/${m.id}"><div class="grow"><b>${esc(m.marque)} ${esc(m.modele)}</b> ${esc(m.generation)}</div><span class="chev">›</span></a>`).join("")}</div>`;
}

// ── Analyse d'une annonce
let derniereAnalyse = null;

function ecranAnalyse(q) {
  const enregistree = q.get("id") ? stock.analyses().find((a) => a.id === q.get("id")) : null;
  const s = enregistree?.saisie ?? {
    lien: "", modeleId: q.get("modele") || "", moteurId: q.get("moteur") || "", boiteId: "",
    annee: "", km: "", prix: "", valeur: "", historique: "inconnu", proprietaires: "", ct: "inconnu", vendeur: "particulier",
  };
  const poids = enregistree?.poids ?? stock.poids() ?? { ...PROFILS.fiabilite.poids };
  const optModeles = MARQUES.map((mq) => `<optgroup label="${esc(mq)}">${MODELES.filter((m) => m.marque === mq).map((m) => `<option value="${m.id}" ${m.id === s.modeleId ? "selected" : ""}>${esc(m.modele)} ${esc(m.generation)} (${plage(m.annees)})</option>`).join("")}</optgroup>`).join("");
  const seg = (nom, opts, val) => `<div class="segment" data-seg="${nom}">${opts.map(([v, l]) => `<button type="button" data-val="${v}" class="${v === val ? "on" : ""}">${l}</button>`).join("")}</div><input type="hidden" name="${nom}" value="${esc(val)}">`;

  return `<h1>Analyser une annonce</h1>
    <p class="sous-titre">Importez une annonce ou renseignez ses informations : l'application calcule les notes, détecte les risques et les incohérences.</p>
    <div class="carte zone-import" id="zone-import">
      <div class="flex" style="align-items:flex-start">${I.importer}<div><h3>Importer une annonce</h3>
        <div class="petit muted">Sur l'annonce (Leboncoin, La Centrale, AutoScout24, mobile.de…), sélectionnez tout le texte et copiez-le, puis collez-le ici. Sur iPad ou ordinateur, vous pouvez aussi le glisser-déposer.</div></div></div>
      <textarea id="texte-annonce" rows="4" placeholder="Collez ou glissez ici le texte de l'annonce…"></textarea>
      <div class="rangee-btns">
        <button type="button" class="btn" id="btn-coller">${I.coller} Coller</button>
        <button type="button" class="btn btn-principal" id="btn-extraire" style="flex:1">Remplir l'analyse</button>
      </div>
      <div id="retour-import"></div>
    </div>
    <div class="flex mt-l" style="margin-bottom:12px"><div class="sep" style="flex:1;margin:0"></div><span class="petit muted">ou saisie manuelle</span><div class="sep" style="flex:1;margin:0"></div></div>
    <form id="form-analyse" class="grille">
      <div class="carte grille">
        <div class="champ"><label>Lien de l'annonce (facultatif)</label><input type="url" name="lien" value="${esc(s.lien)}" placeholder="https://www.leboncoin.fr/…">
          <span class="tres-petit muted">La lecture automatique des annonces n'est pas encore connectée : le lien est conservé pour vous y retrouver.</span></div>
        <div class="champ"><label>Modèle et génération</label><select name="modeleId" required><option value="">Choisir…</option>${optModeles}</select></div>
        <div class="grille grille-2">
          <div class="champ"><label>Motorisation</label><select name="moteurId" required></select></div>
          <div class="champ"><label>Boîte</label><select name="boiteId" required></select></div>
        </div>
        <div class="grille grille-3">
          <div class="champ"><label>Année</label><input type="number" inputmode="numeric" name="annee" value="${esc(s.annee)}" placeholder="2017" required></div>
          <div class="champ"><label>Kilométrage</label><input type="number" inputmode="numeric" name="km" value="${esc(s.km)}" placeholder="98000" required></div>
          <div class="champ"><label>Prix (€)</label><input type="number" inputmode="numeric" name="prix" value="${esc(s.prix)}" placeholder="12500" required></div>
        </div>
        <div class="champ"><label>Valeur de marché estimée (€, facultatif)</label><input type="number" inputmode="numeric" name="valeur" value="${esc(s.valeur)}" placeholder="Cote La Centrale, L'argus, prix d'annonces comparables…">
          <span class="tres-petit muted">Sans cote, la note de prix n'est pas calculée : l'application ne l'invente pas.</span></div>
      </div>
      <div class="carte grille">
        <div class="champ"><span class="etiquette">Historique d'entretien</span>${seg("historique", [["complet", "Complet"], ["partiel", "Partiel"], ["inconnu", "Inconnu"]], s.historique)}</div>
        <div class="champ"><span class="etiquette">Contrôle technique</span>${seg("ct", [["ok", "Favorable"], ["defauts", "Défauts"], ["inconnu", "Inconnu"]], s.ct)}</div>
        <div class="champ"><span class="etiquette">Vendeur</span>${seg("vendeur", [["particulier", "Particulier"], ["pro", "Professionnel"]], s.vendeur)}</div>
        <div class="champ"><label>Nombre de propriétaires (si connu)</label><input type="number" inputmode="numeric" name="proprietaires" value="${esc(s.proprietaires)}" placeholder="—"></div>
      </div>
      <details class="repli"><summary>Mes priorités (pondérations)</summary><div class="contenu grille">
        <div class="puces" id="profils">${Object.entries(PROFILS).map(([k, p]) => `<button type="button" class="puce" data-profil="${k}">${esc(p.nom)}</button>`).join("")}</div>
        ${Object.entries(LIBELLES_NOTES).map(([k, l]) => `<div class="champ"><label>${esc(l)} : <b data-v="${k}">${poids[k] ?? 0}</b> %</label><input type="range" min="0" max="50" step="5" name="p_${k}" value="${poids[k] ?? 0}"></div>`).join("")}
        <div class="tres-petit muted">Les pondérations sont ramenées à 100 % sur les notes disponibles.</div>
      </div></details>
      <button class="btn btn-principal btn-plein" type="submit">${I.analyse} Analyser</button>
    </form>
    <div id="resultat-analyse"></div>`;
}

function resultatAnalyse(r, saisie) {
  const ordre = ["moteur", "boite", "entretien", "prix", "kilometrage", "etat", "revente"];
  const titre = `${r.modele.marque} ${r.modele.modele} ${r.moteur.nom}`;
  const tri = { risque: 0, vigilance: 1, info: 2 };
  const alertes = [...r.alertes].sort((a, b) => tri[a.niveau] - tri[b.niveau]);
  const approx = r.confiance === "faible";
  return `<h2 id="ancre-resultat">Résultat</h2>
    <div class="carte resume-global apparition">
      ${jauge(r.globale, "", { grande: true, approx })}
      <div class="infos">
        <div class="etiquette">Note globale d'opportunité</div>
        <div style="font-weight:750;font-size:16px">${esc(titre)}</div>
        <div class="petit muted">${saisie.annee} · ${fmt(saisie.km)} km · ${fmt(saisie.prix)} €</div>
        <div class="badges mt">
          <span class="badge ${r.confiance === "élevée" ? "bon" : r.confiance === "moyenne" ? "moyen" : "mauvais"}">Confiance ${esc(r.confiance)}</span>
          ${r.opportunite ? `<span class="badge bon">Opportunité détectée</span>` : ""}
          ${r.couverture < 1 ? `<span class="badge">${Math.round(r.couverture * 100)} % des critères notés</span>` : ""}
        </div>
      </div>
    </div>
    ${r.globale == null ? `<p class="petit muted">Données insuffisantes pour une note globale fiable.</p>` : ""}
    <h2>Alertes</h2>
    ${alertes.length ? alertes.map((a) => `<div class="alerte ${a.niveau}">${a.niveau === "info" ? I.info : I.alerte}<div><div class="t">${esc(a.titre)}</div><div class="x">${esc(a.texte)}</div></div></div>`).join("") : `<div class="alerte info">${I.info}<div><div class="t">Aucune alerte détectée</div><div class="x">Cela ne remplace pas une inspection : faites contrôler le véhicule avant l'achat.</div></div></div>`}
    <h2>Notes détaillées</h2>
    <div class="carte">${ordre.map((k) => {
      const n = r.notes[k];
      return `<div class="ligne-note"><span class="nom">${esc(LIBELLES_NOTES[k])}</span><span class="val c-${niveau(n.score)}">${n.score == null ? "Non calculée" : `${n.insuffisant ? "≈" : ""}${n.score}/100`}</span>${barre(n.score)}
        <details><summary>Explication</summary>${blocCalcul(n.details)}</details></div>`;
    }).join("")}</div>
    <h2>Risques à vérifier pour ${saisie.annee}</h2>
    ${r.risques.length ? r.risques.map((d) => `<div class="defaut g${d.gravite}"><div class="t">${esc(d.titre)} <span class="muted petit">(${esc(d.element)})</span></div><p>${esc(d.detail)}</p><div class="badges">${badgeDefaut(d)}</div></div>`).join("") : `<p class="muted petit">Aucun défaut répertorié pour cette année. L'absence d'information n'est pas une absence de problème.</p>`}
    <h2>Vérifications</h2>
    <div class="carte grille">
      ${[["Kilométrage", saisie.historique === "complet" ? "part" : "off", saisie.historique === "complet" ? "Partiellement vérifié (historique)" : "Non vérifié"],
        ["Historique administratif (HistoVec)", "off", "À demander au vendeur"],
        ["Rappels constructeur", "part", "Rappels connus listés ci-dessus"],
        ["Rapport d'historique payant", "off", "Non connecté (niveau 4)"]].map(([l, c, t]) => `<div class="flex entre"><span class="petit">${l}</span><span class="statut ${c}">${t}</span></div>`).join("")}
    </div>
    <div class="rangee-btns mt-l">
      <button class="btn btn-principal" id="btn-enregistrer">${I.etoile} Enregistrer l'analyse</button>
      <a class="btn" href="#/version/${r.modele.id}/${r.moteur.id}">Fiche du véhicule</a>
      ${saisie.lien ? `<a class="btn" href="${esc(saisie.lien)}" target="_blank" rel="noopener">Annonce originale</a>` : ""}
    </div>`;
}

// ── Comparateur
function ecranComparer() {
  const vs = stock.comparateur().map((c) => versionParCle[c]).filter(Boolean);
  if (!vs.length) return `<h1>Comparateur</h1><div class="carte vide">${I.comparer}<div>Ajoutez jusqu'à 3 véhicules avec le bouton ${I.comparer.replace("<svg", '<svg style="width:16px;height:16px;vertical-align:-3px;margin:0"')} sur leurs cartes.</div><a class="btn mt" href="#/recherche">Lancer une recherche</a></div>`;
  const ligne = (lib, f) => `<tr><th>${lib}</th>${vs.map((v) => `<td>${f(v)}</td>`).join("")}</tr>`;
  const noteCell = (s, approx) => `<div class="flex"><b class="c-${niveau(s)} num">${approx ? "≈" : ""}${s ?? "—"}</b><div style="flex:1">${barre(s)}</div></div>`;
  return `<h1>Comparateur</h1>
    <p class="sous-titre">${vs.length} véhicule${vs.length > 1 ? "s" : ""} comparé${vs.length > 1 ? "s" : ""}.</p>
    <div class="carte"><div class="table-defile"><table class="comparatif">
      <thead><tr><th></th>${vs.map((v) => `<td><a href="#/version/${v.modele.id}/${v.moteur.id}" style="color:var(--text)">${esc(v.modele.marque)} ${esc(v.modele.modele)}</a><div class="petit muted">${esc(v.moteur.nom)}</div><button class="puce mt" data-cmp="${v.cle}">Retirer</button></td>`).join("")}</tr></thead>
      <tbody>
        ${ligne("Fiabilité moteur", (v) => noteCell(v.fiabMoteur.score, v.fiabMoteur.insuffisant))}
        ${ligne("Meilleure boîte", (v) => noteCell(v.meilleureBoite?.note.score) + `<div class="tres-petit muted">${esc(v.meilleureBoite?.boite.nom.split(",")[0] ?? "")}</div>`)}
        ${ligne("Entretien", (v) => noteCell(v.entretien.score))}
        ${ligne("Revente (estim.)", (v) => noteCell(v.revente.score))}
        ${ligne("Indice de connaissance", (v) => noteCell(v.moteur.connaissance))}
        ${ligne("Prix indicatif", (v) => `<span class="num">${keur(v.modele.prix[0])} – ${keur(v.modele.prix[1])}</span>`)}
        ${ligne("Années", (v) => plage(v.mot.annees))}
        ${ligne("Puissance", (v) => `${v.mot.puissances.join(" / ")} ch`)}
        ${ligne("Moteur", (v) => `${esc(v.moteur.architecture)}, ${v.moteur.cylindree} L ${esc(v.moteur.alimentation)}`)}
        ${ligne("Carburant", (v) => esc(v.moteur.carburant))}
        ${ligne("Distribution", (v) => esc(v.moteur.distribution))}
        ${ligne("Défauts majeurs", (v) => { const n = v.moteur.defauts.filter((d) => d.gravite === 3).length; return `<b class="${n ? "c-mauvais" : "c-bon"}">${n}</b>`; })}
      </tbody></table></div></div>`;
}

// ── Favoris
function ecranFavoris() {
  const vs = stock.favoris().map((c) => versionParCle[c]).filter(Boolean);
  const analyses = stock.analyses();
  return `<h1>Favoris</h1>
    <h2>Véhicules suivis</h2>
    ${vs.length ? `<div class="grille grille-auto">${vs.map((v) => carteVersion(v)).join("")}</div>` : `<div class="carte vide">${I.etoile}<div>Touchez l'étoile d'un véhicule pour le suivre ici.</div></div>`}
    <h2>Annonces analysées</h2>
    ${analyses.length ? `<div class="liste-liens">${analyses.map(ligneAnalyse).join("")}</div>` : `<div class="carte vide">${I.analyse}<div>Vos analyses enregistrées apparaîtront ici.</div><a class="btn mt" href="#/analyse">Analyser une annonce</a></div>`}
    <h2>Alertes et notifications</h2>
    <div class="carte petit muted">Le suivi automatique des prix et les notifications de nouvelles opportunités nécessitent la connexion de sources d'annonces. Ils arriveront dans une prochaine version.</div>`;
}

// ── Sources
function ecranSources() {
  const sources = [
    ["Leboncoin", "off", "Collecte automatique interdite par les conditions d'utilisation. Import par copier-coller du texte de l'annonce disponible."],
    ["La Centrale", "off", "Pas d'API publique. Import par copier-coller disponible."],
    ["AutoScout24 (FR, BE, DE, AT)", "off", "API réservée aux professionnels. Import par copier-coller disponible."],
    ["mobile.de (DE)", "off", "API réservée aux professionnels. Import par copier-coller disponible (texte allemand reconnu)."],
    ["Willhaben (AT) / 2ememain (BE)", "off", "À étudier."],
    ["HistoVec", "part", "Gratuit, mais le rapport doit être fourni par le vendeur. L'application vous le rappelle."],
    ["RappelConso (rappels officiels)", "part", "Rappels majeurs intégrés manuellement dans la base ; connexion automatique à venir."],
    ["Rapports d'historique payants", "off", "Niveau 4 : uniquement pour les véhicules présélectionnés, après accord avec un fournisseur."],
    ["Intelligence artificielle (compréhension, synthèse)", "off", "Nécessite une clé d'API côté serveur (payante). Interprétation par mots-clés en attendant."],
    ["Base de connaissances", "part", `${MOTEURS.length} moteurs, ${BOITES.length} boîtes, ${MODELES.length} générations. Première rédaction par IA, à vérifier.`],
  ];
  return `<h1>Sources et connexions</h1>
    <p class="sous-titre">Ce que l'application utilise réellement aujourd'hui.</p>
    <div class="carte grille">${sources.map(([n, s, t]) => `<div><div class="flex entre"><b>${esc(n)}</b><span class="statut ${s}">${{ on: "Connecté", off: "Non connecté", part: "Partiel" }[s]}</span></div><div class="petit muted">${esc(t)}</div></div>`).join('<div class="sep" style="margin:2px 0"></div>')}</div>
    <h2>Comment sont calculées les notes</h2>
    <div class="carte petit">
      <p style="margin-top:0"><b>Fiabilité (moteur, boîte)</b> : note de départ de 95, puis retrait pour chaque défaut connu, selon sa gravité (5, 12 ou 25 points), sa récurrence (confirmée ×1, fréquente ×0,7, occasionnelle ×0,4, isolée ×0,15) et la confiance dans l'information. Un élément peu documenté est rapproché d'une note neutre de 70 : il n'est présumé ni fiable ni fragile.</p>
      <p><b>Kilométrage</b> : rapporté à la durée de vie indicative du moteur et à l'âge du véhicule.</p>
      <p><b>Prix</b> : calculé uniquement si vous renseignez une valeur de marché. Jamais inventé.</p>
      <p style="margin-bottom:0"><b>Note globale</b> : moyenne pondérée selon vos priorités, ramenée aux notes disponibles, avec un niveau de confiance.</p>
    </div>
    <p class="tres-petit muted mt-l">AUTO INTELLIGENCE · version 0.2 · Les informations fournies sont indicatives et ne remplacent pas l'inspection d'un professionnel.</p>`;
}

function introuvable() {
  return `<div class="carte vide">${I.voiture}<div>Page introuvable.</div><a class="btn mt" href="#/">Retour à l'accueil</a></div>`;
}

// ─────────────────────────── Routage ───────────────────────────
function lireRoute() {
  const h = location.hash.replace(/^#/, "") || "/";
  const [chemin, qs] = h.split("?");
  return { parts: chemin.split("/").filter(Boolean), q: new URLSearchParams(qs || "") };
}

function rendre() {
  const { parts, q } = lireRoute();
  const main = $("#app");
  let html, onglet;
  switch (parts[0]) {
    case undefined: html = ecranAccueil(); onglet = "accueil"; break;
    case "recherche": html = ecranRecherche(q); onglet = "recherche"; break;
    case "modele": html = ecranModele(parts[1]); onglet = "recherche"; break;
    case "version": html = ecranVersion(parts[1], parts[2]); onglet = "recherche"; break;
    case "moteur": html = ecranMoteur(parts[1]); onglet = "recherche"; break;
    case "boite": html = ecranBoite(parts[1]); onglet = "recherche"; break;
    case "analyse": html = ecranAnalyse(q); onglet = "analyse"; break;
    case "comparer": html = ecranComparer(); onglet = "comparer"; break;
    case "favoris": html = ecranFavoris(); onglet = "favoris"; break;
    case "sources": html = ecranSources(); onglet = "accueil"; break;
    default: html = introuvable();
  }
  main.innerHTML = (parts[0] === undefined ? BANDEAU : "") + html;
  $$(".onglets a").forEach((a) => a.classList.toggle("actif", a.dataset.onglet === onglet));
  majPastilles();
  if (parts[0] === "analyse") brancherAnalyse(q);
  if (parts[0] === "recherche") brancherRecherche(q);
  if (parts[0] === undefined) brancherAccueil();
}

function majPastilles() {
  const n = stock.comparateur().length;
  const p = $('.onglets a[data-onglet="comparer"] .pastille');
  p.textContent = n;
  p.style.display = n ? "grid" : "none";
}

// ─────────────────────────── Interactions ───────────────────────────
function brancherAccueil() {
  $("#form-accueil")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = new FormData(e.target).get("q").trim();
    if (v) location.hash = `#/recherche?q=${encodeURIComponent(v)}`;
  });
}

function brancherRecherche(q) {
  $$("[data-mode]").forEach((b) => b.addEventListener("click", () => { location.hash = `#/recherche?mode=${b.dataset.mode}`; }));
  $("#form-recherche")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = new FormData(e.target).get("q").trim();
    location.hash = `#/recherche?q=${encodeURIComponent(v)}`;
  });
  $("#tri")?.addEventListener("change", (e) => {
    q.set("tri", e.target.value);
    location.hash = `#/recherche?${q.toString()}`;
  });
  const form = $("#form-criteres");
  if (form) {
    form.addEventListener("click", (e) => {
      const p = e.target.closest(".puce");
      if (!p) return;
      const groupe = p.parentElement.dataset.groupe;
      if (groupe === "boite") $$(".puce", p.parentElement).forEach((x) => x !== p && x.classList.remove("on"));
      p.classList.toggle("on");
    });
    form.fiab.addEventListener("input", (e) => { $("#v-fiab").textContent = e.target.value; });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const sel = (g) => $$(`[data-groupe="${g}"] .puce.on`).map((x) => x.dataset.val);
      const f = {
        budget: +form.budget.value || null, anneeMin: +form.annee.value || null,
        carburants: sel("carb"), cylindres: sel("cyl").map(Number), boite: sel("boite")[0] || null,
        carrosseries: sel("carro"), marques: sel("marque"), fiabMin: +form.fiab.value || null,
        puissanceMin: +form.ch.value || null, priorite: q.get("tri") || "pertinence",
      };
      location.hash = `#/recherche?${paramsDepuisFiltres(f, "a")}`;
    });
  }
}

function brancherAnalyse(q) {
  const form = $("#form-analyse");
  const enregistree = q.get("id") ? stock.analyses().find((a) => a.id === q.get("id")) : null;
  const saisieInit = enregistree?.saisie ?? { moteurId: q.get("moteur") || "", boiteId: "" };

  const remplirMoteurs = (moteurVoulu) => {
    const m = modeleParId[form.modeleId.value];
    form.moteurId.innerHTML = m ? m.motorisations.map((x) => `<option value="${x.moteur}" ${x.moteur === moteurVoulu ? "selected" : ""}>${esc(moteurParId[x.moteur].nom)}</option>`).join("") : `<option value="">—</option>`;
  };
  const remplirBoites = (boiteVoulue) => {
    const m = modeleParId[form.modeleId.value];
    const mot = m?.motorisations.find((x) => x.moteur === form.moteurId.value);
    form.boiteId.innerHTML = mot ? mot.boites.map((b) => `<option value="${b}" ${b === boiteVoulue ? "selected" : ""}>${esc(boiteParId[b].nom)}</option>`).join("") : `<option value="">—</option>`;
  };
  remplirMoteurs(saisieInit.moteurId);
  remplirBoites(saisieInit.boiteId);
  form.modeleId.addEventListener("change", () => { remplirMoteurs(); remplirBoites(); });
  form.moteurId.addEventListener("change", () => remplirBoites());

  $$("[data-seg]", form).forEach((s) => s.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("button", s).forEach((x) => x.classList.toggle("on", x === b));
    form[s.dataset.seg].value = b.dataset.val;
  }));

  const majPoids = () => Object.keys(LIBELLES_NOTES).forEach((k) => { $(`[data-v="${k}"]`).textContent = form[`p_${k}`].value; });
  form.addEventListener("input", (e) => { if (e.target.name?.startsWith("p_")) majPoids(); });
  $$("[data-profil]").forEach((b) => b.addEventListener("click", () => {
    const p = PROFILS[b.dataset.profil].poids;
    for (const k of Object.keys(LIBELLES_NOTES)) form[`p_${k}`].value = p[k] ?? 0;
    majPoids();
    toast(`Profil « ${PROFILS[b.dataset.profil].nom} » appliqué`);
  }));

  const lancer = (defiler) => {
    const fd = new FormData(form);
    const saisie = {
      lien: (fd.get("lien") || "").trim(), modeleId: fd.get("modeleId"), moteurId: fd.get("moteurId"), boiteId: fd.get("boiteId"),
      annee: +fd.get("annee"), km: +fd.get("km"), prix: +fd.get("prix"), valeur: +fd.get("valeur") || 0,
      historique: fd.get("historique"), ct: fd.get("ct"), vendeur: fd.get("vendeur"), proprietaires: +fd.get("proprietaires") || 0,
    };
    if (!saisie.modeleId || !saisie.moteurId || !saisie.boiteId || !saisie.annee || !saisie.prix || fd.get("km") === "") {
      toast("Complétez le modèle, l'année, le kilométrage et le prix");
      return;
    }
    if (saisie.annee < 1950 || saisie.annee > ANNEE_COURANTE + 1) { toast("Année invalide"); return; }
    const poids = Object.fromEntries(Object.keys(LIBELLES_NOTES).map((k) => [k, +fd.get(`p_${k}`)]));
    stock.setPoids(poids);
    const r = analyserAnnonce(saisie, poids);
    derniereAnalyse = { r, saisie, poids, id: enregistree?.id };
    $("#resultat-analyse").innerHTML = resultatAnalyse(r, saisie);
    $("#btn-enregistrer").addEventListener("click", enregistrer);
    if (defiler) $("#ancre-resultat").scrollIntoView({ behavior: "smooth", block: "start" });
  };
  form.addEventListener("submit", (e) => { e.preventDefault(); lancer(true); });
  if (enregistree) lancer(false);
  brancherImport(form, { remplirMoteurs, remplirBoites, lancer });
}

// ── Import d'annonce (coller / glisser-déposer)
function brancherImport(form, { remplirMoteurs, remplirBoites, lancer }) {
  const zone = $("#zone-import"), zoneTexte = $("#texte-annonce"), retour = $("#retour-import");

  const choisirSegment = (nom, val) => {
    const s = $(`[data-seg="${nom}"]`, form);
    $$("button", s).forEach((b) => b.classList.toggle("on", b.dataset.val === val));
    form[nom].value = val;
  };
  const marquer = (el) => { el.classList.add("rempli"); setTimeout(() => el.classList.remove("rempli"), 2500); };

  const extraire = () => {
    const texte = zoneTexte.value.trim();
    if (texte.length < 10) { toast("Collez d'abord le texte d'une annonce"); return; }
    const { champs, reconnus, aVerifier, marqueHorsBase } = extraireAnnonce(texte);

    if (champs.modeleId) {
      form.modeleId.value = champs.modeleId; marquer(form.modeleId);
      remplirMoteurs(champs.moteurId); marquer(form.moteurId);
      remplirBoites(champs.boiteId); marquer(form.boiteId);
    }
    for (const k of ["lien", "annee", "km", "prix", "proprietaires"]) {
      if (champs[k] != null) { form[k].value = champs[k]; marquer(form[k]); }
    }
    for (const k of ["historique", "ct", "vendeur"]) if (champs[k]) choisirSegment(k, champs[k]);

    retour.innerHTML = `<div class="sep"></div>
      ${reconnus.length ? `<div class="etiquette">Informations trouvées</div><div class="puces mt">${reconnus.map(([l, v]) => `<span class="puce statique on"><span class="muted">${esc(l)} :</span> ${esc(v)}</span>`).join("")}</div>` : ""}
      ${marqueHorsBase ? `<div class="alerte vigilance mt">${I.alerte}<div><div class="t">${esc(marqueHorsBase)} n'est pas encore dans la base</div><div class="x">La marque est reconnue, mais ses modèles n'ont pas encore de fiche : l'analyse complète sera possible quand elle aura été ajoutée.</div></div></div>`
        : aVerifier.length ? `<div class="alerte vigilance mt">${I.alerte}<div><div class="t">À vérifier ou compléter : ${esc(aVerifier.join(", "))}</div><div class="x">Corrigez ces champs dans le formulaire ci-dessous, puis touchez Analyser.</div></div></div>` : ""}
      ${champs.historique || champs.ct ? `<p class="tres-petit muted">L'historique et le contrôle technique sont repris de ce qu'annonce le vendeur : demandez les justificatifs.</p>` : ""}`;

    const complet = champs.modeleId && champs.annee && champs.km != null && champs.prix;
    if (complet && !aVerifier.length) {
      lancer(true);
      toast("Annonce importée et analysée");
    } else {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      toast(reconnus.length ? "Annonce importée : vérifiez les champs" : "Aucune information reconnue");
    }
  };

  $("#btn-extraire").addEventListener("click", extraire);
  zoneTexte.addEventListener("paste", () => setTimeout(extraire, 50));
  $("#btn-coller").addEventListener("click", async () => {
    try {
      const texte = await navigator.clipboard.readText();
      if (!texte) throw new Error("vide");
      zoneTexte.value = texte;
      extraire();
    } catch {
      zoneTexte.focus();
      toast("Touchez longuement la zone de texte, puis « Coller »");
    }
  });

  // Glisser-déposer : texte, lien, page HTML ou fichier texte
  ["dragenter", "dragover"].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add("survol"); }));
  ["dragleave", "drop"].forEach((ev) => zone.addEventListener(ev, () => zone.classList.remove("survol")));
  zone.addEventListener("drop", async (e) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    let texte = dt.getData("text/plain") || dt.getData("text/uri-list");
    if (!texte && dt.getData("text/html")) {
      texte = new DOMParser().parseFromString(dt.getData("text/html"), "text/html").body.innerText;
    }
    const fichier = dt.files?.[0];
    if (!texte && fichier) {
      if (fichier.type.startsWith("image/")) { toast("Les captures d'écran ne sont pas encore lues : copiez le texte de l'annonce"); return; }
      texte = await fichier.text();
      if (/html/.test(fichier.type) || /<html/i.test(texte)) texte = new DOMParser().parseFromString(texte, "text/html").body.innerText;
    }
    if (!texte) { toast("Contenu non reconnu"); return; }
    zoneTexte.value = texte;
    extraire();
  });
}

function enregistrer() {
  if (!derniereAnalyse) return;
  const { r, saisie, poids } = derniereAnalyse;
  const id = derniereAnalyse.id || `a${Date.now()}`;
  derniereAnalyse.id = id;
  stock.ajouterAnalyse({
    id, date: new Date().toISOString(), saisie, poids,
    titre: `${r.modele.marque} ${r.modele.modele} · ${r.moteur.nom}`,
    globale: r.globale, opportunite: r.opportunite,
  });
  toast("Analyse enregistrée dans vos favoris");
}

document.addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) {
    const ajoute = stock.basculerFavori(fav.dataset.fav);
    toast(ajoute ? "Ajouté aux favoris" : "Retiré des favoris");
    fav.classList.toggle("on", ajoute);
    fav.innerHTML = ajoute ? I.etoilePleine : I.etoile;
    return;
  }
  const cmp = e.target.closest("[data-cmp]");
  if (cmp) {
    const ajoute = stock.basculerComparateur(cmp.dataset.cmp);
    toast(ajoute ? "Ajouté au comparateur (3 max.)" : "Retiré du comparateur");
    if (location.hash.startsWith("#/comparer")) rendre();
    else { cmp.classList.toggle("on", ajoute); cmp.classList.toggle("cmp", ajoute); majPastilles(); }
  }
});

// ─────────────────────────── Thème & démarrage ───────────────────────────
function appliquerTheme(t) {
  document.documentElement.dataset.theme = t;
  $("#btn-theme").innerHTML = t === "clair" ? I.lune : I.soleil;
  $('meta[name="theme-color"]').setAttribute("content", t === "clair" ? "#f4f6fa" : "#0a0c11");
}

function demarrer() {
  $("#logo").innerHTML = `${I.logo}<div>AUTO INTELLIGENCE<small>Expert automobile d'occasion</small></div>`;
  for (const [k, ic] of Object.entries({ accueil: I.accueil, recherche: I.recherche, analyse: I.analyse, comparer: I.comparer, favoris: I.etoile })) {
    $(`.onglets a[data-onglet="${k}"] .ic`).innerHTML = ic;
  }
  appliquerTheme(stock.theme());
  $("#btn-theme").addEventListener("click", () => {
    const t = document.documentElement.dataset.theme === "clair" ? "sombre" : "clair";
    stock.setTheme(t);
    appliquerTheme(t);
  });
  window.addEventListener("hashchange", () => { rendre(); window.scrollTo(0, 0); });
  rendre();
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

demarrer();
