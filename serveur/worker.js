// Auto Intelligence : petit serveur IA (Cloudflare Worker, offre gratuite).
// Il reçoit une recherche en langage naturel et renvoie des critères structurés, en appelant l'API Claude.
// La clé d'API reste sur le serveur (variable secrète ANTHROPIC_API_KEY) : elle n'est jamais envoyée au téléphone.
//
// Variables à définir dans Cloudflare :
//   ANTHROPIC_API_KEY  (secret)  clé d'API créée sur la console Claude
//   ORIGINE_AUTORISEE            ex. https://crayavok.github.io
//   MODELE (facultatif)          identifiant de modèle Claude, par défaut claude-haiku-5-5

const CONSIGNE = `Tu transformes une demande d'achat de voiture d'occasion (en français) en critères JSON.
Réponds UNIQUEMENT par un objet JSON avec ces clés (null ou [] si non mentionné) :
{"budget": nombre en euros | null, "kmMax": nombre | null, "anneeMin": nombre | null,
 "carburants": parmi ["essence","diesel","hybride","électrique"], "cylindres": nombres parmi [3,4,6,8],
 "boite": "auto" | "manuelle" | null, "carrosseries": parmi ["citadine","compacte","berline","break","coupé","cabriolet","suv"],
 "marques": noms de marques, "fiabMin": 75 si la fiabilité est une priorité sinon null,
 "puissanceMin": nombre de ch | null (200 si « performante » ou « sportive »),
 "priorite": "fiabilite" | "entretien" | "pertinence",
 "compris": liste de courtes phrases en français résumant les critères retenus}`;

function cors(origine) {
  return {
    "Access-Control-Allow-Origin": origine,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
  };
}

export default {
  async fetch(requete, env) {
    const origine = env.ORIGINE_AUTORISEE || "https://crayavok.github.io";
    if (requete.method === "OPTIONS") return new Response(null, { headers: cors(origine) });
    const url = new URL(requete.url);
    if (requete.method !== "POST" || url.pathname !== "/interpreter") {
      return new Response("Introuvable", { status: 404, headers: cors(origine) });
    }
    if (requete.headers.get("Origin") !== origine) {
      return new Response("Origine non autorisée", { status: 403 });
    }

    const { texte } = await requete.json().catch(() => ({}));
    if (!texte || typeof texte !== "string" || texte.length > 1000) {
      return new Response(JSON.stringify({ erreur: "Texte manquant ou trop long" }), { status: 400, headers: { ...cors(origine), "content-type": "application/json" } });
    }

    const reponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2026-10-21",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.MODELE || "claude-haiku-5-5",
        max_tokens: 600,
        system: CONSIGNE,
        messages: [{ role: "user", content: texte }],
      }),
    });
    if (!reponse.ok) {
      return new Response(JSON.stringify({ erreur: `API Claude : ${reponse.status}` }), { status: 502, headers: { ...cors(origine), "content-type": "application/json" } });
    }
    const donnees = await reponse.json();
    const brut = donnees.content?.find((b) => b.type === "text")?.text ?? "{}";
    const json = brut.slice(brut.indexOf("{"), brut.lastIndexOf("}") + 1);
    return new Response(json, { headers: { ...cors(origine), "content-type": "application/json" } });
  },
};
