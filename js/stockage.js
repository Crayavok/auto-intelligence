// Stockage local (sur l'appareil). Toutes les lectures/écritures sont protégées :
// en navigation privée ou si le stockage est bloqué, l'application continue de fonctionner sans mémoire.

const PREFIXE = "autointel:";

function lire(cle, defaut) {
  try {
    const v = localStorage.getItem(PREFIXE + cle);
    return v == null ? defaut : JSON.parse(v);
  } catch { return defaut; }
}
function ecrire(cle, valeur) {
  try { localStorage.setItem(PREFIXE + cle, JSON.stringify(valeur)); } catch { /* stockage indisponible */ }
}

export const stock = {
  theme: () => lire("theme", "sombre"),
  setTheme: (t) => ecrire("theme", t),

  favoris: () => lire("favoris", []),
  estFavori: (cle) => lire("favoris", []).includes(cle),
  basculerFavori(cle) {
    const f = lire("favoris", []);
    const i = f.indexOf(cle);
    i >= 0 ? f.splice(i, 1) : f.unshift(cle);
    ecrire("favoris", f);
    return i < 0;
  },

  comparateur: () => lire("comparateur", []),
  dansComparateur: (cle) => lire("comparateur", []).includes(cle),
  basculerComparateur(cle) {
    const c = lire("comparateur", []);
    const i = c.indexOf(cle);
    if (i >= 0) c.splice(i, 1);
    else { c.push(cle); while (c.length > 3) c.shift(); }
    ecrire("comparateur", c);
    return i < 0;
  },

  analyses: () => lire("analyses", []),
  ajouterAnalyse(entree) {
    const a = lire("analyses", []).filter((x) => x.id !== entree.id);
    a.unshift(entree);
    ecrire("analyses", a.slice(0, 50));
  },
  supprimerAnalyse(id) { ecrire("analyses", lire("analyses", []).filter((x) => x.id !== id)); },

  poids: () => lire("poids", null),
  setPoids: (p) => ecrire("poids", p),
};
