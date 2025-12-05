export function normalizeText(rawText) {
  if (!rawText) return "";

  let text = rawText.toLowerCase();

  // --- Normalisation des heures/minute ---
  const dayMap = {
    lun: ["lundi", "mon", "lundi.", "lun."],
    mar: ["mardi", "tue", "mardi.", "mar."],
    mer: ["mercredi", "wed", "mercredi.", "mer."],
    jeu: ["jeudi", "thu", "jeudi.", "jeu."],
    ven: ["vendredi", "fri", "vendredi.", "ven."],
    sam: ["samedi", "sat", "samedi.", "sam."],
    dim: ["dimanche", "sun", "dimanche.", "dim."]
  };

  for (const [normalized, variants] of Object.entries(dayMap)) {
    for (const v of variants) {
      const regex = new RegExp(`\\b${v}\\b`, "gi");
      text = text.replace(regex, normalized);
    }
  }

  // --- Normalisation des heures/minute ---
  // e.g., "2h", "2 h max", "15 min" → "02:00", "00:15"
  text = text.replace(/(\d{1,2})\s*h(?:\s*max)?/g, (_, h) => {
    return `${String(h).padStart(2, "0")}:00`;
  });

  text = text.replace(/(\d{1,2})\s*(?:min|mn)/g, (_, m) => {
    return `00:${String(m).padStart(2, "0")}`;
  });

  // --- Nettoyage ponctuation et double espace ---
  text = text.replace(/\s{2,}/g, " ").trim();

  return text;
}